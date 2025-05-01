import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useEffect, useState } from "react";
import AXIOS_INSTANCE from "../../api/axios_instance";
import {
  PieChart,
  Pie,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];
type MonthlyTrendItem = {
  month: string;
  amount: number;
};

type CategoryDataItem = {
  name: string;
  value: number;
};

type TransactionItem = {
  desc: string;
  amount: number;
  type: string;
  date: string;
};

type GroupDueItem = {
  group: string;
  you_owe: number;
};

export default function Dashboard() {
  const [personalExpense, setPersonalExpense] = useState<number | null>(null);
  const [groupExpense, setGroupExpense] = useState<number | null>(null);
  const [youOwe, setYouOwe] = useState<number | null>(null);
  const [youAreOwed, setYouAreOwed] = useState<number | null>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrendItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataItem[]>([]);
  const [recentTxns, setRecentTxns] = useState<TransactionItem[]>([]);
  const [topGroups, setTopGroups] = useState<GroupDueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [personalRes, groupRes, txnRes, catRes, trendRes, groupDueRes] =
          await Promise.all([
            AXIOS_INSTANCE.get("/getexpenseSummary"),
            AXIOS_INSTANCE.get("/group-expense-summary-full"),
            AXIOS_INSTANCE.get("/getRecentTransactions"),
            AXIOS_INSTANCE.get("/getExpenseBreakdownByCategory"),
            AXIOS_INSTANCE.get("/getExpenseTrend"),
            AXIOS_INSTANCE.get("/getTopGroupDues"),
          ]);

        setPersonalExpense(personalRes.data.total_amount ?? 0);
        setGroupExpense(groupRes.data.group_expense_total ?? 0);
        setYouOwe(groupRes.data.you_owe ?? 0);
        setYouAreOwed(groupRes.data.you_are_owed ?? 0);
        setRecentTxns(txnRes.data || []);
        setCategoryData(catRes.data || []);
        setMonthlyTrend(trendRes.data || []);
        setTopGroups(groupDueRes.data || []);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3} color="primary" fontWeight="bold">
        Dashboard
      </Typography>

      {/* SUMMARY */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#e3f2fd", height: "100%" }}>
            {" "}
            {/* Soft Blue for Personal Expense */}
            <CardContent>
              <Typography variant="h6">Personal Expense</Typography>
              <Typography variant="h5" fontWeight="bold">
                ${personalExpense?.toFixed(2) ?? "0.00"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#e8f5e9", height: "100%" }}>
            {" "}
            {/* Soft Green for Group Balance */}
            <CardContent>
              <Typography variant="h6">Group Balance</Typography>
              <Typography variant="h5" fontWeight="bold">
                ${groupExpense?.toFixed(2) ?? "0.00"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                You owe ${youOwe?.toFixed(2) ?? "0.00"} | You're owed $
                {youAreOwed?.toFixed(2) ?? "0.00"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#ffebee", height: "100%" }}>
            {" "}
            {/* Soft Red for Top Group Dues */}
            <CardContent>
              <Typography variant="h6">Top Group Dues</Typography>
              {topGroups.length === 0 ? (
                <Typography>No outstanding group dues.</Typography>
              ) : (
                <List dense>
                  {topGroups.slice(0, 3).map((g, idx) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={g.group}
                        secondary={`You owe $${g.you_owe}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* MIDDLE: RECENT TXNS + CATEGORY */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", bgcolor: "#fafafa" }}>
            {" "}
            {/* Light Gray for Recent Transactions */}
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              {recentTxns.length === 0 ? (
                <Typography>No recent transactions found.</Typography>
              ) : (
                <List>
                  {recentTxns.map((txn, idx) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={`${txn.desc} - $${txn.amount}`}
                        secondary={`${txn.type} - ${txn.date}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", bgcolor: "#f1f8e9" }}>
            {" "}
            {/* Light Greenish Yellow for Category Breakdown */}
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Category Breakdown
              </Typography>
              {categoryData.length === 0 ? (
                <Typography>No category data available.</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {categoryData.map((_, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* BOTTOM: MONTHLY TREND */}
      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          Monthly Expense Trend
        </Typography>
        {monthlyTrend.length === 0 ? (
          <Typography>No monthly trend data available.</Typography>
        ) : (
          <>
            <Typography variant="subtitle2" color="textSecondary" mb={1}>
              Total this year: $
              {monthlyTrend.reduce((sum, m) => sum + m.amount, 0).toFixed(2)}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </Box>
    </Box>
  );
}

