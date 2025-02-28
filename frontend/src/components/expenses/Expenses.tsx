import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Menu,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GridViewIcon from "@mui/icons-material/GridView";
import Manual_Create from "./Manual_Create";
import { useDispatch, useSelector } from "react-redux";
import { _get_expenses_data } from "../../store/middleware/middleware";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import ExpensePage from "./ExpensePage";
import StatusBadge from "../common/SpanByStatus";

const categories = [
  "All",
  "Meals and Entertainment",
  "Travel",
  "Office Supplies",
];

const Expenses = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  const open = Boolean(anchorEl);

  useEffect(() => {
    dispatch(_get_expenses_data());
  }, [dispatch]);

  // Get expenses from Redux store
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const expenses = useSelector((state: any) => state.expenses.expenses);

  // Ensure expenses is always an array
  const expensesArray =
    expenses?.data && Array.isArray(expenses.data) ? expenses.data : [];

  useEffect(() => {
    if (expensesArray.length > 0) {
      setLoading(false);
    }
  }, [expensesArray]);

  // Filtering expenses
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredExpenses = expensesArray.filter((expense: any) => {
    const expenseDate = new Date(expense.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      (selectedCategory === "All" || expense.category === selectedCategory) &&
      (!searchQuery ||
        expense.merchant
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim())) &&
      (!start || expenseDate >= start) &&
      (!end || expenseDate <= end)
    );
  });

  return (
    <Box sx={{ minHeight: "80vh", p: 2 }}>
      {/* Header Section */}
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          backgroundColor: "#d4d3d2",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          mb: 2,
          border: 1,
          borderRadius: 20,
          borderColor: "#d4d3d2",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Expenses
        </Typography>

        <Button
          endIcon={<KeyboardArrowDownIcon />}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          variant="contained"
          color="success"
          sx={{
            textTransform: "none",
            border: 1,
            borderRadius: 20,
            borderColor: "green",
          }}
        >
          New Expense
        </Button>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { width: 250, p: 1, borderRadius: 2 } }}
        >
          <Typography
            sx={{
              px: 2,
              py: 1,
              fontSize: 12,
              fontWeight: "bold",
              color: "gray",
            }}
          >
            EXPENSE
          </Typography>
          <List disablePadding>
            <ListItem>
              <ListItemIcon>
                <ReceiptLongIcon sx={{ color: "green" }} />
              </ListItemIcon>
              <Manual_Create />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ReceiptLongIcon sx={{ color: "green" }} />
              </ListItemIcon>
              <ListItemText primary="Upload Receipt" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <GridViewIcon sx={{ color: "green" }} />
              </ListItemIcon>
              <ListItemText primary="Create Multiple" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <GridViewIcon sx={{ color: "green" }} />
              </ListItemIcon>
              <ListItemText primary="Create Group Expense" />
            </ListItem>
          </List>
          <Divider sx={{ my: 1 }} />
        </Menu>
      </Paper>

      {/* Filters Section */}
      <Paper
        elevation={2}
        sx={{ display: "flex", gap: 2, p: 2, mb: 2, borderRadius: 2 }}
      >
        <TextField
          label="Search Merchant"
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ borderRadius: 20 }}
        />
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          displayEmpty
          fullWidth
          size="small"
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Start Date"
          type="date"
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Paper>

      {/* Expenses Table */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>DATE</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>MERCHANT</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>AMOUNT</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>CATEGORY</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>DESCRIPTION</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="gray">Loading expenses...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredExpenses.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              filteredExpenses.map((expense: any, index: number) => (
                <TableRow key={index}>
                  {/* <a style={{textDecoration:"underline"}} href={`/expenses/${expense["_id"]}`}> */}

                  <TableCell>
                    <ExpensePage tableId={index + 1} expense_id={expense["_id"]} />
                  </TableCell>
                  {/* </a> */}
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.merchant}</TableCell>
                  <TableCell>${expense.amount}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      <StatusBadge status={expense?.status ?? 'pending'}/>
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="gray">
                    No expenses match your filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Expenses;
