// verificationQueue.js
import { fetchTours, verifyTourCompletion } from './api.js';
import { showNotification } from './notifications.js';

export async function loadAndRenderVerificationQueue(appInstance) {
  try {
    const tours = await fetchTours();
    const pending = tours.filter(t => t.verification_status === 'pending');
    renderVerificationQueue(pending);
  } catch (err) {
    showNotification(`Error loading verification queue: ${err.message}`, 'error');
  }
}

export function renderVerificationQueue(tours) {
  const container = document.querySelector('.completion-queue-container');
  if (!container) return;

  if (!tours.length) {
    container.innerHTML = `<div class="empty-state">
      <i class="fas fa-check-circle"></i>
      <h3>No Tours Awaiting Verification</h3>
    </div>`;
    return;
  }

  container.innerHTML = tours.map(t => `
    <div class="completion-verification-item pending">
      <div class="completion-header">
        <h4>${t.requestNo}</h4>
        <span>${t.origin} → ${t.destination}</span>
      </div>
      <div class="completion-body">
        <p>${t.purpose}</p>
      </div>
      <div class="completion-actions">
        <button class="btn btn-success verify-tour-btn" data-tour-id="${t.id}" data-status="verified">Verify</button>
        <button class="btn btn-danger verify-tour-btn" data-tour-id="${t.id}" data-status="rejected">Reject</button>
      </div>
    </div>
  `).join('');
}

export async function handleTourVerification(id, status) {
  const comments = prompt(`Comments for ${status}:`);
  try {
    await verifyTourCompletion(id, status, comments);
    showNotification(`Tour ${status}`, 'success');
  } catch (err) {
    showNotification(err.message, 'error');
  }
}
