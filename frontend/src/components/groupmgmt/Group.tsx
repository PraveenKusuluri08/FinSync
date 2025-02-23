import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Modal,
  Backdrop,
  Fade,
  Autocomplete,
  Chip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { create_group, get_users } from "../../store/middleware/middleware";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

interface User {
  email: string;
  firstname: string;
}

const Group = () => {
  const [open, setOpen] = useState(false);
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const [group, setGroup] = useState({
    group_name: "",
    users: [] as User[],
    group_type: "",
    group_description: "",
  });

  const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroup({ ...group, [e.target.name]: e.target.value });
  };

  const handleUsersChange = (event: any, newUsers: User[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userEmails = newUsers.map((user:any) => user.email);
    setGroup({ ...group, users: newUsers });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(get_users());
  }, [dispatch]);

  // Get users data from Redux
  const usersData = useSelector(
    (state: any) => state.group.get_users_for_group
  );

  console.log("====================================");
  console.log(group);
  console.log("====================================");

  const handleCreateGroup =(e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    const new_group = {
      "group_name": group.group_name,
      "participants": group.users.map((user: User) => user.email),
      "group_type": group.group_type,
      "group_description": group.group_description,
    }
    console.log(new_group)
    dispatch(create_group(new_group));
    handleClose();
    
  }

  return (
    <Box sx={{ minHeight: "80vh", p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          backgroundColor: "#f5f5f5",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          mb: 2,
          borderRadius: 4,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Groups
        </Typography>

        <Button
          endIcon={<KeyboardArrowDownIcon />}
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 20,
            bgcolor: "green",
            "&:hover": { bgcolor: "darkgreen" },
          }}
          onClick={handleOpen}
        >
          Create Group 🏘️
        </Button>
      </Paper>

      {/* Modal for Creating Group */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Create Group
            </Typography>

            <TextField
              fullWidth
              label="Group Name"
              variant="outlined"
              name="group_name"
              value={group.group_name}
              onChange={handleGroupChange}
              sx={{ mb: 2 }}
            />

            {/* Multi-Select with Firstname */}
            <Autocomplete
              multiple
              options={usersData?.data?.users ? usersData.data?.users : []} // Ensure it's an array
              getOptionLabel={(option) => option.firstname} // Show firstname
              value={group.users}
              onChange={handleUsersChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add Users"
                  placeholder="Select users"
                />
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    key={option.id}
                    label={option.firstname} // Show firstname instead of avatar
                    {...getTagProps({ index })}
                    onDelete={() => {
                      // Here, we are removing the specific user based on the ID
                      setGroup({
                        ...group,
                        users: group.users.filter((user) => user.id !== option.id), // Remove only the selected user
                      });
                    }}
                    deleteIcon={
                      <CloseIcon
                        style={{
                          color: "white",
                          backgroundColor: "red",
                          borderRadius: "50%",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                    }
                    sx={{
                      "& .MuiChip-deleteIcon": {
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                      },
                      mb: 3,
                    }}
                  />
                ))
              }
            />

            <TextField
              fullWidth
              label="Group Type"
              variant="outlined"
              name="group_type"
              value={group.group_type}
              onChange={handleGroupChange}
              sx={{ mt:2,mb: 2 }}
            />

            <TextField
              fullWidth
              label="Group Description"
              variant="outlined"
              name="group_description"
              value={group.group_description}
              onChange={handleGroupChange}
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />

            <Box display="flex" justifyContent="flex-end">
              <Button onClick={handleClose} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleCreateGroup}>
                Create
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Group;
