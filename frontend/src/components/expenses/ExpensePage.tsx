import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { useParams, useNavigate } from "react-router-dom";
import {
  _get_expense_data_with_expense_id,
  update_expense_with_id,
} from "../../store/middleware/middleware";
import Breadcrumbs from "../common/Breadcrumbs";
const ExpenseDetails = () => {
  const { expense_id } = useParams(); // Get expense_id from URL
  const navigate = useNavigate();
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
    merchant: "",
    image_url: "",
  });

  useEffect(() => {
    if (expense_id) {
      dispatch(_get_expense_data_with_expense_id(expense_id));
    }
  }, [expense_id]);

  const expense_data_with_id = useSelector(
    (state: any) => state.expenses.expense_data_id
  );

  useEffect(() => {
    if (expense_data_with_id?.data) {
      setEditableData(expense_data_with_id.data);
    }
  }, [expense_data_with_id]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableData({ ...editableData, [e.target.name]: e.target.value });
  };

  const handleSaveExpense = () => {
    if (
      editableData.amount !== "" ||
      editableData.category !== "" ||
      editableData.date !== "" ||
      editableData.description !== "" ||
      editableData.image_url !== "" ||
      editableData.merchant !== ""
    ) {
      dispatch(update_expense_with_id(expense_id, editableData));
      navigate("/expenses"); // Redirect to expenses list after save
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5, p: 3, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        Expense Details
      </Typography>

      <Breadcrumbs/>
      {editableData.image_url && (
        <Box textAlign="center" mb={2}>
          <img
            src={editableData.image_url}
            alt="Expense"
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        </Box>
      )}

      <TextField
        label="Amount"
        variant="outlined"
        fullWidth
        name="amount"
        value={editableData.amount}
        onChange={handleChange}
        disabled={!isEditing}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Category"
        variant="outlined"
        fullWidth
        name="category"
        value={editableData.category}
        onChange={handleChange}
        disabled={!isEditing}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Date"
        variant="outlined"
        fullWidth
        name="date"
        value={editableData.date}
        onChange={handleChange}
        disabled={!isEditing}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        name="description"
        value={editableData.description}
        onChange={handleChange}
        disabled={!isEditing}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Merchant"
        variant="outlined"
        fullWidth
        name="merchant"
        value={editableData.merchant}
        onChange={handleChange}
        disabled={!isEditing}
        sx={{ mb: 2 }}
      />

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button onClick={() => navigate("/expenses")} variant="contained" color="error">
          Back
        </Button>
        <Button
          onClick={!isEditing ? handleEditToggle : handleSaveExpense}
          variant="contained"
          color="primary"
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </Box>
    </Box>
  );
};

export default ExpenseDetails;
