import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  get_expenses_by_group_id,
  get_group_data,
  get_users,
} from "../../store/middleware/middleware";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Autocomplete,
  TextField,
  Chip,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AXIOS_INSTANCE from "../../api/axios_instance";
import { toast } from "react-toastify";

const ViewGroup = () => {
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  const currentUser = JSON.parse(localStorage.getItem("user_info") || "{}");

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
      dispatch(get_expenses_by_group_id(group_id)); // Fetch group expenses
    }
  }, [group_id, dispatch]);

  // Redux state data
  const groupData = useSelector(
    (state: any) => state.groups.get_group_data?.data?.group || null
  );
  const usersData = useSelector(
    (state: any) => state.groups.get_users_for_group?.data?.users || []
  );
  const groupExpenseData = useSelector(
    (state: any) => state.expenses.get_expenses_by_group_id?.data
  );

  console.log("====================================");
  console.log(groupExpenseData);
  console.log("====================================");

  const filteredExpenses =
    groupExpenseData?.data?.map((expense: any) => ({
      ...expense,
      users: expense.users.filter(
        (user: any) => user.user !== currentUser?.email
      ),
    })) || [];
  console.log("filteredExpenses", filteredExpenses);

  // Extract users in the current group (emails array)
  const groupUsers = groupData?.users || []; // Example: ["user1@gmail.com"]
  const availableUsers = usersData
    .map((user: any) => user.email) // Extract only email
    .filter((email: string) => !groupUsers.includes(email)); // Exclude already added users

  // State for managing selected users
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Handle user selection
  const handleUserChange = (event: any, newUsers: string[]) => {
    setSelectedUsers(newUsers);
  };

  // Function to add selected users
  const handleSelectUser = (e: any) => {
    e.preventDefault();
    if (selectedUsers.length === 0) return;

    const payload = { users: selectedUsers };
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

  console.log("====================================");
  console.log("groupData", groupData);
  console.log("====================================");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: 3,
        gap: 3,
      }}
    >
      {/* Left Panel - Group Details with Search Bar */}
      <Card sx={{ width: "40%", p: 2, boxShadow: 3, borderRadius: 3 }}>
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
                <b>Description:</b>{" "}
                {groupData.group_description || "No Description added"}
              </Typography>
              <Typography variant="body1">
                <b>Created By:</b> {groupData.created_by}
              </Typography>

              {/* Users List */}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Users:
              </Typography>
              {groupUsers.length > 0 ? (
                <List>
                  {groupUsers.map((user:any,index:any) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar>{user.email[0]?.toUpperCase()}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Link
                            to={`/group/${group_id}/${user.email}`}
                            style={{
                              textDecoration: "none",
                              color: "blue",
                              fontWeight: "bold",
                            }}
                          >
                            {user.email}
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

              {/* Search Bar to Add Users */}
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
                      <Chip label={email} {...getTagProps({ index })} />
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
            <Typography variant="body2" color="textSecondary" align="center">
              Loading group data...
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Right Panel - Expense Details */}
      <Card sx={{ width: "50%", p: 2, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            Group Expenses
          </Typography>

          {filteredExpenses && filteredExpenses.length > 0 ? (
            filteredExpenses?.map((expense: any) => (
              <Box
                key={expense._id}
                sx={{ p: 2, mb: 2, border: "1px solid #ddd", borderRadius: 2 }}
              >
                <Typography variant="h6">
                  <b>{expense.expense_name}</b>
                </Typography>
                <Typography variant="body1">
                  <b>Description:</b> {expense.expense_description}
                </Typography>
                <Typography variant="body1">
                  <b>Amount:</b> ${expense.amount}
                </Typography>
                <Typography variant="body1">
                  <b>Paid By:</b> {expense.paid_by}
                </Typography>
                <Typography variant="body1">
                  <b>Total Owed Amount:</b> {expense.total_owed_amount}
                </Typography>
                <Typography variant="body1">
                  <b>Split Type:</b> {expense.split_type}
                </Typography>

                {/* Involved Users */}
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Involved Users:
                </Typography>
                <List>
                  {expense?.users.map((user: any, index: number) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: user.isSplitCleared
                          ? "#d4edda"
                          : "transparent", // Green background if settled
                        borderRadius: 1,
                        px: 2,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: user.isSplitCleared ? "green" : "gray",
                          }}
                        >
                          {user.user[0].toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <span
                            style={{
                              textDecoration: user.isSplitCleared
                                ? "line-through"
                                : "none", // Strike-through if settled
                              color: user.isSplitCleared ? "green" : "black", // Green text if settled
                              fontWeight: user.isSplitCleared
                                ? "bold"
                                : "normal",
                            }}
                          >
                            {user.user}
                          </span>
                        }
                        secondary={`Owes: $${user.split_amount}`}
                        sx={{
                          color: user.isSplitCleared ? "green" : "black",
                          fontWeight: user.isSplitCleared ? "bold" : "normal",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" align="center">
              No expenses found for this group.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewGroup;
