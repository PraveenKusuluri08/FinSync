import "./App.css";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgetPassword from "./components/ForgetPassword";
import { ReactElement } from "react";

function App() {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat overflow-y-hidden overflow-x-hidden"
      style={{ backgroundImage: "url('/expense-img.jpg')" }}
    >
      <Router>
        <AnimatedRoutes />
      </Router>
    </div>
  );
};

  const AnimatedRoutes = () => {
    const location = useLocation(); // Get current route

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgetPassword /></PageWrapper>} />
        <Route path="/change-password" element={<PageWrapper><ForgetPassword /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};
    
      {/* <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router> */}

// Page transition wrapper
const PageWrapper = ({ children }:{children:ReactElement}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default App;
