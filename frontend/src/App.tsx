import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgetPassword";
import ChangePassword from "./components/auth/ChangePassword";
import Expenses from "./components/expenses/Expenses";
import Profile from "./components/profile/Profile";
import Dashboard from "./components/dashboard/Dashboard";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Group from "./components/groupmgmt/Group";
import "./App.css";
import AcceptInvite from "./components/AcceptInvitation/AcceptInvitation";

function App() {
  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <div id="login">
                  <Login />
                </div>
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <div id="signup">
                  <Signup />
                </div>
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <div id="signup">
                  <ForgotPassword />
                </div>
              </PublicRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <PublicRoute>
                <div id="signup">
                  <ChangePassword />
                </div>
              </PublicRoute>
            }
          />

          {/* //protected Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div id="dashboard">
                  <Dashboard />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <div id="expenses">
                  <Expenses />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div id="profile">
                  <Profile />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/groupmgmt"
            element={
              <ProtectedRoute>
                <div id="group">
                  <Group />
                </div>
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/accept-invite" element={
            <div id="accept-invitation">
              <AcceptInvite />
            </div>
        }
        />
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;
