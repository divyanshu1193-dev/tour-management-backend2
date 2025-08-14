/**
 * tours.js
 * Rendering and handling logic for tours and completion verification.
 */
import { fetchTours, submitTourCompletion, verifyTourCompletion } from './api.js';
import { showNotification } from './notifications.js';

export async function loadAndRenderMyTours(appInstance) {
  try {
    const empId = appInstance.loggedInUser?.employee_id || '';
    appInstance.approvedTours = await fetchTours(empId);
    renderMyTours(appInstance.approvedTours);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

export function renderMyTours(tours) {
  const tbody = document.querySelector('#myToursTable tbody');
  if (!tbody) return;
  tbody.innerHTML = tours.map(tour => `
    <tr>
      <td>${tour.requestNo}</td>
      <td>${tour.origin} → ${tour.destination}</td>
      <td>${tour.fromDate}</td>
      <td>${tour.toDate}</td>
      <td>${tour.purpose}</td>
      <td><span class="tour-status-badge ${tour.tourStatus}">${tour.tourStatus}</span></td>
      <td><span class="travel-status-badge ${tour.travelStatus}">${tour.travelStatus}</span></td>
      <td>
        <button class="btn btn-info" data-tour-id="${tour.id}">Complete</button>
      </td>
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
