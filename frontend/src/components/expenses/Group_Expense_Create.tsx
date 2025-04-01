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
import AXIOS_INSTANCE from "../../api/axios_instance";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxHeight: "90vh", // limit modal height
  overflowY: "auto", // scroll inside modal
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};
const categories = ["Room", "Food", "Utilities", "Transport"];
const splitTypes = ["Equal"];

const Group_Expense_Create = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(get_groups_data_by_user_id());
  }, [dispatch]);

  // Selector for group data from Redux
  const getGroupDataByUser = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.groups.get_user_groups_data
  );

  let currentUser = { email: "" };
  try {
    const storedUser = localStorage.getItem("user_info");
    currentUser = storedUser ? JSON.parse(storedUser) : { email: "" };
  } catch (err) {
    console.error("Failed to parse user_info from localStorage:", err);
  }

  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedGroup, setSelectedGroup] = useState("");
  const [availableUsers, setAvailableUsers] = useState<string[]>([]);

  const [expenseData, setExpenseData] = useState({
    groupId: "",
    expenseName: "",
    expenseDescription: "",
    amount: "",
    category: "",
    splitType: "",
    participants: [] as string[],
    attachments: null as File | null,
    status: "pending",
    paidBy: currentUser?.email || "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setExpenseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGroupChange = (event: any) => {
    const groupId = event.target.value;
    const selected = getGroupDataByUser?.data?.groups?.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (g: any) => g.group_id === groupId
    );

    if (selected) {
      setSelectedGroup(selected.group_name);
      setExpenseData((prev) => ({
        ...prev,
        groupId: groupId,
        participants: [],
        paidBy: currentUser?.email || "",
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userEmails = selected.users.map((user: any) => user.email);
      if (currentUser?.email && !userEmails.includes(currentUser.email)) {
        userEmails.push(currentUser.email);
      }
      setAvailableUsers(userEmails);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (event: any) => {
    setExpenseData({ ...expenseData, attachments: event.target.files[0] });
  };

  console.log("first", expenseData);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateExpense = (e: any) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    formData.append("amount", expenseData.amount);
    formData.append("category", expenseData.category);
    formData.append("expense_description", expenseData.expenseDescription);
    formData.append("expense_name", expenseData.expenseName);
    formData.append("paid_by", expenseData.paidBy);
    formData.append("split_type", expenseData.splitType.toLowerCase());
    formData.append("status", "pending"); // Optional, or use your own logic
  
    formData.append("participants", JSON.stringify(expenseData.participants));
  
    if (expenseData.splitType.toLowerCase() === "custom" && expenseData.splitAmounts) {
      expenseData.splitAmounts.forEach((amount: number) => {
        formData.append("split_amounts", amount.toString());
      });
    }
  
    if (expenseData.attachments && expenseData.attachments.length > 0) {
      expenseData.attachments.forEach((file: File) => {
        formData.append("attachments", file);
      });
    }
  
    AXIOS_INSTANCE.post(`/createGroupExpense/${expenseData.groupId}`, formData)
      .then((response) => {
        console.log("Success:", response);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <div>
      <ListItemText onClick={handleOpen}>Create Group Expense</ListItemText>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
          >
            Create Group Expense
          </Typography>

          {/* Group Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel shrink>Select Group</InputLabel>
            <Select
              value={expenseData.groupId}
              onChange={handleGroupChange}
              name="groupId"
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Group
              </MenuItem>
              {getGroupDataByUser?.data?.groups?.map((group: any) => (
                <MenuItem key={group.group_id} value={group.group_id}>
                  {group.group_name}
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
            <InputLabel shrink>Category</InputLabel>
            <Select
              name="category"
              value={expenseData.category}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Category
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Split Type */}
          <FormControl fullWidth margin="normal">
            <InputLabel shrink>Split Type</InputLabel>
            <Select
              name="splitType"
              value={expenseData.splitType}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Split Type
              </MenuItem>
              {splitTypes.map((split) => (
                <MenuItem key={split} value={split}>
                  {split}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Paid By */}
          <FormControl fullWidth margin="normal">
            <InputLabel shrink>Paid By</InputLabel>
            <Select
              name="paidBy"
              value={expenseData.paidBy}
              onChange={handleChange}
              displayEmpty
            >
              {availableUsers.map((email) => (
                <MenuItem key={email} value={email}>
                  {email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Participants */}
          <FormControl fullWidth margin="normal">
            <InputLabel shrink>Participants</InputLabel>
            <Select
              multiple
              name="participants"
              value={expenseData.participants}
              onChange={handleChange}
              displayEmpty
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {availableUsers
                .filter((email) => email !== currentUser.email)
                .map((email) => (
                  <MenuItem key={email} value={email}>
                    {email}
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
            sx={{ mt: 2, py: 1.5, fontWeight: "bold" }}
            onClick={handleCreateExpense}
          >
            SUBMIT EXPENSE
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Group_Expense_Create;
