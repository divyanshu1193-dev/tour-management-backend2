/**
 * applications.js
 * Rendering and handling logic for "My Applications" and approval/rejection.
 */
import { fetchApplications, submitApplication, updateApplicationStatus } from './api.js';
import { showNotification } from './notifications.js';

export async function loadAndRenderMyApplications(appInstance) {
  try {
    const empId = appInstance.loggedInUser?.employee_id || '';
    appInstance.allApplications = await fetchApplications(empId);
    renderMyApplications(appInstance.allApplications);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

export function renderMyApplications(applications) {
  const tbody = document.querySelector('#myApplicationsTable tbody');
  if (!tbody) return;
  tbody.innerHTML = applications.map(app => `
    <tr>
      <td>${app.applicationId}</td>
      <td>${app.type}</td>
      <td>${app.origin} → ${app.destination}</td>
      <td>${app.fromDate}</td>
      <td>${app.toDate}</td>
      <td>${app.priority}</td>
      <td><span class="status-badge ${app.status}">${app.status}</span></td>
      <td>${app.currentlyWith}</td>
      <td>${app.submittedDate || '-'}</td>
      <td>
        ${app.status === 'pending' ? `
          <button class="btn btn-success approve-btn" data-app-id="${app.id}">Approve</button>
          <button class="btn btn-danger reject-btn" data-app-id="${app.id}">Reject</button>
        ` : ''}
      </td>
    </tr>
  `).join('');
}

export async function handleApprove(appInstance, appId) {
  try {
    await updateApplicationStatus(appId, 'approved', 'Approved by admin', appInstance.userId || 1);
    showNotification('Application approved', 'success');
    await loadAndRenderMyApplications(appInstance);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

export async function handleReject(appInstance, appId) {
  const reason = prompt('Reason for rejection:');
  if (!reason) return;
  try {
    await updateApplicationStatus(appId, 'rejected', reason);
    showNotification('Application rejected', 'warning');
    await loadAndRenderMyApplications(appInstance);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}
