import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat overflow-y-hidden overflow-x-hidden"
      style={{ backgroundImage: "url('/expense-img.jpg')" }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
