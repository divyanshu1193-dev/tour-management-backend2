import { fetchApplications, updateApplicationStatus } from './api.js';
import { showNotification } from './notifications.js';
import { mapApplications } from './mappings.js';
import { capitalize, formatDate, getDayOfWeek, getStatusIcon } from './utils.js';

export async function loadAndRenderMyApplications(appInstance) {
  try {
    const empId = appInstance?.loggedInUser?.employee_id || '';
    const apiResponse = await fetchApplications(empId);
    appInstance.allApplications = mapApplications(apiResponse);
    renderMyApplications(appInstance);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

export function renderMyApplications(appInstance) {
    const tbody = document.querySelector('#myApplicationsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!appInstance.allApplications.length) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;">No Applications Found</td></tr>`;
        return;
    }

    appInstance.allApplications.forEach((application, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div class="request-cell">
                    <strong>${application.applicationId}</strong><br>
                    <small>${application.requestNo || '-'}</small>
                </div>
            </td>
            <td>
                <span class="application-type-badge ${application.type}">
                    ${capitalize(application.type)}
                </span>
            </td>
            <td>
                <div class="route-cell">
                    <i class="fas fa-map-marker-alt start-icon"></i>
                    ${application.origin}<br>
                    <i class="fas fa-arrow-down"></i><br>
                    <i class="fas fa-map-marker-alt end-icon"></i>
                    ${application.destination}
                </div>
            </td>
            <td>
                <div class="date-cell">
                    <strong>${formatDate(application.fromDate)}</strong><br>
                    <small>${getDayOfWeek(application.fromDate)}</small>
                </div>
            </td>
            <td>
                <div class="date-cell">
                    <strong>${formatDate(application.toDate)}</strong><br>
                    <small>${getDayOfWeek(application.toDate)}</small>
                </div>
            </td>
            <td>
                <span class="priority-badge ${application.priority}">
                    ${capitalize(application.priority)}
                </span>
            </td>
            <td>
                <div class="status-cell">
                    <span class="status-badge ${application.status}">
                        <i class="fas fa-${getStatusIcon(application.status)}"></i>
                        ${capitalize(application.status)}
                    </span>
                </div>
            </td>
            <td>
                <div class="currently-with-cell">
                    <strong>${application.currentlyWith}</strong><br>
                    <small>Processing</small>
                </div>
            </td>
            <td>
                <div class="date-cell">
                    <strong>${formatDate(application.submittedDate)}</strong>
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary btn-sm" title="View Details" onclick="app.viewApplicationDetails('${application.applicationId}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${
                        application.status === 'pending' || application.status === 'submitted'
                            ? `<button class="btn btn-warning btn-sm" title="Edit" onclick="app.editApplication('${application.applicationId}')">
                                    <i class="fas fa-edit"></i>
                               </button>
                               <button class="btn btn-danger btn-sm" title="Cancel" onclick="app.cancelApplication('${application.applicationId}')">
                                    <i class="fas fa-times"></i>
                               </button>`
                            : ''
                    }
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Optionally update summary counts if you have a method on appInstance
    if(typeof appInstance.updateApplicationSummary === 'function') {
        appInstance.updateApplicationSummary();
    }
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
