import { useState } from "react";

import { validateBook } from "../utils/libraryHelpers";

const EMPTY = {
  isbn: "",
  title: "",
  author: "",
  publisher: "",
  edition: "",
  category: "",
  rackNumber: "",
  totalCopies: 1,
};

/**
 * Reusable add/edit book form.
 */
export default function BookForm({
  initial,
  onSubmit,
  submitLabel = "Save",
  isbnReadOnly = false,
}) {
  const [form, setForm] = useState({ ...EMPTY, ...(initial || {}) });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError("");
    const e = validateBook(form);
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    try {
      await onSubmit({ ...form, totalCopies: Number(form.totalCopies) });
    } catch (err) {
      setServerError(err.response?.data?.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  const field = (label, key, type = "text", ro = false) => (
    <label>
      {label}
      <input
        type={type}
        value={form[key]}
        readOnly={ro}
        onChange={(e) => set(key, e.target.value)}
      />
      {errors[key] && <span className="field-error">{errors[key]}</span>}
    </label>
  );

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="error-banner">{serverError}</div>}
      <fieldset>
        <legend>Book</legend>
        {field("ISBN", "isbn", "text", isbnReadOnly)}
        {field("Title", "title")}
        {field("Author", "author")}
        {field("Publisher", "publisher")}
        {field("Edition", "edition")}
        {field("Category", "category")}
        {field("Rack Number", "rackNumber")}
        {field("Total Copies", "totalCopies", "number")}
      </fieldset>
      <button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
