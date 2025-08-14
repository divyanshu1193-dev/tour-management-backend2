import { fetchAlerts } from './api.js';
import { showNotification } from './notifications.js';

export async function loadAndRenderAlerts(appInstance) {
  try {
    appInstance.alerts = await fetchAlerts();
    renderAlerts(appInstance.alerts);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

export function renderAlerts(alerts) {
  const container = document.querySelector('.alerts-list');
  if (!container) return;
  container.innerHTML = alerts
    .map(
      a => `
    <div class="alert-card ${a.type}">
      <div class="alert-icon"><i class="${a.icon}"></i></div>
      <div class="alert-content">
        <h4>${a.title}</h4>
        <p>${a.message}</p>
        <div class="alert-meta">${a.date}</div>
      </div>
    </div>
  `
    )
    .join('');
}

export function filterAlertsUI(type) {
  document.querySelectorAll('.alert-card').forEach(card => {
    card.style.display = type === 'all' || card.classList.contains(type) ? '' : 'none';
  });
}

export function markAllAlertsRead() {
  document.querySelectorAll('.alert-card').forEach(a => a.classList.add('read'));
  showNotification('All alerts marked as read', 'success');
}
