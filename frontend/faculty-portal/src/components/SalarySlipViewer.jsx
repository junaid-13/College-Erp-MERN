/**
 * Salary slip viewer (Task 14.23).
 *
 * Canonical shared component. Because each portal is an independent Vite app
 * that only bundles files under its own src/, this file is the source of truth
 * and is mirrored into each portal's components/ directory.
 *
 * Displays salary month, year, and a secure PDF link. The `onDownload`
 * callback should resolve the time-limited download URL via the API client.
 *
 * @param {{salaryMonth, salaryYear, pdfUrl, uploadedAt}} slip
 * @param {(slip)=>Promise<{url:string}>} [onDownload]
 */
import { useState } from "react";

export default function SalarySlipViewer({ slip, onDownload }) {
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState("");

  if (!slip) return null;

  async function download() {
    setError("");
    if (!onDownload) {
      window.open(slip.pdfUrl, "_blank", "noopener");
      return;
    }
    setResolving(true);
    try {
      const res = await onDownload(slip);
      if (res?.url) window.open(res.url, "_blank", "noopener");
    } catch (err) {
      setError(err.response?.data?.message || "Download failed");
    } finally {
      setResolving(false);
    }
  }

  return (
    <div className="salary-slip-viewer detail-block">
      <h3>
        Salary Slip — {slip.salaryMonth} {slip.salaryYear}
      </h3>
      <p>
        Uploaded:{" "}
        {slip.uploadedAt ? new Date(slip.uploadedAt).toLocaleString() : "—"}
      </p>
      {error && <div className="error-banner">{error}</div>}
      <button onClick={download} disabled={resolving}>
        {resolving ? "Preparing…" : "View / Download PDF"}
      </button>
    </div>
  );
}
