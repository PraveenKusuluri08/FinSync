import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Modal,
  Button,
  Slider,
} from "@mui/material";
import { Edit, Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import AvatarEditor from "react-avatar-editor";
import { _get_user_profile_data } from "../../store/middleware/middleware";
import { Link } from "react-router-dom";
import AXIOS_INSTANCE from "../../api/axios_instance";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch: ThunkDispatch<object, object, AnyAction> = useDispatch();
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const editorRef = useRef<AvatarEditor | null>(null);

  useEffect(() => {
    dispatch(_get_user_profile_data());
  }, [dispatch]);

  console.log("profile",image)

  const { profile_data, loading } = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.user.user_profile_data
  );

  if (loading || !profile_data?.data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 4rem)">
        <CircularProgress />
      </Box>
    );
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const croppedImage = canvas.toDataURL(); // Convert cropped image to base64

      console.log("Updated Profile Image:", croppedImage);
      const formaData = new FormData()
      formaData.append("profile_image", croppedImage);
      AXIOS_INSTANCE.post("/users/updateprofile",formaData).then((response)=>{
        console.log('====================================');
        console.log(response);
        console.log('====================================');
        toast.success("Profile image updated successfully");
        setImage(croppedImage);
        setOpen(false);
      }).catch((error) => {
        console.error("Error updating profile image:", error);
        toast.error("Failed to update profile image. Please try again.");
      });
      
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 4rem)">
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", minWidth: 400, maxWidth: 600 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Profile Page
        </Typography>

        {/* Avatar Section */}
        <Box position="relative" display="flex" justifyContent="center" alignItems="center" mb={3}
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <Avatar
            src={profile_data?.data?.profile_image || "https://via.placeholder.com/150"}
            alt="Profile Picture"
            sx={{ width: 120, height: 120, border: "3px solid #ddd", cursor: "pointer" }}
          />
          {hover && (
            <IconButton
              sx={{
                position: "absolute",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                transition: "0.3s",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
              }}
              onClick={() => setOpen(true)}
            >
              <Edit />
            </IconButton>
          )}
        </Box>

        {/* User Info */}
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="subtitle1" fontWeight="bold" color="gray">
              Full Name
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1">
              {profile_data?.data?.firstname} {profile_data?.data.lastname}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" fontWeight="bold" color="gray">
              Email
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1">{profile_data?.data.email}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" fontWeight="bold" color="gray">
              Phone
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1">
              {profile_data?.data.phone_number}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* User Expenses Section */}
        <Typography variant="h6" fontWeight="bold" mt={2} mb={1}>
          Expenses
        </Typography>
        {profile_data?.data.userExpenses?.length > 0 ? (
          <List>
            {profile_data?.data.userExpenses.map((expense: any, index: number) => (
              <ListItem key={index}>
                <Link to={`/expenses/${expense._id}`}>
                  <ListItemText primary={`Expense under ${expense.merchant || "Unnamed Expense"}`}
                    secondary={`Amount: $${expense.amount || "0.00"}`} />
                </Link>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="gray">
            No expenses found.
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        {/* User Groups Section */}
        <Typography variant="h6" fontWeight="bold" mt={2} mb={1}>
          Groups
        </Typography>
        {profile_data?.data.userGroups?.length > 0 ? (
          <List>
            {profile_data?.data.userGroups.map((group: any, index: number) => (
              <ListItem key={index}>
                <ListItemText primary={`Group Name: ${group.group_name || "Unnamed Group"}`} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="gray">
            No groups found.
          </Typography>
        )}

        {/* Edit Profile Picture Modal */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450, bgcolor: "background.paper",
            boxShadow: 24, p: 3, textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center"
          }}>
            <IconButton sx={{ alignSelf: "flex-end" }} onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
            <Typography variant="h6" fontWeight="bold">Edit Profile Picture</Typography>
            
            {image ? (
              <>
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  width={250}
                  height={250}
                  border={50}
                  borderRadius={125} // Circular Crop
                  scale={scale}
                />
                <Typography variant="body2" mt={2}>Adjust Zoom</Typography>
                <Slider
                  value={scale}
                  min={1}
                  max={2}
                  step={0.1}
                  onChange={(_, newValue) => setScale(newValue as number)}
                  sx={{ width: "80%" }}
                />
              </>
            ) : (
              <Typography color="gray">No image selected</Typography>
            )}

            <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: 10 }} />

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="contained" onClick={handleSave} sx={{ mr: 2 }}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setImage(null)}>
                Reset
              </Button>
            </Box>
          </Box>
        </Modal>
      </Paper>
    </Box>
  );
};

export default Profile;
