/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { get_group_expenses } from "../../store/middleware/middleware";
import {
  Box,
  Typography,
  Paper,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AXIOS_INSTANCE from "../../api/axios_instance";

const GroupExpense = () => {
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const navigate = useNavigate();

  // Fetch group expenses on mount
  useEffect(() => {
    dispatch(get_group_expenses());
  }, [dispatch]);

  // Redux state
  const groupExpenseData = useSelector(
    (state: any) => state.expenses.get_group_expenses
  );

  // Local filters & dialog states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Settle dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const [settleAmount, setSettleAmount] = useState("");

  // Update dialog
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedExpenseToUpdate, setSelectedExpenseToUpdate] =
    useState<any>(null);
  const [updateForm, setUpdateForm] = useState({
    expense_name: "",
    expense_description: "",
    amount: "",
    category: "",
  });

  // Delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedExpenseToDelete, setSelectedExpenseToDelete] =
    useState<any>(null);

  // Logged in user
  const loggedInUser = JSON.parse(
    localStorage.getItem("user_info") || "{}"
  ).email;

  // Category options
  const categories = [
    ...new Set(groupExpenseData?.data?.map((exp: any) => exp.category)),
  ];

  // Filter logic
  const filteredData = groupExpenseData?.data?.filter((expense: any) => {
    const expenseDate = new Date(expense.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      expense.expense_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? expense.category === selectedCategory : true) &&
      (selectedStatus ? expense.status === selectedStatus : true) &&
      (!start || expenseDate >= start) &&
      (!end || expenseDate <= end)
    );
  });

  // Handlers
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

  const handleOpenUpdateDialog = (expense: any) => {
    setSelectedExpenseToUpdate(expense);
    setUpdateForm({
      expense_name: expense.expense_name,
      expense_description: expense.expense_description,
      amount: expense.amount,
      category: expense.category,
    });
    setOpenUpdateDialog(true);
  };
  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedExpenseToUpdate(null);
    setUpdateForm({
      expense_name: "",
      expense_description: "",
      amount: "",
      category: "",
    });
  };

  // the expense object we’re currently settling up
  const currentExpense = groupExpenseData?.data?.find(
    (exp: any) => exp._id === selectedExpenseId
  );

  // are *we* the payer?
  const paidByUser = currentExpense?.paid_by;
  const isPayer = paidByUser === loggedInUser;

  const handleOpenDeleteDialog = (expense: any) => {
    setSelectedExpenseToDelete(expense);
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setSelectedExpenseToDelete(null);
    setOpenDeleteDialog(false);
  };

  // API calls
  const handleConfirmSettlement = async () => {
    const currentExpense = groupExpenseData.data.find(
      (exp: any) => exp._id === selectedExpenseId
    );
    if (!currentExpense) return;

    const isPayer = currentExpense.paid_by === loggedInUser;
    const requestBody = {
      group_id: currentExpense.group_id,
      expense_id: selectedExpenseId,
      user_id_to_settle_up: isPayer ? selectedPaymentMethod : loggedInUser,
      payment_method: isPayer ? undefined : selectedPaymentMethod,
      amount: settleAmount,
    };

    try {
      await AXIOS_INSTANCE.post("/settleupexpensebypaiduser", requestBody);
      handleCloseDialog();
      dispatch(get_group_expenses());
    } catch {
      console.error("Error while settling up");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await AXIOS_INSTANCE.post("/deletegroupexpense", {
        group_id: selectedExpenseToDelete.group_id,
        expense_id: selectedExpenseToDelete._id,
      });
      handleCloseDeleteDialog();
      dispatch(get_group_expenses());
    } catch {
      console.error("Error deleting expense");
    }
  };

  const handleConfirmUpdate = async () => {
    try {
      await AXIOS_INSTANCE.post("/updategroupexpense", {
        group_id: selectedExpenseToUpdate.group_id,
        expense_id: selectedExpenseToUpdate._id,
        updated_fields: updateForm,
      });
      handleCloseUpdateDialog();
      dispatch(get_group_expenses());
    } catch {
      console.error("Error updating expense");
    }
  };

  // Chat navigation
  const handleChatOpen = (groupId: string, expenseId: string) => {
    navigate(`/expenses/groupexpense/${groupId}/${expenseId}`);
  };

  return (
    <Box sx={{ minHeight: "60vh", p: 2 }}>
      {/* <Typography variant="h6" fontWeight="bold" gutterBottom>
        Group Expenses
      </Typography> */}

      {/* Filters */}
      <Paper
        elevation={10}
        sx={{ display: "flex", gap: 2, p: 2, mb: 2, borderRadius: 2 }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "30%" }} // reduced to half width
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Start Date"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Paper>

      {/* Table */}
      <Card elevation={10} sx={{ p: 2 }}>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>S.N.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData?.length ? (
                filteredData.map((expense: any, idx: number) => (
                  <TableRow key={expense._id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{expense.expense_name}</TableCell>
                    <TableCell>${expense.amount}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={expense.status}
                        color={
                          expense.status === "pending" ? "warning" : "success"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenUpdateDialog(expense)}
                        >
                          Update
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                          onClick={() => handleOpenDialog(expense._id)}
                        >
                          Settle
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteDialog(expense)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            handleChatOpen(expense.group_id, expense._id)
                          }
                        >
                          Chat
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="gray">No expenses found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Settle Up Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          Settle Up Payment
        </DialogTitle>
        <DialogContent sx={{ minHeight: "180px", padding: "24px" }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {isPayer
              ? "Select a user to settle up with and enter the amount."
              : "Select a payment method and enter the amount to settle."}
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel shrink>
              {isPayer ? "Select User to Settle Up" : "Select Payment Method"}
            </InputLabel>
            <Select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              displayEmpty
            >
              {isPayer
                ? currentExpense?.users
                    ?.filter((user: any) => user.user !== loggedInUser)
                    ?.map((user: any) => (
                      <MenuItem
                        key={user.user}
                        value={user.user}
                        disabled={user.is_split_cleared === true}
                        style={{
                          color: user.is_split_cleared ? "gray" : "inherit",
                        }}
                      >
                        {user.user}
                        {user.is_split_cleared ? " (Settled)" : ""}
                      </MenuItem>
                    ))
                : [
                    <MenuItem key="cash" value="cash">
                      💵 Cash
                    </MenuItem>,
                    <MenuItem key="zelle" value="zelle">
                      🏦 Zelle
                    </MenuItem>,
                    <MenuItem key="venmo" value="venmo">
                      📱 Venmo
                    </MenuItem>,
                    <MenuItem key="paypal" value="paypal">
                      💳 PayPal
                    </MenuItem>,
                    <MenuItem key="apple_pay" value="apple_pay">
                      🍏 Apple Pay
                    </MenuItem>,
                    <MenuItem key="google_pay" value="google_pay">
                      🤖 Google Pay
                    </MenuItem>,
                    <MenuItem key="bank_transfer" value="bank_transfer">
                      🏦 Bank Transfer
                    </MenuItem>,
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
          <Button
            onClick={handleCloseDialog}
            color="secondary"
            variant="outlined"
          >
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

      {/* Update Dialog */}
      <Dialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Expense</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Expense Name"
            value={updateForm.expense_name}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, expense_name: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Description"
            value={updateForm.expense_description}
            onChange={(e) =>
              setUpdateForm({
                ...updateForm,
                expense_description: e.target.value,
              })
            }
            fullWidth
          />
          <TextField
            label="Amount"
            type="number"
            value={updateForm.amount}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, amount: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Category"
            value={updateForm.category}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, category: e.target.value })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button onClick={handleConfirmUpdate} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this expense?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupExpense;
