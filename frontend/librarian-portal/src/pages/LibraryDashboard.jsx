import { useEffect, useState } from "react";

import libraryService from "../services/libraryService";

/**
 * Library dashboard (Task 12.30). Shared shape between HOD & Librarian portals.
 * Total books, issued, overdue, fine collection.
 */
export default function LibraryDashboard() {
  const [reports, setReports] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([libraryService.getReports(), libraryService.getAnalytics()])
      .then(([r, a]) => {
        setReports(r.data);
        setAnalytics(a.data);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load dashboard"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page">Loading…</div>;
  if (error) return <div className="page error-banner">{error}</div>;

  return (
    <div className="page">
      <h2>Library Dashboard</h2>

      {reports && (
        <div className="stat-row">
          <div className="stat-card">
            <span className="stat-num">{reports.totalBooks}</span>
            <span>Total Books</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{reports.issuedBooks}</span>
            <span>Issued</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{reports.overdueBooks}</span>
            <span>Overdue</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">₹{reports.fineCollected}</span>
            <span>Fines Collected</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">₹{reports.fineOutstanding}</span>
            <span>Fines Outstanding</span>
          </div>
        </div>
      )}

      {analytics && (
        <section className="detail-block">
          <h3>Most Borrowed Books</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrows</th>
              </tr>
            </thead>
            <tbody>
              {analytics.mostBorrowed.map((b) => (
                <tr key={b.bookId}>
                  <td>{b.bookId}</td>
                  <td>{b.count}</td>
                </tr>
              ))}
              {!analytics.mostBorrowed.length && (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>
                    No data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <p style={{ marginTop: "0.75rem" }}>
            Active borrowers: <strong>{analytics.activeBorrowers}</strong> ·
            Overdue trend: <strong>{analytics.overdueTrend}</strong>
          </p>
        </section>
      )}
    </div>
  );
}
