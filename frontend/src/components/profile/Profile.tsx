import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { _get_user_profile_data } from "../../store/middleware/middleware";
import { Link } from "react-router-dom";

const Profile = () => {
  const dispatch: ThunkDispatch<object, object, AnyAction> = useDispatch();

  const [hover, setHover] = useState(false);

  useEffect(() => {
    dispatch(_get_user_profile_data());
  }, [dispatch]);

  // Select user profile data from Redux
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { profile_data, loading } = useSelector(
    (state: any) => state.user.user_profile_data
  );
  console.log("profile_data", profile_data);

  // Show loader while data is being fetched
  if (loading || !profile_data?.data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="calc(100vh - 4rem)"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 4rem)"
    >
      <Paper
        elevation={3}
        sx={{ p: 4, textAlign: "center", minWidth: 400, maxWidth: 600 }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Profile Page
        </Typography>

        {/* Avatar Section */}
        <Box
          position="relative"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={3}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Avatar
            src={
              profile_data?.data?.profile_image ||
              "https://via.placeholder.com/150"
            }
            alt="Profile Picture"
            sx={{
              width: 120,
              height: 120,
              border: "3px solid #ddd",
              cursor: "pointer",
            }}
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
              onClick={() => console.log("Edit Profile Picture")}
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
            {profile_data?.data.userExpenses.map(
              (expense: any, index: number) => (
                <ListItem key={index}>
                  <Link to={`/expenses/${expense._id}`}>

                  <ListItemText
                    primary={
                      "Expense under " + expense.merchant || "Unnamed Expense"
                    }
                    secondary={`Amount: $${expense.amount || "0.00"}`}
                  />
                  </Link>

                  {/* <ListItemText
                    primary={
                      expense.is_personal_expense
                        ? "Expense is personal Expense"
                        : "It is group expense"
                    }
                  /> */}
                </ListItem>
              )
            )}
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
                <ListItemText
                  primary={"Group Name: " + group.group_name || "Unnamed Group"}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="gray">
            No groups found.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Profile;
