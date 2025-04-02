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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
} from "@mui/material";
import { Link } from "react-router-dom";

const GroupExpense = () => {
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(get_group_expenses());
  }, [dispatch]);

  const groupExpenseData = useSelector(
    (state: any) => state.expenses.get_group_expenses
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const [settleAmount, setSettleAmount] = useState("");

  const loggedInUser = JSON.parse(
    localStorage.getItem("user_info") || "{}"
  ).email;

  const categories = [
    ...new Set(groupExpenseData?.data?.map((exp: any) => exp.category)),
  ];

  const filteredData = groupExpenseData?.data?.filter(
    (expense: any) =>
      expense.expense_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? expense.category === selectedCategory : true) &&
      (selectedStatus ? expense.status === selectedStatus : true)
  );

  const handleOpenDialog = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPaymentMethod("");
    setSelectedExpenseId("");
    setSettleAmount("");
  };

  const handleConfirmSettlement = () => {
    const currentExpense = groupExpenseData?.data?.find(
      (exp: any) => exp._id === selectedExpenseId
    );
    const paidByUser = currentExpense?.paid_by;
    const isPayer = paidByUser === loggedInUser;

    console.log("Settling up...");
    console.log("Expense ID:", selectedExpenseId);
    console.log("User:", loggedInUser);
    console.log(isPayer ? "Settling with user:" : "Using payment method:", selectedPaymentMethod);
    console.log("Amount:", settleAmount);

    handleCloseDialog();
  };

  const currentExpense = groupExpenseData?.data?.find(
    (exp: any) => exp._id === selectedExpenseId
  );

  const paidByUser = currentExpense?.paid_by;
  const isPayer = paidByUser === loggedInUser;

  return (
    <Box sx={{ p: 2 }}>
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

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ width: "50px" }}><b>ID</b></TableCell>
              <TableCell><b>Expense Name</b></TableCell>
              <TableCell sx={{ width: "100px" }}><b>Amount</b></TableCell>
              <TableCell><b>Total Owed Amount</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Involved People</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell sx={{ width: "140px", whiteSpace: "nowrap" }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.length > 0 ? (
              filteredData.map((expense: any, index: number) => (
                <TableRow key={expense._id}>
                  <TableCell>
                    <Link to={`/expenses/groupexpense/${expense.group_id}/${expense._id}`}>
                      {`Expense ID ${index + 1}`}
                    </Link>
                  </TableCell>
                  <TableCell>{expense.expense_name}</TableCell>
                  <TableCell>${expense.amount}</TableCell>
                  <TableCell>{expense.total_owed_amount}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.expense_description}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {expense.users.map((participant: any) => (
                        <Chip
                          key={participant.user}
                          avatar={<Avatar>{participant.user.charAt(0).toUpperCase()}</Avatar>}
                          label={participant.user}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={expense.status}
                      color={expense.status === "pending" ? "warning" : "success"}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button variant="contained" color="primary" size="small">Update</Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleOpenDialog(expense._id)}
                      >
                        Settle Up
                      </Button>
                      <Button variant="contained" color="error" size="small">Delete</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No expenses found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>Settle Up Payment</DialogTitle>
        <DialogContent sx={{ minHeight: "180px", padding: "24px" }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {isPayer
              ? "Select a user to settle up with and enter the amount."
              : "Select a payment method and enter the amount to settle."}
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel shrink>{isPayer ? "Select User to Settle Up" : "Select Payment Method"}</InputLabel>
            <Select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              displayEmpty
            >
              {isPayer
                ? currentExpense?.users
                    .filter((user: any) => user.user !== loggedInUser)
                    .map((user: any) => (
                      <MenuItem key={user.user} value={user.user}>
                        {user.user}
                      </MenuItem>
                    ))
                : [
                    <MenuItem key="cash" value="cash">💵 Cash</MenuItem>,
                    <MenuItem key="zelle" value="zelle">🏦 Zelle</MenuItem>,
                    <MenuItem key="venmo" value="venmo">📱 Venmo</MenuItem>,
                    <MenuItem key="paypal" value="paypal">💳 PayPal</MenuItem>,
                    <MenuItem key="apple_pay" value="apple_pay">🍏 Apple Pay</MenuItem>,
                    <MenuItem key="google_pay" value="google_pay">🤖 Google Pay</MenuItem>,
                    <MenuItem key="bank_transfer" value="bank_transfer">🏦 Bank Transfer</MenuItem>,
                    <MenuItem key="credit_card" value="credit_card">💳 Credit/Debit Card</MenuItem>,
                  ]}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Settle Amount"
            type="number"
            value={settleAmount}
            onChange={(e) => setSettleAmount(e.target.value)}
            placeholder="Enter amount to settle"
          />
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={handleCloseDialog} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSettlement}
            color="primary"
            variant="contained"
            disabled={!selectedPaymentMethod || !settleAmount}
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupExpense;
