import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Tooltip } from "@mui/material";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { get_calendar_data } from "../../store/middleware/middleware";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

export default function ExpenseCalendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(get_calendar_data());
  }, [dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calendarData = useSelector((state: any) => state.calendar.calendar_data?.data || []);

  // Convert fetched expenses to Calendar Events
  const events = calendarData
    .map((expense) => {
      const parsedDate = expense.date ? new Date(expense.date) : new Date();
      return {
        id: expense._id,
        title: `${expense.expense_title} - $${expense.amount}`,
        start: parsedDate,
        end: parsedDate,
        amount: parseFloat(expense.amount),
        isGroupExpense: expense.is_group_expense,
      };
    })
    .sort((a, b) => a.start - b.start);

  // Open Edit Modal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectEvent = (event:any) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateExpense = (selectedEvent:any) => {
    navigate(`/expenses/${selectedEvent?.id}`);
  };

  // Custom Event Style for readability
  const eventStyleGetter = (event, start, end, isSelected) => {
    return {
      style: {
        backgroundColor: event.amount > 100 ? "#ff5252" : "#4caf50",
        color: "white",
        padding: "5px",
        borderRadius: "5px",
        fontSize: "12px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    };
  };

  // Custom Event Component with Tooltip
  const CustomEvent = ({ event }) => (
    <Tooltip title={`${event.title} - $${event.amount}`} arrow>
      <div>{event.title}</div>
    </Tooltip>
  );

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

  return (
    <div style={calendarContainerStyle}>
      <div style={calendarStyle}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          components={{
            event: CustomEvent, // Use custom event component
          }}
          popup // Enables a pop-up for multiple expenses on the same day
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
              disabled
              value={selectedEvent?.title || ""}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              disabled
              value={selectedEvent?.amount || ""}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={() => handleUpdateExpense(selectedEvent)} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
