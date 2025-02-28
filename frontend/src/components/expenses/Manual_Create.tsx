import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Tab,
  Tabs,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
  IconButton
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { createExpenseManual } from "../../store/middleware/middleware";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import { _get_expenses_data } from "../../store/middleware/middleware";
import {expensesValidationSchema} from "../../utils/validationSchema";


const ManualCreate = () => {
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  const formik = useFormik({
    initialValues: {
      merchant: "",
      amount: "",
      category: "",
      description: "",
      reimbursable: true,
      image: null as File | null,
      date: "",
    },
    validationSchema:expensesValidationSchema,
    onSubmit: async (values) => {
      await dispatch(createExpenseManual(values));
      await dispatch(_get_expenses_data());
      toast.success("New Expense Created");
      setOpen(false);
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTabChange = (event: React.ChangeEvent<{}>, newIndex: number) =>
    setTabIndex(newIndex);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      formik.setFieldValue("image", file);
    }
  };

  return (
    <>
      <Typography sx={{ cursor: "pointer" }} onClick={handleOpen}>
        Manual Create Expense
      </Typography>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            New Expense
          </Typography>
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="Expense" />
            <Tab label="Distance" />
            <Tab label="Time" />
            <Tab label="Multiple" />
          </Tabs>
          {tabIndex === 0 && (
            <Box component="form" mt={2} onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                label="Merchant"
                variant="outlined"
                margin="normal"
                name="merchant"
                value={formik.values.merchant}
                onChange={formik.handleChange}
                error={formik.touched.merchant && Boolean(formik.errors.merchant)}
                helperText={formik.touched.merchant && formik.errors.merchant}
              />
              <TextField
                fullWidth
                // label="Date"
                type="date"
                variant="outlined"
                margin="normal"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
              />
              <TextField
                fullWidth
                label="Total"
                type="number"
                variant="outlined"
                margin="normal"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.reimbursable}
                    name="reimbursable"
                    onChange={formik.handleChange}
                  />
                }
                label="Reimbursable"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                >
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Supplies">Supplies</MenuItem>
                </Select>
                <Typography className="pl-4 !text-[12px]" color="error">{formik.touched.category && formik.errors.category}</Typography>
              </FormControl>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                margin="normal"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
              <Button
                variant="contained"
                component="label"
                startIcon={<AddPhotoAlternateIcon />}
              >
                Upload Image
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {formik.values.image && (
                <Box mt={2} display="flex" alignItems="center">
                  <Typography>Selected file: {formik.values.image.name}</Typography>
                  <IconButton onClick={() => formik.setFieldValue("image", null)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
              <Box mt={2} className="flex justify-end gap-4 !font-bold">
                <Button onClick={handleClose} sx={{ ml: 2 }} className="!bg-red-600 !text-white">
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  Create Expense
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ManualCreate;
