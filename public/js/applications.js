import { fetchApplications, updateApplicationStatus } from './api.js';
import { showNotification } from './notifications.js';

export async function loadAndRenderMyApplications(appInstance) {
  try {
    const empId = appInstance.loggedInUser?.employee_id || '';
    appInstance.allApplications = await fetchApplications(empId);
    renderMyApplications(appInstance);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

export function renderMyApplications(appInstance) {
  const tableBody = document.querySelector('#myApplicationsTable tbody');
  if (!tableBody) return;

  if (!appInstance.allApplications.length) {
    tableBody.innerHTML = `<tr><td colspan="11">No applications found</td></tr>`;
    return;
  }

  tableBody.innerHTML = appInstance.allApplications.map((application, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${application.applicationId}</td>
      <td>${application.type}</td>
      <td>${application.origin} → ${application.destination}</td>
      <td>${application.fromDate}</td>
      <td>${application.toDate}</td>
      <td>${application.priority}</td>
      <td><span class="status-badge ${application.status}">${application.status}</span></td>
      <td>${application.currentlyWith}</td>
      <td>${application.submittedDate || '-'}</td>
      <td>
        ${application.status === 'pending'
          ? `<button class="btn btn-success approve-btn" data-app-id="${application.id}">Approve</button>
             <button class="btn btn-danger reject-btn" data-app-id="${application.id}">Reject</button>`
          : '-'}
      </td>
    </tr>
  `).join('');
}

export async function handleApprove(appInstance, appId) {
  try {
    await updateApplicationStatus(appId, 'approved', 'Approved by admin', appInstance.userId || 1);
    showNotification('Application approved', 'success');
    loadAndRenderMyApplications(appInstance);
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
    loadAndRenderMyApplications(appInstance);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}
