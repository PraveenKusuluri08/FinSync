import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { get_calendar_data } from "../../store/middleware/middleware";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

export default function ExpenseCalendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()

  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(get_calendar_data());
  }, [dispatch]);

  const calendarData = useSelector((state: any) => state.calendar.calendar_data?.data || []);

  // Convert fetched expenses to Calendar Events
  const events = calendarData
  .map((expense) => {
    const parsedDate = expense.date ? new Date(expense.date) : new Date(); // Ensure proper date parsing
    return {
      id: expense._id,
      title: `${expense.expense_title} - $${expense.amount}`,
      start: parsedDate,
      end: parsedDate, // Single-day events
      amount: parseFloat(expense.amount),
      isGroupExpense: expense.is_group_expense,
    };
  })
  .sort((a, b) => a.start - b.start);

  // Open Edit Modal
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleSave = () => {
    // Ideally, update the Redux store as well
    setOpen(false);
  };

  // Style Calendar Centering
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

  // Event Style (Google Calendar-like)
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

  const handleUpdaateExpense=(selectedEvent:any)=>{
    console.log("selectedEvent",selectedEvent)
   navigate(`/expenses/${selectedEvent?.id}`)   
  }

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
              disabled={true}
              value={selectedEvent?.title || ""}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              disabled={true}
              value={selectedEvent?.amount || ""}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, amount: e.target.value })}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={()=>handleUpdaateExpense(selectedEvent)} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
