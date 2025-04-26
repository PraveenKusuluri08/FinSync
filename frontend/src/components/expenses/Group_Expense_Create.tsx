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
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const categories = ["Room", "Food", "Utilities", "Transport"];
const splitTypes = ["Equal"];

const Group_Expense_Create = () => {
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(get_groups_data_by_user_id());
  }, [dispatch]);

  const getGroupDataByUser = useSelector(
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
  const [selectedGroup, setSelectedGroup] = useState("");
  const [availableUsers, setAvailableUsers] = useState<string[]>([]);
  const [autoAddedCurrentUser, setAutoAddedCurrentUser] = useState(false);

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
    date: "", // <-- NEW DATE FIELD ADDED
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setExpenseData({
      groupId: "",
      expenseName: "",
      expenseDescription: "",
      amount: "",
      category: "",
      splitType: "",
      participants: [],
      attachments: null,
      status: "pending",
      paidBy: currentUser?.email || "",
      date: "", // <-- Reset date as well
    });
    setAutoAddedCurrentUser(false);
  };

  const handleGroupChange = (event: any) => {
    const groupId = event.target.value;
    const selected = getGroupDataByUser?.data?.groups?.find(
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

      const userEmails = selected.users.map((user: any) => user.email);
      if (currentUser?.email && !userEmails.includes(currentUser.email)) {
        userEmails.push(currentUser.email);
      }
      setAvailableUsers(userEmails);
    }
  };

  const handleFileChange = (event: any) => {
    setExpenseData({ ...expenseData, attachments: event.target.files[0] });
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;

    if (name === "paidBy") {
      setExpenseData((prev) => {
        let updatedParticipants = [...prev.participants];
        updatedParticipants = updatedParticipants.filter(
          (email) => email !== value
        );

        if (value !== currentUser.email) {
          if (!updatedParticipants.includes(currentUser.email)) {
            updatedParticipants.push(currentUser.email);
            setAutoAddedCurrentUser(true);
          }
        } else {
          if (autoAddedCurrentUser) {
            updatedParticipants = updatedParticipants.filter(
              (email) => email !== currentUser.email
            );
            setAutoAddedCurrentUser(false);
          }
        }

        return {
          ...prev,
          paidBy: value,
          participants: updatedParticipants,
        };
      });
    } else if (name === "participants") {
      const selectedParticipants = event.target.value;
      const filtered = selectedParticipants.filter((email: string) => {
        if (expenseData.paidBy === currentUser.email) {
          return email !== currentUser.email;
        } else {
          return email !== expenseData.paidBy;
        }
      });
      setExpenseData((prev) => ({
        ...prev,
        participants: filtered,
      }));
    } else {
      setExpenseData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCreateExpense = (e: any) => {
    e.preventDefault();

    let finalParticipants = [...expenseData.participants];
    finalParticipants = finalParticipants.filter(
      (email) => email !== expenseData.paidBy
    );

    if (expenseData.paidBy !== currentUser.email) {
      if (!finalParticipants.includes(currentUser.email)) {
        finalParticipants.push(currentUser.email);
      }
    }

    const formData = new FormData();
    formData.append("amount", expenseData.amount);
    formData.append("category", expenseData.category);
    formData.append("expense_description", expenseData.expenseDescription);
    formData.append("expense_name", expenseData.expenseName);
    formData.append("paid_by", expenseData.paidBy);
    formData.append("split_type", expenseData.splitType.toLowerCase());
    formData.append("status", "pending");
    formData.append("participants", JSON.stringify(finalParticipants));
    formData.append("date", expenseData.date); // <-- Append Date!

    if (expenseData.attachments) {
      formData.append("attachments", expenseData.attachments);
    }

    AXIOS_INSTANCE.post(`/createGroupExpense/${expenseData.groupId}`, formData)
      .then((response) => {
        console.log("Success:", response);
        handleClose();
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <div>
      <ListItemText sx={{ cursor: "pointer" }} onClick={handleOpen}>
        Create Group Expense
      </ListItemText>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
          >
            Create Group Expense
          </Typography>

          {/* Group Select */}
          <FormControl fullWidth margin="normal">
            {/* <InputLabel>Select Group</InputLabel> */}
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

          {/* Expense Fields */}
          <TextField
            label="Expense Name"
            name="expenseName"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="Expense Description"
            name="expenseDescription"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            onChange={handleChange}
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />

          {/* NEW DATE PICKER */}
          <TextField
            label="Expense Date"
            name="date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={expenseData.date}
            onChange={handleChange}
          />

          {/* Selects */}
          <FormControl fullWidth margin="normal">
            {/* <InputLabel>Category</InputLabel> */}
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

          <FormControl fullWidth margin="normal">
            {/* <InputLabel>Split Type</InputLabel> */}
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

          <FormControl fullWidth margin="normal">
            <InputLabel>Paid By</InputLabel>
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

          <FormControl fullWidth margin="normal">
            <InputLabel>Participants</InputLabel>
            <Select
              multiple
              name="participants"
              value={expenseData.participants}
              onChange={handleChange}
              displayEmpty
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {availableUsers
                .filter(
                  (email) =>
                    email !== expenseData.paidBy &&
                    (expenseData.paidBy === currentUser.email
                      ? email !== currentUser.email
                      : true)
                )
                .map((email) => (
                  <MenuItem key={email} value={email}>
                    <ListItemText primary={email} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Upload */}
          <input
            type="file"
            onChange={handleFileChange}
            style={{ marginTop: "10px" }}
          />

          {/* Submit */}
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
