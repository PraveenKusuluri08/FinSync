import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  _get_expense_data_with_expense_id,
  update_expense_with_id,
} from "../../store/middleware/middleware";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const ExpensePage = ({
  tableId,
  expense_id,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableId: any;
  expense_id: string;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
    merchant: "",
    image_url: "",
  });
  const [imageUpload,setImageUpload]=useState("")

  useEffect(() => {
    if (isModalOpen) {
      dispatch(_get_expense_data_with_expense_id(expense_id));
    }
  }, [isModalOpen]);

  const expense_data_with_id = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.expenses.expense_data_id
  );

  useEffect(() => {
    if (expense_data_with_id?.data) {
      setEditableData(expense_data_with_id.data);
    }
  }, [expense_data_with_id]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableData({ ...editableData, [e.target.name]: e.target.value });
  };

  const handleUpdateImage=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setImageUpload(e.target.value)
  }

  const handleSaveExpense = () => {
    console.log("eidatableData", editableData);
    // dispatch(update_expense_data(expense_id, editableData));
    if (
      editableData.amount !== "" ||
      editableData.category !== "" ||
      editableData.date !== "" ||
      editableData.description !== "" ||
      editableData.image_url !== "" ||
      editableData.merchant !== ""
    ) {
      dispatch(update_expense_with_id(expense_id, editableData));
      window.location.reload();
    }
  };

  return (
    <div>
      <Button onClick={handleOpenModal}>{`Expense ${tableId}`}</Button>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography variant="h6">Expense Details</Typography>

          <TextField
            // label="Image Upload"
            variant="outlined"
            fullWidth
            type="file"
            name="image_url"
            value={imageUpload}
            onChange={handleChange}
            disabled={!isEditing}
          />

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
          />
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            name="category"
            value={editableData.category}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <TextField
            label="Date"
            variant="outlined"
            fullWidth
            name="date"
            value={editableData.date}
            onChange={handleChange}
            disabled={!isEditing}
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
          />
          <TextField
            label="Merchant"
            variant="outlined"
            fullWidth
            name="merchant"
            value={editableData.merchant}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <Box display="flex" justifyContent="space-between" marginTop={2}>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="error"
            >
              Close
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
      </Modal>
    </div>
  );
};

export default ExpensePage;
