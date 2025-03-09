import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";

const localizer = momentLocalizer(moment);

// 🔹 Sample Expenses
const initialExpenses = [
  { id: 1, title: "Dinner", date: new Date(2025, 2, 5), amount: 30 },
  { id: 2, title: "Rent", date: new Date(2025, 2, 1), amount: 1000 },
];

export default function ExpenseCalendar() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);

  // Convert Expenses to Calendar Events
  const events = expenses.map(expense => ({
    id: expense.id,
    title: `${expense.title} - $${expense.amount}`,
    start: expense.date,
    end: expense.date,
    amount: expense.amount,
  }));

  // 🔹 Open Edit Modal
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleSave = () => {
    setExpenses(prevExpenses =>
      prevExpenses.map(exp =>
        exp.id === selectedEvent.id
          ? { ...exp, title: selectedEvent.title, amount: selectedEvent.amount }
          : exp
      )
    );
    setOpen(false);
  };

  // 🔹 Style Calendar Centering
  const calendarContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "90vh",
    backgroundColor: "#f5f5f5",
  };

  const calendarStyle = {
    width: "80%",
    height: 600,
    background: "white",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  };

  // 🔹 Event Style (Google Calendar-like)
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.amount > 100 ? "#ff5252" : "#4caf50",
        color: "white",
        padding: "5px",
        borderRadius: "5px",
      },
    };
  };

  return (
    <div style={calendarContainerStyle}>
      <div style={calendarStyle}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectEvent={handleSelectEvent} 
          eventPropGetter={eventStyleGetter}
        />

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={selectedEvent?.title || ""}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={selectedEvent?.amount || ""}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, amount: e.target.value })}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
            <Button onClick={handleSave} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
