import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Navigation"; 
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Expenses from "./components/Expenses";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: "flex", overflow:"hidden",  }}>
        
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1,overflow:"hidden"}}>
          {/* Top Navigation */}
         
          <Toolbar /> {/* Adds spacing below AppBar */}
          
          {/* Routes */}
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Box>
      </Box>
      <ToastContainer />
    </Router>
  );
}

export default App;
