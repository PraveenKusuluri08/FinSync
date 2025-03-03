import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { useParams, useNavigate } from "react-router-dom";
import {
  _get_expense_data_with_expense_id,
  update_expense_with_id,
} from "../../store/middleware/middleware";
import Breadcrumbs from "../common/Breadcrumbs";
import { useFormik } from "formik";
import {expensesValidationSchema} from "../../utils/validationSchema";
import { toast } from "react-toastify";
import {_get_expenses_data} from "../../store/middleware/middleware";
import { CircularProgress } from "@mui/material";

const ExpenseDetails = () => {
  const { expense_id } = useParams();
  const navigate = useNavigate();
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const expense_data_with_id = useSelector(
    (state: any) => state.expenses.expense_data_id
  );

  console.log("expense_data_with_id", expense_data_with_id);

  // Formik for form state and validation
  const formik = useFormik({
    initialValues: {
      amount: "",
      category: "",
      date: "",
      description: "",
      merchant: "",
      image_url: "",
    },
    validationSchema:expensesValidationSchema,
    onSubmit: async (values) => {
      await dispatch(update_expense_with_id(expense_id, values));
      await dispatch(_get_expenses_data());
      toast.success("Expense Edited Successfully");
      navigate("/expenses"); // Redirect AFTER saving
    },
  });

  useEffect(() => {
    if (expense_id) {
      dispatch(_get_expense_data_with_expense_id(expense_id));
    }
  }, [expense_id]);

  useEffect(() => {
    if (expense_data_with_id?.data) {
      formik.setValues(expense_data_with_id.data);
    }
  }, [expense_data_with_id]);

  // Toggle edit mode without navigating
  const handleEditToggle = () => setIsEditing(true);

  // Save changes & navigate only after successful update
  const handleSave = () => {
    formik.handleSubmit();
  };

  return (
    <Box sx={expense_data_with_id.loading?{opacity:0.6, maxWidth: 600, margin: "auto", position:"relative", mt: 5, p: 3, boxShadow: 3}
                                          :{ maxWidth: 600, margin: "auto", position:"relative", mt: 5, p: 3, boxShadow: 3 }}>

      {
        /* Display Loading Spinner */
        expense_data_with_id.loading && 
        <div className="opacity-100 text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <CircularProgress />
          </div>
      }
      <Typography variant="h4" gutterBottom>
        Expense Details
      </Typography>

      <Breadcrumbs />

      {/* Display Expense Image if available */}
      {formik.values.image_url && (
        <Box textAlign="center" mb={2}>
          <img
            src={formik.values.image_url}
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

      {/* Formik Form */}
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          name="amount"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={!isEditing}
          error={formik.touched.amount && Boolean(formik.errors.amount)}
          helperText={formik.touched.amount && formik.errors.amount}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!isEditing}
            error={formik.touched.category && Boolean(formik.errors.category)}
          >
            <MenuItem value="Travel">Travel</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Supplies">Supplies</MenuItem>
          </Select>
          {formik.touched.category && formik.errors.category && (
            <Typography className="pl-4 !text-[12px] pt-1" variant="caption" color="error">
              {formik.errors.category}
            </Typography>
          )}
        </FormControl>

        <TextField
          // label="Date"
          variant="outlined"
          fullWidth
          name="date"
          type="date"
          value={formik.values.date}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={!isEditing}
          error={formik.touched.date && Boolean(formik.errors.date)}
          helperText={formik.touched.date && formik.errors.date}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={!isEditing}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Merchant"
          variant="outlined"
          fullWidth
          name="merchant"
          value={formik.values.merchant}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={!isEditing}
          error={formik.touched.merchant && Boolean(formik.errors.merchant)}
          helperText={formik.touched.merchant && formik.errors.merchant}
          sx={{ mb: 2 }}
        />

        {/* Edit and Save Buttons */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={() => navigate("/expenses")} variant="contained" color="error">
            Back
          </Button>

          {!isEditing ? (
            // Edit Mode Toggle Button (Doesn't Submit)
            <Button onClick={handleEditToggle} variant="contained" color="primary">
              Edit
            </Button>
          ) : (
            // Save Button (Submits Form & Navigates)
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ExpenseDetails;
