import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import BookInventory from "./pages/BookInventory";
import IssueReturnBooks from "./pages/IssueReturnBooks";
import LibraryDashboard from "./pages/LibraryDashboard";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          {/* The library back-office is LIBRARIAN (ADMIN allowed as superset). */}
          <Route element={<RoleGuard allow={["LIBRARIAN", "ADMIN"]} />}>
            <Route path="/inventory" element={<BookInventory />} />
            <Route path="/transactions" element={<IssueReturnBooks />} />
            <Route path="/dashboard" element={<LibraryDashboard />} />
          </Route>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
