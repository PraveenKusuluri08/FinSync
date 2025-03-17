import { Box, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import AXIOS_INSTANCE from "../../api/axios_instance";

export default function Dashboard() {
  const [personalExpense, setPersonalExpense] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Default value for group expense
  const groupExpense = 25;

  useEffect(() => {
    const fetchPersonalExpense = async () => {
      try {
        const response = await AXIOS_INSTANCE.get("/getexpenseSummary");
        if (response && response.data) {
          setPersonalExpense(response.data.total_amount);
        } else {
          setError("Invalid response from server");
        }
      } catch (error: any) {
        console.error("Error fetching personal expense:", error);
        setError("Failed to load personal expense");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalExpense();
  }, []);

  return (
    <div
      className="min-h-screen flex justify-center items-center"
      style={{
        background: "linear-gradient(to right, #f8f9fa, #e9ecef)", // Light gradient background
        padding: "20px",
      }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
          backgroundColor: "#fff",
          width: "90%",
          maxWidth: 500,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "#555" }}>
          Manage your finances and track your expenses.
        </Typography>

        {/* Expense Summary Section */}
        <Box sx={{ mt: 3 }}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : personalExpense !== null ? (
            <>
              <Box
                sx={{
                  backgroundColor: "#f1f3f5",
                  padding: 2,
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  Total Personal Expenses
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  ${personalExpense.toFixed(2)}
                </Typography>
              </Box>

              <Box
                sx={{
                  backgroundColor: "#f8f9fa",
                  padding: 2,
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  Total Group Expense
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  ${groupExpense.toFixed(2)}
                </Typography>
              </Box>

              <Box
                sx={{
                  backgroundColor: "#e9ecef",
                  padding: 2,
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  Total Expense
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="secondary">
                  ${(personalExpense + groupExpense).toFixed(2)}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography variant="body1">
              No expenses found for this user.
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
}
