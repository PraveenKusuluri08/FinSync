import { Box, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <div className="bg-gray-500">

    <Box sx={{ p: 3, backgroundColor: "#919191" }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to your dashboard! Here you can manage your finances and track your expenses.
      </Typography>
    </Box>
    </div>
  );
}
