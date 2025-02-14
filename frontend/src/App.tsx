import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import ChangePassword from "./components/Auth/ChangePassword";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home/Home";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Layout from "./Layout";
import Signup from "./components/Auth/Signup";
import ForgetPassword from "./components/Auth/ForgetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<PublicRoute><div id="login"><Login /></div></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><div id="signup"><Signup /></div></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><div id="signup"><ForgetPassword /></div></PublicRoute>} />
          <Route path="/change-password" element={<PublicRoute><div id="signup"><ChangePassword /></div></PublicRoute>} />

          {/* //protected Route */}
          <Route path="/home" element={<ProtectedRoute><div id="home"><Home /></div></ProtectedRoute>} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;