import { useEffect, useState } from "react";

import payrollService from "../services/payrollService";

/**
 * Employee salary slip history (Task 14.22). Shared between HOD & Faculty
 * portals. Shows only the authenticated user's own slips (enforced server-side
 * by email ownership) with a secure download button.
 */
export default function SalarySlips() {
  const [slips, setSlips] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    payrollService
      .getMySalarySlips()
      .then((res) => setSlips(res.data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load salary slips"),
      )
      .finally(() => setLoading(false));
  }, []);

  async function download(id) {
    setError("");
    try {
      const res = await payrollService.downloadSalarySlip(id);
      if (res?.url) window.open(res.url, "_blank", "noopener");
    } catch (err) {
      setError(err.response?.data?.message || "Download failed");
    }
  }

  if (loading) return <div className="page">Loading…</div>;

  return (
    <div className="page">
      <h2>My Salary Slips</h2>
      {error && <div className="error-banner">{error}</div>}
      <table className="data-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Year</th>
            <th>Uploaded</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {slips.map((s) => (
            <tr key={s._id}>
              <td>{s.salaryMonth}</td>
              <td>{s.salaryYear}</td>
              <td>
                {s.uploadedAt
                  ? new Date(s.uploadedAt).toLocaleDateString()
                  : "—"}
              </td>
              <td>
                <button onClick={() => download(s._id)}>Download</button>
              </td>
            </tr>
          ))}
          {!slips.length && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No salary slips yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
