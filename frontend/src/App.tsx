import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navigation from "./components/Navigation";
import ForgetPassword from "./components/ForgetPassword";
import ChangePassword from "./components/ChangePassword";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      
      <main>
        <Navigation />
        <section
          id="home"
          className="h-screen w-screen bg-cover bg-center bg-no-repeat overflow-hidden"
          style={{ backgroundImage: "url('/expense-img.jpg')" }}
        >
          <Routes>
            <Route path="/login" element={<div id="login"><Login /></div>} />
            <Route path="/signup" element={<div id="signup"><Signup /></div>} />
            <Route path="/forgot-password" element={<div id="signup"><ForgetPassword /></div>} />
            <Route path="/change-password" element={<div id="signup"><ChangePassword /></div>} />
          </Routes>
        </section>
        <ToastContainer />
      </main>

    </Router>
  );
}

export default App;
