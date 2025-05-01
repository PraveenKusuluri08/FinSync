import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { on_logout } from "../../store/middleware/middleware";
import { State } from "../../store/reducers/reducers/reducers";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
// MUI Components
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  useMediaQuery,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// MUI Icons
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { toast } from "react-toastify";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); // State for logout confirmation dialog
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const userinformation = useSelector(({ user }: { user: State }) => user);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(!!userinformation.data.token);
    }
  }, [userinformation.data.token]);

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogout = () => {
    dispatch(on_logout());
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user_info");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/login");
    setLogoutDialogOpen(false);
  };

  const navElements = [
    { title: "Dashboard", href: "/dashboard", icon: <DashboardIcon sx={{ color: "white" }} /> },
    { title: "Profile", href: "/profile", icon: <PersonIcon sx={{ color: "white" }} /> },
    { title: "Expenses", href: "/expenses", icon: <AttachMoneyIcon sx={{ color: "white" }} /> },
    { title: "Group Management", href: "/groupmgmt", icon: <Diversity3Icon sx={{ color: "white" }} /> },
    { title: "Calendar", href: "/calendar", icon: <CalendarMonthIcon sx={{ color: "white" }} /> },
    { title: "Split Summary", href: "/splitsummary", icon: <MonetizationOnIcon sx={{ color: "white" }} /> },
  ];

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <Link href="/" underline="none">
      <Typography variant="h6" sx={{ p: 2, textAlign: "center", color: "blue", fontWeight: 800 }}>
        FINSYNC
      </Typography>
      </Link>
      <List>
        {navElements.map((nav) => (
          <ListItem key={nav.title} disablePadding>
            <ListItemButton onClick={() => navigate(nav.href)}>
              <ListItemIcon>{nav.icon}</ListItemIcon>
              <ListItemText primary={nav.title} sx={{ color: "white" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top Navigation Bar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#333", zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isLoggedIn && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon sx={{ color: "white" }} />
            </IconButton>
          )}

          {/* Logo and App Name */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img src="/logo-dark.jpeg" alt="logo" style={{ width: 80, height: 40, borderRadius: "8px", marginRight: 8 }} />
            <Link href="/" underline="none">
            <Typography variant="h6" sx={{ color: "white" }}>FinSync</Typography>
            </Link>
          </Box>

          {/* Show Login & Signup when not logged in */}
          {!isLoggedIn ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  fontWeight:800,
                  fontSize: 18,
                  textTransform: "none",
                  color: location.pathname === "/login" ? "white" : "#1976d2",
                  backgroundColor: location.pathname === "/login" ? "#1976d2" : "transparent",
                  "&:hover": {
                    backgroundColor: location.pathname === "/login" ? "#1565c0" : "transparent",
                  },
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                sx={{
                  fontWeight:800,
                  fontSize: 18,
                  textTransform: "none",
                  color: location.pathname === "/signup" ? "white" : "#1976d2",
                  backgroundColor: location.pathname === "/signup" ? "#1976d2" : "transparent",
                  "&:hover": {
                    backgroundColor: location.pathname === "/signup" ? "#1565c0" : "transparent",
                  },
                }}
              >
                SignUp
              </Button>
            </Box>
          ) : (
            <Button color="inherit" onClick={handleLogoutConfirm} sx={{ textTransform: "none", color: "white" }}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer for Large Screens */}
      {isLoggedIn && (
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          sx={{
            width: 250,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: 250, boxSizing: "border-box", backgroundColor: "#1c1c1c", color: "#fff" },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to log out?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">Cancel</Button>
          <Button onClick={handleLogout} color="error" autoFocus>Logout</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
