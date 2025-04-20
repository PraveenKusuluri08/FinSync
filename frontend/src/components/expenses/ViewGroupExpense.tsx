import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { get_group_expenses } from "../../store/middleware/middleware";
import io from "socket.io-client";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import AXIOS_INSTANCE from "../../api/axios_instance";

// Setup socket connection
const socket = io("http://127.0.0.1:8080");

const ViewGroupExpense = () => {
  const { group_id, expense_id } = useParams<{ group_id: string; expense_id: string }>();
  const dispatch: ThunkDispatch<object, object, AnyAction> = useDispatch();

  const [messages, setMessages] = useState<{ user: string; message: string; timestamp: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user_info") || "{}").email;

  const groupExpenseData = useSelector((state: any) => state.expenses.get_group_expenses);

  useEffect(() => {
    dispatch(get_group_expenses());
  }, [dispatch]);

  const filteredExpense = groupExpenseData?.data?.find(
    (expense: any) => expense.group_id === group_id && expense._id === expense_id
  );

  useEffect(() => {
    if (!group_id || !expense_id) return;

    socket.emit("join_room", { room: group_id });

    AXIOS_INSTANCE.get(`/get_messages/${group_id}/${expense_id}`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Error fetching messages:", error));

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [group_id, expense_id]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const messageData = { room: group_id, user: currentUser, message: newMessage, group_id, expense_id };
      socket.emit("send_message", messageData);
      AXIOS_INSTANCE.post("/send_message", messageData).catch((error) => console.error("Error:", error));
      setNewMessage("");
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 3, padding: 3 }}>
      {/* Expense Details Section */}
      <Card sx={{ flex: 1, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">Group Expense Details</Typography>
          {filteredExpense ? (
            <>
              <Typography variant="h6">
                <strong>Expense Name:</strong> {filteredExpense.expense_name}
              </Typography>
              <Typography variant="body1">
                <strong>Amount:</strong> ${filteredExpense.amount}
              </Typography>
              <Typography variant="body1">
                <strong>Payer:</strong> {filteredExpense.paid_by}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong> {filteredExpense.expense_description}
              </Typography>

              <Typography variant="h6" sx={{ marginTop: 2 }}>Involved Users:</Typography>
              <List>
                {filteredExpense.users
                  .filter((user: any) => user.user !== filteredExpense.paid_by)
                  .map((user: any, index: number) => (
                    <ListItem key={index} sx={{ borderRadius: 2, padding: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: user.isSplitCleared ? "green" : "gray" }}>
                          {user.user[0].toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              textDecoration: user.isSplitCleared ? "line-through" : "none",
                              color: user.isSplitCleared ? "green" : "black",
                              fontWeight: user.isSplitCleared ? "bold" : "normal",
                            }}
                          >
                            {user.user}
                            {user.user === currentUser ? " (You)" : ""}
                          </Typography>
                        }
                        secondary={`Owes: $${user.split_amount}`}
                      />
                    </ListItem>
                  ))}
              </List>
            </>
          ) : (
            <Typography>No expense found.</Typography>
          )}
        </CardContent>
      </Card>

      {/* Chat Section */}
      <Card sx={{ flex: 1, padding: 2, display: "flex", flexDirection: "column", height: "100%", minHeight: 600 }}>
        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h5" fontWeight="bold">Group Chat</Typography>

          {/* Scrollable Involved Users */}
          {filteredExpense && (
            <Box
              sx={{
                maxHeight: 130,
                overflowY: "auto",
                marginBottom: 2,
                padding: 1,
                backgroundColor: "#f7f7f7",
                borderRadius: 1,
              }}
            >
              {filteredExpense.users
                .filter((user: any) => user.user !== filteredExpense.paid_by)
                .map((user: any, index: number) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "gray" }}>
                      {user.user[0].toUpperCase()}
                    </Avatar>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {user.user}
                      {user.user === currentUser ? " (You)" : ""}
                    </Typography>
                  </Box>
                ))}
            </Box>
          )}

          <Divider sx={{ marginY: 2 }} />

          {/* Chat Messages */}
          <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: msg.user === currentUser ? "#dcf8c6" : "#f1f1f1",
                  padding: 1.5,
                  borderRadius: 2,
                  maxWidth: "75%",
                  alignSelf: msg.user === currentUser ? "flex-end" : "flex-start",
                }}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "0.85rem" }}>{msg.user}</Typography>
                <Typography>{msg.message}</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "gray" }}>{msg.timestamp}</Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ marginY: 2 }} />

          {/* Chat Input */}
          <Box sx={{ display: "flex", gap: 1, marginTop: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="contained" onClick={handleSendMessage}>Send</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewGroupExpense;
