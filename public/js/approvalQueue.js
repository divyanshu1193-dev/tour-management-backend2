// approvalQueue.js
import { fetchApplications, updateApplicationStatus } from './api.js';
import { showNotification } from './notifications.js';

export async function loadAndRenderApprovalQueue(appInstance) {
  try {
    const apps = await fetchApplications();
    const pending = apps.filter(a => a.status === 'pending');
    renderApprovalQueue(pending);
  } catch (err) {
    showNotification(`Error loading approval queue: ${err.message}`, 'error');
  }
}

export function renderApprovalQueue(pendingApps) {
  const container = document.querySelector('.approval-queue-container');
  if (!container) return;

  if (!pendingApps.length) {
    container.innerHTML = `<div class="empty-state">
      <i class="fas fa-check-circle"></i>
      <h3>No Pending Applications</h3>
      <p>All applications have been processed.</p>
    </div>`;
    return;
  }

  container.innerHTML = pendingApps.map(app => `
    <div class="approval-item">
      <div class="approval-header">
        <h4>${app.applicationId} — ${app.type}</h4>
        <span>${app.origin} → ${app.destination}</span>
      </div>
      <div class="approval-body">
        <p>${app.purpose}</p>
        <p><strong>Priority:</strong> ${app.priority}</p>
        <p><strong>Submitted:</strong> ${app.submittedDate}</p>
      </div>
      <div class="approval-actions">
        <button class="btn btn-success approve-btn" data-app-id="${app.id}">Approve</button>
        <button class="btn btn-danger reject-btn" data-app-id="${app.id}">Reject</button>
      </div>
    </div>
  `).join('');
}

export async function approveFromQueue(appInstance, id) {
  try {
    await updateApplicationStatus(id, 'approved', 'Approved by admin', appInstance.userId || 1);
    showNotification('Application approved', 'success');
    loadAndRenderApprovalQueue(appInstance);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

export async function rejectFromQueue(appInstance, id) {
  const reason = prompt('Reason for rejection:');
  if (!reason) return;
  try {
    await updateApplicationStatus(id, 'rejected', reason);
    showNotification('Application rejected', 'warning');
    loadAndRenderApprovalQueue(appInstance);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}
