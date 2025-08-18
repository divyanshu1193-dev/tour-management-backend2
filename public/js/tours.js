import { fetchTours, submitTourCompletion, verifyTourCompletion } from './api.js';
import { showNotification } from './notifications.js';
import { mapTours } from './mappings.js';
import { capitalize, formatDate, getDayOfWeek, formatDateTime, renderCompletionCell } from './utils.js';

export async function loadAndRenderMyTours(appInstance) {
  try {
    const empId = appInstance?.loggedInUser?.employee_id || '';
    const apiResponse = await fetchTours(empId);
    appInstance.approvedTours = mapTours(apiResponse);
    renderMyTours(appInstance);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

export function renderMyTours(appInstance) {
  const tbody = document.querySelector('#myToursTable tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!appInstance.approvedTours.length) {
    tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;">No Tours Found</td></tr>`;
    return;
  }

  appInstance.approvedTours.forEach((tour, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${index + 1}</td>
        <td>
            <div class="request-cell">
                <strong>${tour.requestNo}</strong>
            </div>
        </td>
        <td>
            <div class="route-cell">
                ${tour.route}
            </div>
        </td>
        <td>
            <div class="date-cell">
                <strong>${formatDate(tour.fromDate)}</strong><br>
                <small>${getDayOfWeek(tour.fromDate)}</small>
            </div>
        </td>
        <td>
            <div class="date-cell">
                <strong>${formatDate(tour.toDate)}</strong><br>
                <small>${getDayOfWeek(tour.toDate)}</small>
            </div>
        </td>
        <td>
            <div class="purpose-cell">
                <strong>${tour.purpose}</strong>
            </div>
        </td>
        <td>
            <span class="tour-status-badge ${tour.tourStatus}">
                ${capitalize(tour.tourStatus)}
            </span>
        </td>
        <td>
            <span class="travel-status-badge ${tour.travelStatus}">
                ${capitalize(tour.travelStatus.replace(/-/g, ' '))}
            </span>
        </td>
        <td>
            <div class="reports-cell">
                ${
                    tour.tourStatus === 'completed'
                        ? `<button class="btn btn-info btn-sm" onclick="app.downloadReport('${tour.requestNo}')" title="Download Report">
                                <i class="fas fa-download"></i>
                            </button>`
                        : `<button class="btn btn-secondary btn-sm" disabled title="Not Available">
                                <i class="fas fa-file-alt"></i>
                            </button>`
                }
            </div>
        </td>
        <td>
            <div class="ticket-status">
                ${
                    tour.ticketsBooked
                        ? `<span class="ticket-badge booked">
                                <i class="fas fa-check"></i>
                                Booked
                            </span>`
                        : `<button class="btn btn-primary btn-sm" onclick="app.bookTicket('${tour.requestNo}')" title="Book Ticket">
                                <i class="fas fa-ticket-alt"></i>
                                Book
                            </button>`
                }
            </div>
        </td>
        <td>
            ${renderCompletionCell(tour, formatDateTime)}
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-secondary btn-sm" title="View Details" onclick="app.viewTourDetails('${tour.requestNo}')">
                    <i class="fas fa-eye"></i>
                </button>
                ${
                    tour.tourStatus !== 'completed'
                        ? `<button class="btn btn-warning btn-sm" title="Update Status" onclick="app.updateTourStatus('${tour.requestNo}')">
                                <i class="fas fa-edit"></i>
                            </button>`
                        : ''
                }
            </div>
        </td>
    `;

    tbody.appendChild(row);
  });

  // Call optional summary & setups if they exist
  if (typeof appInstance.updateTourSummary === 'function') {
    appInstance.updateTourSummary();
  }

  if (typeof appInstance.setupCompletionUploads === 'function') {
    appInstance.setupCompletionUploads();
  }
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
