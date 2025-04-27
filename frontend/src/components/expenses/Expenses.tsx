import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Menu,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Tooltip,
  Tabs,
  Tab,
  Card,
  Chip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GridViewIcon from "@mui/icons-material/GridView";
import Manual_Create from "./Manual_Create";
import { useDispatch, useSelector } from "react-redux";
import { _get_expenses_data } from "../../store/middleware/middleware";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import GroupExpense from "./GroupExpense";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AXIOS_INSTANCE from "../../api/axios_instance";
import Group_Expense_Create from "./Group_Expense_Create";
import UploadReceipt from "./UploadReceipt";
import Receipts from "./Receipts"; // ✅ New Import

const categories = ["All", "Food", "Travel", "Groceries", "Entertainments"];

const Expenses = () => {
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const open = Boolean(anchorEl);

  useEffect(() => {
    dispatch(_get_expenses_data());
  }, [dispatch]);

  const expenses = useSelector((state: any) => state.expenses.expenses);
  const expensesArray =
    expenses?.data && Array.isArray(expenses.data) ? expenses.data : [];

  const filteredExpenses = expensesArray.filter((expense: any) => {
    const expenseDate = new Date(expense.date).getTime();
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() : null;

    return (
      (selectedCategory === "All" ||
        (expense.category &&
          expense.category.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase())) &&
      (!searchQuery ||
        (expense.merchant &&
          expense.merchant
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim()))) &&
      (!start || expenseDate >= start) &&
      (!end || expenseDate <= end)
    );
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleDeleteClick = async (expense: any) => {
    const ConfirmDelete = window.confirm("Are you sure you want to delete?");
    if (ConfirmDelete) {
      AXIOS_INSTANCE.delete(`/deleteeexpense/${expense._id}`)
        .then((res) => {
          toast.success("Expense Deleted Successfully");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error deleting expense:", error);
          toast.error("Failed to delete expense. Please try again.");
        });
    }
  };

  return (
    <Box sx={{ minHeight: "80vh", p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          backgroundColor: "#d4d3d2",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          mb: 2,
          border: 1,
          borderRadius: 20,
          borderColor: "#d4d3d2",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Expenses
        </Typography>

        <Button
          endIcon={<KeyboardArrowDownIcon />}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          variant="contained"
          color="success"
          sx={{
            textTransform: "none",
            border: 1,
            borderRadius: 20,
            borderColor: "green",
          }}
        >
          New Expense
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { width: 250, p: 1, borderRadius: 2 } }}
        >
          <Typography
            sx={{
              px: 2,
              py: 1,
              fontSize: 12,
              fontWeight: "bold",
              color: "gray",
            }}
          >
            EXPENSE
          </Typography>
          <List disablePadding>
            <ListItem>
              <ListItemIcon>
                <ReceiptLongIcon sx={{ color: "green" }} />
              </ListItemIcon>
              <Manual_Create />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ReceiptLongIcon sx={{ color: "green" }} />
              </ListItemIcon>
              <UploadReceipt />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <GridViewIcon sx={{ color: "green" }} />
              </ListItemIcon>
              <Group_Expense_Create />
            </ListItem>
          </List>
          <Divider sx={{ my: 1 }} />
        </Menu>
      </Paper>

      <Paper elevation={7}>
        <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Personal Expenses" />
          <Tab label="Group Expenses" />
          <Tab label="Receipts" />
        </Tabs>
      </Paper>
      <br />

      {tabIndex === 0 && (
        <div>
          <Paper
            elevation={10}
            sx={{ display: "flex", gap: 2, p: 2, mb: 3, borderRadius: 2 }}
          >
            <TextField
              label="Search Merchant"
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              displayEmpty
              fullWidth
              size="small"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Paper>
          <Card elevation={10}>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>S.N.</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>DATE</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>MERCHANT</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>AMOUNT</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>CATEGORY</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      DESCRIPTION
                    </TableCell>
                    {/* <TableCell sx={{ fontWeight: "bold" }}>Is Group Expense</TableCell> */}
                    {/* <TableCell sx={{ fontWeight: "bold" }}>STATUS</TableCell> */}
                    <TableCell sx={{ fontWeight: "bold" }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.loading ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography color="gray">
                          Loading expenses...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{`${index + 1}`}</TableCell>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{expense.merchant}</TableCell>
                        <TableCell>${expense.amount}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        {/* <TableCell>
                          {!expense.is_group_expense ? (
                            <Tooltip title="Not Group Expense" arrow>
                              <Button variant="outlined" color="secondary">
                                Not Group Expense
                              </Button>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Group Expense" arrow>
                              <Button>Group Expense</Button>
                            </Tooltip>
                          )}
                        </TableCell> */}
                        {/* <TableCell>
                          <Chip
                            label={expense.status ?? "pending"}
                            color={
                              expense.status === "settled"
                                ? "success"
                                : "warning"
                            }
                          />
                        </TableCell> */}
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {/* Update button */}
                            <Button
                              component={Link}
                              to={`/expenses/${expense._id}`}
                              variant="outlined"
                              color="primary"
                              size="small"
                              // startIcon={<EditIcon />}
                            >
                              Update
                            </Button>

                            {/* Delete button */}
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              // startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteClick(expense)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography color="gray">
                          No expenses match your filters.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </div>
      )}

      {tabIndex === 1 && <GroupExpense />}

      {tabIndex === 2 && <Receipts />}
    </Box>
  );
};

export default Expenses;
