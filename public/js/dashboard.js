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

  const alertsCount = document.getElementById('alertsCount');
  if (alertsCount) alertsCount.textContent = stats.alerts || 0;

  const employeesCount = document.getElementById('employeesCount');
  if (employeesCount) employeesCount.textContent = stats.activeEmployees || 0;
}
