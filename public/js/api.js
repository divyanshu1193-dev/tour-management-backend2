/**
 * api.js
 * Centralized API service — contains all backend requests for the Tour Management App.
 * Every function returns parsed JSON or throws an error.
 */

//
// ─── APPLICATION ENDPOINTS ───────────────────────────────────────────────
//

/**
 * Fetch applications (optionally filtered by employee ID).
 */
export async function fetchApplications(employeeId = '') {
  const res = await fetch(`/api/applications?employee_id=${encodeURIComponent(employeeId)}&include_approved_tours=true`);
  if (!res.ok) throw new Error(`Applications API error: ${res.status}`);
  return res.json();
}

/**
 * Submit a new application.
 * @param {FormData} formData pre-filled from the form.
 */
export async function submitApplication(formData) {
  const res = await fetch('/api/applications', { method: 'POST', body: formData });
  if (!res.ok) {
    let errorData;
    try { errorData = await res.json(); } catch {}
    throw new Error(errorData?.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

/**
 * Update application status (approve/reject).
 */
export async function updateApplicationStatus(applicationId, status, comments, approvedBy = null) {
  const payload = { status, comments };
  if (approvedBy) payload.approved_by = approvedBy;

  const res = await fetch(`/api/applications/${applicationId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    let errorData;
    try { errorData = await res.json(); } catch {}
    throw new Error(errorData?.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

//
// ─── TOURS ENDPOINTS ─────────────────────────────────────────────────────
//

/**
 * Fetch tours (optionally filtered by employee ID).
 */
export async function fetchTours(employeeId = '') {
  const res = await fetch(`/api/tours?employee_id=${encodeURIComponent(employeeId)}`);
  if (!res.ok) throw new Error(`Tours API error: ${res.status}`);
  return res.json();
}

/**
 * Submit tour completion files/details.
 */
export async function submitTourCompletion(tourId, formData) {
  const res = await fetch(`/api/tours/${tourId}/completion`, {
    method: 'PUT',
    body: formData
  });

  if (!res.ok) {
    let errorData;
    try { errorData = await res.json(); } catch {}
    throw new Error(errorData?.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

/**
 * Verify tour completion (Admin only).
 */
export async function verifyTourCompletion(tourId, status, comments, verifiedBy = null) {
  const payload = {
    verification_status: status,
    verification_comments: comments
  };
  if (verifiedBy) payload.verified_by = verifiedBy;

  const res = await fetch(`/api/tours/${tourId}/verify`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    let errorData;
    try { errorData = await res.json(); } catch {}
    throw new Error(errorData?.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

//
// ─── ALERTS & USERS & STATS ENDPOINTS ─────────────────────────────────────
//

export async function fetchAlerts() {
  const res = await fetch('/api/alerts');
  if (!res.ok) throw new Error(`Alerts API error: ${res.status}`);
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch('/api/users');
  if (!res.ok) throw new Error(`Users API error: ${res.status}`);
  return res.json();
}

export async function fetchStats() {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error(`Stats API error: ${res.status}`);
  return res.json();
}
