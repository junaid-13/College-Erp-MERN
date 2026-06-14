/**
 * Pure helpers shared by the payroll UI.
 */

export const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

/** Validate an upload form (client mirror of backend rules). */
export function validateUpload(form) {
  const e = {};
  if (!form.facultyId || !/^[0-9a-fA-F]{24}$/.test(form.facultyId))
    e.facultyId = "Valid faculty id required";
  if (!form.salaryMonth || !MONTHS.includes(form.salaryMonth))
    e.salaryMonth = "Month is required";
  const yr = Number(form.salaryYear);
  if (!yr || yr < 2000 || yr > 2100) e.salaryYear = "Valid year required";
  if (!form.file) e.file = "A PDF file is required";
  else if (form.file.type && form.file.type !== "application/pdf")
    e.file = "Only PDF files are allowed";
  return e;
}

/** Label like "JAN 2026". */
export function periodLabel(slip) {
  return `${slip.salaryMonth} ${slip.salaryYear}`;
}

/** A short year range list for dropdowns. */
export function yearOptions(centerYear) {
  const y = centerYear || new Date().getFullYear();
  return [y - 1, y, y + 1];
}
