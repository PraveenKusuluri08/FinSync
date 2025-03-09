import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { get_group_data, get_users } from "../../store/middleware/middleware";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Autocomplete,
  TextField,
  Chip,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AXIOS_INSTANCE from "../../api/axios_instance";
import { toast } from "react-toastify";

const ViewGroup = () => {
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const group_id = params.group_id;

  // Local loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (group_id) {
      setLoading(true);
      dispatch(get_group_data(group_id)).finally(() => setLoading(false));
      dispatch(get_users()); // Fetch all users
    }
  }, [group_id, dispatch]);

  // Redux state data
  const groupData = useSelector(
    (state: any) => state.groups.get_group_data?.data?.group || null
  );
  const usersData = useSelector(
    (state: any) => state.groups.get_users_for_group?.data?.users || []
  );

  // Extract users in the current group (emails array)
  const groupUsers = groupData?.users || []; // Example: ["praveenkusuluri08@gmail.com"]
  console.log("Group Users:", groupUsers);

  // Extract available users from usersData (email strings)
  const availableUsers = usersData
    .map((user: any) => user.email) // Extract only email
    .filter((email: string) => !groupUsers.includes(email)); // Exclude already added users

  // State for managing selected users
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Handle user selection
  const handleUserChange = (event: any, newUsers: string[]) => {
    setSelectedUsers(newUsers);
  };
  console.log("Selected Users:", selectedUsers);

  // Function to add selected users
  const handleSelectUser = (e: any) => {
    e.preventDefault();
    if (selectedUsers.length === 0) return;

    const payload = { users: selectedUsers };
    console.log("Sending to backend:", payload);

    AXIOS_INSTANCE.post(`/adduserstogroup/${group_id}`, payload)
      .then((res) => {
        toast.success("Users added successfully");
        navigate("/groupmgmt");
      })
      .catch((error) => {
        console.error("Error adding users to group:", error);
        toast.error("Failed to add users to group. Please try again.");
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card sx={{ width: 500, p: 3, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            Group Details
          </Typography>

          {/* Loader */}
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ minHeight: "200px" }}
            >
              <CircularProgress />
            </Box>
          ) : groupData ? (
            <>
              <Typography variant="body1">
                <b>Name:</b> {groupData.group_name}
              </Typography>
              <Typography variant="body1">
                <b>Description:</b> {groupData.group_description}
              </Typography>

              {/* Users List */}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Users:
              </Typography>
              {groupUsers.length > 0 ? (
                <List>
                  {groupUsers.map((email: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar>{email[0].toUpperCase()}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Link
                            to={`/group/${group_id}/${email}`} // ✅ BOUND URL FOR EACH USER
                            style={{
                              textDecoration: "none",
                              color: "blue",
                              fontWeight: "bold",
                            }}
                          >
                            {email}
                          </Link>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No users in this group.
                </Typography>
              )}

              {/* Add Users Section */}
              <Box sx={{ mt: 3 }}>
                <Autocomplete
                  multiple
                  options={availableUsers} // Only emails
                  value={selectedUsers}
                  onChange={handleUserChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Users" />
                  )}
                  renderTags={(selected, getTagProps) =>
                    selected.map((email, index) => (
                      <Chip
                        key={index}
                        label={email}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  sx={{ mt: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={selectedUsers.length === 0}
                  onClick={handleSelectUser}
                >
                  Add Selected Users
                </Button>
              </Box>
            </>
          ) : (
            <div>
              <LinearProgress />
              <Typography variant="body2" color="textSecondary" align="center">
                Loading group data.
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewGroup;
