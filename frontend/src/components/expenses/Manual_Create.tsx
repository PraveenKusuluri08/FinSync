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
  ListItemText,
  IconButton,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import { createExpenseManual } from "../../store/middleware/middleware";
import { expensesValidationSchema } from "../../utils/validationSchema";
import { _get_expenses_data } from "../../store/middleware/middleware";

const ManualCreate = () => {
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const dispatch: ThunkDispatch<object, object, AnyAction> = useDispatch();

  const formik = useFormik({
    initialValues: {
      merchant: "",
      date: "",
      amount: "",
      category: "",
      description: "",
      reimbursable: true,
      image: null as File | null,
    },
    validationSchema: expensesValidationSchema,
    onSubmit: async (values) => {
      const localDate = new Date(`${values.date}T00:00:00`);
      const formattedDate = localDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const newValues = { ...values, date: formattedDate };

      await dispatch(createExpenseManual(newValues));
      await dispatch(_get_expenses_data());
      toast.success("New Expense Created");
      setOpen(false);
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log("expense state", formik.values);

  return (
    <>
      <ListItemText sx={{ cursor: "pointer" }} onClick={handleOpen}>
        Manual Create Expense
      </ListItemText>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: "700px",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 0, fontWeight: "bold", textAlign: "center" }}
          >
            Create Personal Expense
          </Typography>
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
            centered
          >
            {/* <Tab label="Expense" /> */}
            {/* <Tab label="Distance" />
            <Tab label="Time" />
            <Tab label="Multiple" /> */}
          </Tabs>

          {tabIndex === 0 && (
            <Box
              mt={2}
              component="form"
              onSubmit={formik.handleSubmit}
              className="h-[90%]"
            >
              <div className="overflow-y-auto h-[85%]">
                <TextField
                  fullWidth
                  label="Merchant"
                  variant="outlined"
                  margin="normal"
                  name="merchant"
                  value={formik.values.merchant}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.merchant && Boolean(formik.errors.merchant)
                  }
                  helperText={formik.touched.merchant && formik.errors.merchant}
                />

                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  margin="normal"
                  name="date"
                  value={formik.values.date} // Keep the format as YYYY-MM-DD for the input field
                  onChange={(event) => {
                    const rawDate = event.target.value; // YYYY-MM-DD format from input
                    formik.setFieldValue("date", rawDate); // Store the raw date in state
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                />

                {/* <FormControl fullWidth margin="normal"> */}
                {/* <InputLabel>Total</InputLabel> */}
                <TextField
                  fullWidth
                  label="Total"
                  type="number"
                  variant="outlined"
                  name="amount"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                />
                {/* </FormControl> */}
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
                    label="Category"
                    name="category"
                    variant="outlined"
                    margin="none"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.category && Boolean(formik.errors.category)
                    }
                  >
                    <MenuItem value="Travel">Travel</MenuItem>
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Supplies">Supplies</MenuItem>
                  </Select>
                  {formik.touched.category && formik.errors.category && (
                    <Typography
                      className="pl-4 !text-[12px] pt-1"
                      variant="caption"
                      color="error"
                    >
                      {formik.errors.category}
                    </Typography>
                  )}
                </FormControl>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  margin="normal"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />

                <Button
                  className="!mt-4"
                  variant="contained"
                  component="label"
                  startIcon={<AddPhotoAlternateIcon />}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    onChange={(event) => {
                      if (event.currentTarget.files) {
                        formik.setFieldValue(
                          "image",
                          event.currentTarget.files[0]
                        );
                      }
                    }}
                  />
                </Button>
                {formik.values.image && (
                  <Box mt={2} display="flex" alignItems="center">
                    <Typography>
                      Selected file: {formik.values.image.name}
                    </Typography>
                    <IconButton
                      onClick={() => formik.setFieldValue("image", null)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </div>
              <Box mt={2} className="flex justify-between gap-4 !font-bold">
                <Button
                  onClick={handleClose}
                  className="!bg-red-600 !text-white"
                >
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
