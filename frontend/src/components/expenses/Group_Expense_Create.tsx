import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  MenuItem,
  Button,
  Select,
  InputLabel,
  FormControl,
  ListItemText,
} from "@mui/material";
import { get_groups_data_by_user_id } from "../../store/middleware/middleware";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useDispatch, useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const groups = [
  { id: "group1", name: "Friends Trip" },
  { id: "group2", name: "Family Expenses" },
  { id: "group3", name: "Office Party" },
];

const categories = ["Room", "Food", "Utilities", "Transport"];
const splitTypes = ["Equal", "Percentage", "Custom"];

const Group_Expense_Create = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(get_groups_data_by_user_id());
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getGroupDataByUser = useSelector((state: any) => state.groups.get_user_groups_data);

  console.log('====================================');
  console.log("Group Data:", getGroupDataByUser);
  console.log('====================================');

  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [expenseData, setExpenseData] = useState({
    groupId: "",
    expenseName: "",
    expenseDescription: "",
    amount: "",
    category: "",
    splitType: "",
    participants: [],
    attachments: null,
    status: "pending",
    paidBy: "praveenkusuluri96@gmail.com",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    setExpenseData({ ...expenseData, [event.target.name]: event.target.value });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGroupChange = (event: any) => {
    const selected = groups.find((g) => g.id === event.target.value);
    setSelectedGroup(selected.name);
    setExpenseData({ ...expenseData, groupId: event.target.value });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (event: any) => {
    setExpenseData({ ...expenseData, attachments: event.target.files[0] });
  };

  const handleSubmit = () => {
    console.log("Submitting Data:", expenseData);
    handleClose();
  };

  return (
    <div>
      <ListItemText onClick={handleOpen}>Manual Create Expense</ListItemText>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6">Create Group Expense</Typography>

          {/* Group Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Group</InputLabel>
            <Select value={expenseData.groupId} onChange={handleGroupChange}>
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Expense Name */}
          <TextField
            label="Expense Name"
            name="expenseName"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />

          {/* Expense Description */}
          <TextField
            label="Expense Description"
            name="expenseDescription"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            onChange={handleChange}
          />

          {/* Amount */}
          <TextField
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />

          {/* Category */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={expenseData.category}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Split Type */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Split Type</InputLabel>
            <Select
              name="splitType"
              value={expenseData.splitType}
              onChange={handleChange}
            >
              {splitTypes.map((split) => (
                <MenuItem key={split} value={split}>
                  {split}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* File Upload */}
          <input
            type="file"
            onChange={handleFileChange}
            style={{ marginTop: "10px" }}
          />

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Submit Expense
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Group_Expense_Create;
