import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expenses from "./pages/Expense";
import Budget from "./pages/Budget";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";

import "./styles/styles.css";

function App() {

  const user = localStorage.getItem("userId");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/income"
          element={user ? <Income /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/expenses"
          element={user ? <Expenses /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/budget"
          element={user ? <Budget /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/transactions"
          element={user ? <Transactions /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/reports"
          element={user ? <Reports /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;