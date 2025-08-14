import { fetchTours, submitTourCompletion, verifyTourCompletion } from './api.js';
import { showNotification } from './notifications.js';

export async function loadAndRenderMyTours(appInstance) {
  try {
    const empId = appInstance.loggedInUser?.employee_id || '';
    appInstance.approvedTours = await fetchTours(empId);
    renderMyTours(appInstance);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

export function renderMyTours(appInstance) {
  const tableBody = document.querySelector('#myToursTable tbody');
  if (!tableBody) return;

  if (!appInstance.approvedTours.length) {
    tableBody.innerHTML = `<tr><td colspan="12">No tours found</td></tr>`;
    return;
  }

  tableBody.innerHTML = appInstance.approvedTours.map((tour, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${tour.requestNo}</td>
      <td>${tour.origin} → ${tour.destination}</td>
      <td>${tour.fromDate}</td>
      <td>${tour.toDate}</td>
      <td>${tour.purpose}</td>
      <td><span class="tour-status-badge ${tour.tourStatus}">${tour.tourStatus}</span></td>
      <td><span class="travel-status-badge ${tour.travelStatus}">${tour.travelStatus}</span></td>
      <td>-</td>
      <td>-</td>
      <td>
        ${tour.tourStatus === 'completed' ? 
          `<button class="btn btn-info complete-tour-btn" data-tour-id="${tour.id}">Upload Completion</button>` : '-'}
      </td>
      <td>-</td>
    </tr>
  `).join('');
}

export async function handleCompletionSubmit(tourId, formEl) {
  try {
    await submitTourCompletion(tourId, new FormData(formEl));
    showNotification('Tour completion submitted', 'success');
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

export async function handleVerification(tourId, status) {
  const comments = prompt(`Comments for ${status}:`);
  try {
    await verifyTourCompletion(tourId, status, comments);
    showNotification(`Tour marked as ${status}`, 'success');
  } catch (err) {
    showNotification(err.message, 'error');
  }
}
