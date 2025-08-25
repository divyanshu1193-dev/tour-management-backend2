import { fetchApplications, updateApplicationStatus } from './api.js';
import { showNotification } from './notifications.js';

export async function loadAndRenderApprovalQueue(appInstance) {
  try {
    const apps = await fetchApplications();
    const pending = apps.filter(a => a.status === 'pending');
    // Keep in memory for detail view
    window.__appsCache = new Map(pending.map(a => [String(a.id), a]));
    renderApprovalQueue(pending);
  } catch (err) {
    showNotification(`Error: ${err.message}`, 'error');
  }
}

export function renderApprovalQueue(pendingApps) {
  const container = document.querySelector('.approval-queue-container');
  if (!container) return;

  if (!pendingApps.length) {
    container.innerHTML = `<div class="empty-state">
      <i class="fas fa-check-circle"></i>
      <h3>No Pending Applications</h3>
    </div>`;
    return;
  }

  container.innerHTML = pendingApps
    .map(
      app => `
    <div class="approval-item card">
      <div class="approval-header">
        <div class="applicant-info">
          <div class="applicant-avatar">${(app.full_name || 'NA').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</div>
          <div>
            <h4>${app.full_name || 'Unknown User'}</h4>
            <p>${app.type || 'Tour'} — ${app.origin} → ${app.destination}</p>
          </div>
        </div>
        <div class="priority-badge ${app.priority || 'medium'}">${(app.priority || 'medium')}</div>
      </div>
      <div class="approval-body">
        <div class="tour-details">
          <div class="detail-item"><i class="fas fa-route"></i> <span>${app.origin} → ${app.destination}</span></div>
          <div class="detail-item"><i class="fas fa-calendar"></i> <span>${app.from_date?.slice(0,10)} – ${app.to_date?.slice(0,10)}</span></div>
          <div class="detail-item"><i class="fas fa-briefcase"></i> <span>${app.purpose}</span></div>
        </div>
        <div class="approval-actions">
          <button class="btn btn-success btn-sm queue-approve-btn" data-app-id="${app.id}"><i class="fas fa-check"></i> Approve</button>
          <button class="btn btn-danger btn-sm queue-reject-btn" data-app-id="${app.id}"><i class="fas fa-times"></i> Reject</button>
          <button class="btn btn-info btn-sm view-application-btn" data-app-id="${app.id}"><i class="fas fa-eye"></i> View</button>
        </div>
      </div>
    </div>
  `
    )
    .join('');
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
