import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Notes from "./pages/Notes";

// =========================
// PROTECTED ROUTE
// =========================

function Protected({ children }) {
  const token =
    localStorage.getItem("notes_token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

// =========================
// PUBLIC ROUTE
// =========================

function PublicRoute({ children }) {
  const token =
    localStorage.getItem("notes_token");

  if (token) {
    return (
      <Navigate
        to="/notes"
        replace
      />
    );
  }

  return children;
}

// =========================
// APP
// =========================

export default function App() {
  return (
    <Routes>

      {/* HOME */}
      <Route
        path="/"
        element={
          <Navigate
            to="/notes"
            replace
          />
        }
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* SIGNUP */}
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* NOTES */}
      <Route
        path="/notes"
        element={
          <Protected>
            <Notes />
          </Protected>
        }
      />

      {/* UNKNOWN ROUTE */}
      <Route
        path="*"
        element={
          <Navigate
            to="/notes"
            replace
          />
        }
      />

    </Routes>
  );
}