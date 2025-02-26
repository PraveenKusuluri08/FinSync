import { Outlet } from "react-router-dom";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import Sidebar from "./components/navbar/Navigation"; 

const Layout = () => {
  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex",overflow: "scroll" }}>
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1,overflow: "scroll"}}>
          {/* Top Navigation */}
          <Toolbar /> {/* Adds spacing below AppBar */}
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default Layout;
