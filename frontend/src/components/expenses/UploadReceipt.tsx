import {
  Box,
  ListItemText,
  Modal,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import AXIOS_INSTANCE from "../../api/axios_instance";

const UploadReceipt = () => {
  const [state, setState] = useState({
    image: null as File | null,
    receipt_name: "",
    receipt_description: "",
  });
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setState({ image: null, receipt_name: "", receipt_description: "" }); // reset on close
  };

//   let currentUser = { email: "" };
//   try {
//     const storedUser = localStorage.getItem("user_info");
//     currentUser = storedUser ? JSON.parse(storedUser) : { email: "" };
//   } catch (err) {
//     console.error("Failed to parse user_info from localStorage:", err);
//   }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setState((prev) => ({ ...prev, image: files[0] }));
    } else {
      setState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!state.image || !state.receipt_name || !state.receipt_description) {
      alert("Please fill out all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("receipt_name", state.receipt_name);
    formData.append("receipt_description", state.receipt_description);
    formData.append("receipt_image", state.image);
    AXIOS_INSTANCE.post("/receipts", formData)
      .then((response) => {
        if (response.status === 201) {
          alert("Receipt uploaded successfully");
        } else {
          alert("Failed to upload receipt");
        }
      })
      .catch((error) => {
        console.error("Error uploading receipt:", error);
        alert("An error occurred while uploading the receipt");
      });
    handleClose();
  };

  return (
    <div>
      <ListItemText sx={{ cursor: "pointer" }} onClick={handleOpen}>
        Upload Receipt
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
            Upload New Receipt
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Receipt Name"
              name="receipt_name"
              value={state.receipt_name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Receipt Description"
              name="receipt_description"
              value={state.receipt_description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Upload Receipt"
              name="image"
              value={state.image ? state.image.name : ""}
              onClick={() => document.getElementById("upload-receipt")?.click()}
              fullWidth
            />
            <input
              type="file"
              id="upload-receipt"
              name="image"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleChange}
            />

            {state.image && (
              <Typography variant="body2" color="text.secondary">
                Selected: {state.image.name}
              </Typography>
            )}
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default UploadReceipt;
