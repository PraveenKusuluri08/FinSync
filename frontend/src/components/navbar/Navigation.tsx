import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { on_logout } from "../../store/middleware/middleware";
import { State } from "../../store/reducers/reducers/reducers";

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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// MUI Icons
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Detects screen size
  const userinformation = useSelector(({user}:{user:State}) => user);
  console.log("userinformation", userinformation);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(!!userinformation.data.token);
    }
  }, [userinformation.data.token]);

  const logout = () => {
    dispatch(on_logout());
    window.localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navElements = [
    { title: "Dashboard", href: "/dashboard", icon: <DashboardIcon sx={{ color: "white" }} /> },
    { title: "Profile", href: "/profile", icon: <PersonIcon sx={{ color: "white" }} /> },
    { title: "Expenses", href: "/expenses", icon: <AttachMoneyIcon sx={{ color: "white" }} /> },
  ];

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <Typography variant="h6" sx={{ p: 2, textAlign: "center", color: "blue", fontWeight: 800 }}>
        FINSYNC
      </Typography>
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
              sx={{ mr: 2, display: { md: "none" } }} // Hide on larger screens
            >
              <MenuIcon sx={{ color: "white" }} />
            </IconButton>
          )}

          {/* Logo and App Name */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img src="/logo-dark.jpeg" alt="logo" style={{ width: 40, height: 40, borderRadius: "8px", marginRight: 8 }} />
            <Typography variant="h6" sx={{ color: "white" }}>FinSync</Typography>
          </Box>

          {/* Show Login & Signup when not logged in */}
          {!isLoggedIn ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={() => navigate("/login")}
                sx={{
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
                  textTransform: "none",
                  color: location.pathname === "/signup" ? "white" : "#1976d2",
                  backgroundColor: location.pathname === "/signup" ? "#1976d2" : "transparent",
                  "&:hover": {
                    backgroundColor: location.pathname === "/signup" ? "#1565c0" : "transparent",
                  },
                }}
              >
                Signup
              </Button>
            </Box>
          ) : (
            <Button color="inherit" onClick={logout} sx={{ textTransform: "none", color: "white" }}>
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
    </Box>
  );
};

export default Sidebar;
