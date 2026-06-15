import api from "../api/client";

/**
 * Centralized Payroll API client (Task 14.20).
 * Talks to the API Gateway (/api/payroll). Reusable across portals.
 */
const BASE = "/api/payroll";

export function uploadSalarySlip({
  facultyId,
  salaryMonth,
  salaryYear,
  employeeCode,
  facultyEmail,
  departmentId,
  file,
}) {
  const form = new FormData();
  form.append("facultyId", facultyId);
  form.append("salaryMonth", salaryMonth);
  form.append("salaryYear", salaryYear);
  if (employeeCode) form.append("employeeCode", employeeCode);
  if (facultyEmail) form.append("facultyEmail", facultyEmail);
  if (departmentId) form.append("departmentId", departmentId);
  if (file) form.append("file", file);
  return api
    .post(`${BASE}/salary-slips`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
}

export function getMySalarySlips(params = {}) {
  return api.get(`${BASE}/salary-slips/me`, { params }).then((r) => r.data);
}

export function getSalarySlip(id) {
  return api.get(`${BASE}/salary-slips/${id}`).then((r) => r.data);
}

export function downloadSalarySlip(id) {
  return api.get(`${BASE}/salary-slips/${id}/download`).then((r) => r.data);
}

export function deleteSalarySlip(id) {
  return api.delete(`${BASE}/salary-slips/${id}`).then((r) => r.data);
}

export function getHistory(params = {}) {
  return api.get(`${BASE}/history`, { params }).then((r) => r.data);
}

export function getReports(params = {}) {
  return api.get(`${BASE}/reports`, { params }).then((r) => r.data);
}

export function getAnalytics(params = {}) {
  return api.get(`${BASE}/analytics`, { params }).then((r) => r.data);
}

export default {
  uploadSalarySlip,
  getMySalarySlips,
  getSalarySlip,
  downloadSalarySlip,
  deleteSalarySlip,
  getHistory,
  getReports,
  getAnalytics,
};
