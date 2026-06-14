import { useState } from "react";

import { validateMark } from "../utils/marksHelpers";

/**
 * Bulk marks entry table (Task 9.26).
 * Renders a student list with a marks input per student and bulk save.
 *
 * @param {Array<{_id,label}>} students
 * @param {number} maxMarks
 * @param {(entries:Array)=>Promise} onSave  receives [{studentId, marksObtained}]
 */
export default function MarksTable({ students = [], maxMarks, onSave }) {
  const [marks, setMarks] = useState(() =>
    Object.fromEntries(students.map((s) => [s._id, ""])),
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function set(id, value) {
    setMarks((m) => ({ ...m, [id]: value }));
    setErrors((e) => ({ ...e, [id]: validateMark(value, maxMarks) }));
  }

  async function save() {
    // Validate all.
    const newErrors = {};
    students.forEach((s) => {
      const err = validateMark(marks[s._id], maxMarks);
      if (err) newErrors[s._id] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setSaving(true);
    setError("");
    setMessage("");
    try {
      const entries = students.map((s) => ({
        studentId: s._id,
        marksObtained: Number(marks[s._id]),
      }));
      const res = await onSave(entries);
      setMessage(
        `Saved ${res?.created ?? entries.length} record(s)${res?.duplicates ? `, ${res.duplicates} duplicate(s) skipped` : ""}.`,
      );
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!students.length) return <p>No students to mark.</p>;

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Marks (max {maxMarks})</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.label || s._id}</td>
              <td>
                <input
                  type="number"
                  value={marks[s._id]}
                  onChange={(e) => set(s._id, e.target.value)}
                  style={{ width: "90px" }}
                />
                {errors[s._id] && (
                  <span className="field-error"> {errors[s._id]}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      <button onClick={save} disabled={saving} style={{ marginTop: "0.75rem" }}>
        {saving ? "Saving…" : "Save Marks"}
      </button>
    </div>
  );
}
