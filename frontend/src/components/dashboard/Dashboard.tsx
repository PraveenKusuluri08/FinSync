import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import AXIOS_INSTANCE from "../../api/axios_instance";

export default function Dashboard() {
  const [personalExpense, setPersonalExpense] = useState<number | null>(null);
  const [groupExpense, setGroupExpense] = useState<number | null>(null); // New state for group expense
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // Fetching personal expense
        const personalResponse = await AXIOS_INSTANCE.get("/getexpenseSummary");
        if (personalResponse && personalResponse.data) {
          setPersonalExpense(personalResponse.data.total_amount);
        } else {
          setError("Invalid response from server");
        }

        // Fetching group expense
        const groupResponse = await AXIOS_INSTANCE.get("/user-expenses"); // Add the endpoint here
        if (groupResponse && groupResponse.data) {
          setGroupExpense(groupResponse.data.total_expense);
        } else {
          setError("Invalid response from server for group expense");
        }
      } catch (error: any) {
        console.error("Error fetching expenses:", error);
        setError("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #f8f9fa, #dee2e6)",
        padding: "40px 20px",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "#555" }}>
          Track your spending with real-time insights.
        </Typography>

        {/* Expense Summary Section */}
        <Box sx={{ mt: 3 }}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : personalExpense !== null && groupExpense !== null ? (
            <>
              <SummaryCard title="Personal Expenses" amount={personalExpense} />
              <SummaryCard title="Group Expenses" amount={groupExpense} />
              <SummaryCard
                title="Total Expense"
                amount={personalExpense + groupExpense}
                highlight
              />
            </>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No expenses found.
            </Typography>
          )}
        </Box>
      </Paper>
    </div>
  );
}

function SummaryCard({
  title,
  amount,
  highlight = false,
}: {
  title: string;
  amount: number;
  highlight?: boolean;
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        borderRadius: 2,
        mb: 2,
        backgroundColor: highlight ? "#e3f2fd" : "#f8f9fa",
        transition: "0.3s",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
      <Typography
        variant="h5"
        fontWeight="bold"
        color={highlight ? "secondary" : "textPrimary"}
      >
        ${amount.toFixed(2)}
      </Typography>
    </Paper>
  );
}
