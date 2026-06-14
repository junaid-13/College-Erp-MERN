import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <span className="brand">🎓 College ERP</span>
      <Link to="/profile" style={{ marginLeft: "1rem" }}>
        Profile
      </Link>
      <Link to="/subjects" style={{ marginLeft: "0.75rem" }}>
        My Subjects
      </Link>
      <Link to="/timetable" style={{ marginLeft: "0.75rem" }}>
        My Timetable
      </Link>
      <Link to="/attendance/mark" style={{ marginLeft: "0.75rem" }}>
        Mark
      </Link>
      <Link to="/attendance" style={{ marginLeft: "0.75rem" }}>
        Attendance
      </Link>
      <Link to="/marks" style={{ marginLeft: "0.75rem" }}>
        Marks
      </Link>
      <Link to="/assessments" style={{ marginLeft: "0.75rem" }}>
        Assessments
      </Link>
      <Link to="/leave/apply" style={{ marginLeft: "0.75rem" }}>
        Apply Leave
      </Link>
      <Link to="/leaves" style={{ marginLeft: "0.75rem" }}>
        My Leaves
      </Link>
      <Link to="/library" style={{ marginLeft: "0.75rem" }}>
        Library
      </Link>
      <Link to="/books" style={{ marginLeft: "0.75rem" }}>
        My Books
      </Link>
      <Link to="/salary-slips" style={{ marginLeft: "0.75rem" }}>
        Salary
      </Link>
      <span className="spacer" />
      <span className="who">
        {user.email} <em>({user.role})</em>
      </span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
