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
  SelectChangeEvent,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { createExpenseManual } from "../../store/middleware/middleware";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";

const ManualCreate = () => {
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  const [manualExpenseData, setManualExpenseData] = useState({
    merchant: "",
    amount: "",
    category: "",
    description: "",
    reimbursable: true,
    image: null as File | null, // Corrected initialization
    data: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualExpenseData({
      ...manualExpenseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setManualExpenseData({
      ...manualExpenseData,
      category: event.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setManualExpenseData({ ...manualExpenseData, image: file });
      console.log(file); // You can handle the file as needed
    }
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTabChange = (
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    event: React.ChangeEvent<{}>,
    newIndex: number
  ) => setTabIndex(newIndex);

  console.log("manualExpense", manualExpenseData);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(createExpenseManual(manualExpenseData));
    toast.success("New Expense Created")
    setOpen(false)
  };

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
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            New Expense
          </Typography>

          {/* Tabs Section */}
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="Expense" />
            <Tab label="Distance" />
            <Tab label="Time" />
            <Tab label="Multiple" />
          </Tabs>

          {/* Form Inputs */}
          {tabIndex === 0 && (
            <Box mt={2}>
              <TextField
                fullWidth
                label="Merchant"
                variant="outlined"
                margin="normal"
                name="merchant"
                value={manualExpenseData.merchant}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                variant="outlined"
                margin="normal"
                name="date"
                value={manualExpenseData.data}
                onChange={handleChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Total</InputLabel>
                <TextField
                  type="number"
                  variant="outlined"
                  name="amount"
                  value={manualExpenseData.amount}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={manualExpenseData.reimbursable}
                    name="reimbursable"
                    onChange={handleChange}
                  />
                }
                label="Reimbursable"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={manualExpenseData.category}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Supplies">Supplies</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                margin="normal"
                name="description"
                value={manualExpenseData.description}
                onChange={handleChange}
              />
              <Button
                variant="contained"
                component="label"
                startIcon={<AddPhotoAlternateIcon />}
              >
                Upload Image
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            </Box>
          )}
          <Button onClick={handleSubmit}>Create Expense</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Box>
      </Modal>
    </>
  );
};

export default ManualCreate;
