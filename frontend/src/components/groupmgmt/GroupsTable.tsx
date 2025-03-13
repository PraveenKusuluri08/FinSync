import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { get_all_groups, get_expenses_by_group_id } from "../../store/middleware/middleware";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const GroupsTable = () => {
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const [loadingExpenses, setLoadingExpenses] = useState(true);

  useEffect(() => {
    dispatch(get_all_groups());
  }, [dispatch]);

  // Getting group data from Redux
  const groupsData = useSelector((state: any) => state.groups.get_groups);
  const groups = groupsData?.data?.groups || []; // Ensure safe access

  // Fetching expenses for each group
  useEffect(() => {
    if (groups.length > 0) {
      setLoadingExpenses(true);
      groups.forEach((group: any) => {
        dispatch(get_expenses_by_group_id(group._id));
      });
      setLoadingExpenses(false);
    }
  }, [groups, dispatch]);

  console.log("", groups);
  

  // Retrieve expense data from Redux
  const expensesData = useSelector((state: any) => state.expenses.get_expenses_by_group_id);

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f9f9f9", padding: 2 }}>
      {/* Table Section - 80% */}
      <Box sx={{ flex: 4, paddingRight: 2 }}>
        <Card elevation={20}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Group Data
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: "70vh", borderRadius: 2 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2", color: "white" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Group Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Users Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groups.length > 0 ? (
                    groups.map((group: any, index: any) => (
                      <TableRow key={group._id} hover>
                        <TableCell>
                          <a href={`/group/${group.group_id}`} style={{ textDecoration: "none", color: "blue" }}>
                            {`Group ${index + 1}`}
                          </a>
                        </TableCell>
                        <TableCell>{group.group_name}</TableCell>
                        <TableCell>{group.group_description}</TableCell>
                        <TableCell>{group.group_type}</TableCell>
                        <TableCell>{group.users.length}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No Groups Available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Activity Section - 20% */}
      <Box sx={{ flex: 1 }}>
        <Card elevation={20}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>

            {loadingExpenses ? (
              <CircularProgress />
            ) : groups.length > 0 ? (
              groups.map((group: any) => {
                const groupExpenses = expensesData[group._id]?.data || [];

                return (
                  <Accordion key={group._id} sx={{ boxShadow: 1, borderRadius: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: "bold" }}>{group.group_name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {groupExpenses.length > 0 ? (
                        groupExpenses.map((expense: any) => (
                          <Box key={expense._id} sx={{ mb: 1, p: 1, borderBottom: "1px solid #ddd" }}>
                            <Typography variant="body1">
                              <b>{expense.expense_name}</b> - ${expense.amount}
                            </Typography>
                            <Typography variant="body2">
                              <b>Added By:</b> {expense.paid_by}
                            </Typography>
                            <Typography variant="body2">
                              <b>Split Type:</b> {expense.split_type}
                            </Typography>
                            <Typography variant="body2">
                              <b>Involved Users:</b>{" "}
                              {expense.users.map((user: any) => user.email).join(", ")}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No recent expenses in this group.
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                );
              })
            ) : (
              <Typography>No Recent Activity</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default GroupsTable;
