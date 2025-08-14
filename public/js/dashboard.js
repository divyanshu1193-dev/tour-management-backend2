// dashboard.js
import { fetchStats } from './api.js';
import { showNotification } from './notifications.js';

export async function loadAndRenderDashboard(appInstance) {
  try {
    appInstance.stats = await fetchStats();
    renderDashboard(appInstance.stats);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

export function renderDashboard(stats) {
  const activeTours = document.getElementById('activeToursCount');
  if (activeTours) activeTours.textContent = stats.activeTours || 0;

  const completedTours = document.getElementById('completedToursCount');
  if (completedTours) completedTours.textContent = stats.completedTours || 0;

  // Example: you could generate more detailed dashboard cards here
}
