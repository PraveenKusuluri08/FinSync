import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { get_group_expenses } from "../../store/middleware/middleware";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Button,
} from "@mui/material";

const GroupExpense = () => {
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(get_group_expenses());
  }, [dispatch]);

  const groupExpenseData = useSelector(
    (state: any) => state.expenses.get_group_expenses
  );

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Get Unique Categories from Data
  const categories = [
    ...new Set(groupExpenseData?.data?.map((exp: any) => exp.category)),
  ];

  // Filtered Data
  const filteredData = groupExpenseData?.data?.filter(
    (expense: any) =>
      expense.expense_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? expense.category === selectedCategory : true) &&
      (selectedStatus ? expense.status === selectedStatus : true)
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Filters Section */}
      <Typography variant="h6" gutterBottom>
        Group Expenses
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
            fullWidth
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ tableLayout: "fixed" }}>
          {" "}
          {/* Ensures consistent column widths */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ width: "50px" }}>
                <b>ID</b>
              </TableCell>
              <TableCell>
                <b>Expense Name</b>
              </TableCell>
              <TableCell sx={{ width: "100px" }}>
                <b>Amount</b>
              </TableCell>
              {/* <TableCell>
                <b>Paid By</b>
              </TableCell> */}
              
              <TableCell>
                <b>Your Split Amount</b>
              </TableCell>
              <TableCell>
                <b>Category</b>
              </TableCell>
              <TableCell>
                <b>Description</b>
              </TableCell>
              <TableCell>
                <b>Involved People</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell sx={{ width: "140px", whiteSpace: "nowrap" }}>
                <b>Mark as Cleared</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.length > 0 ? (
              filteredData.map((expense: any, index: number) => {
                let splitAmount = "N/A";
                if (expense.participants.length > 0) {
                  splitAmount = `$${(expense.amount / expense.participants.length).toFixed(2)}`;
                }

                return (
                  <TableRow key={expense._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{expense.expense_name}</TableCell>
                    <TableCell>${expense.amount}</TableCell>
                    {/* <TableCell>{expense.paid_by}</TableCell> */}
                    <TableCell>{splitAmount}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{expense.expense_description}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {expense.participants.map((participant: string) => (
                          <Chip
                            key={participant}
                            avatar={
                              <Avatar>
                                {participant.charAt(0).toUpperCase()}
                              </Avatar>
                            }
                            label={participant}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={expense.status}
                        color={
                          expense.status === "pending" ? "warning" : "success"
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ width: "140px", whiteSpace: "nowrap" }}>
                      <Button variant="contained" color="primary">
                        Clear
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No expenses found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GroupExpense;
