// users.js
import { fetchUsers } from './api.js';
import { showNotification } from './notifications.js';

export async function loadAndRenderUsers(appInstance) {
  try {
    appInstance.users = await fetchUsers();
    renderUsers(appInstance.users);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

export function renderUsers(users) {
  const tbody = document.querySelector('.users-table tbody');
  if (!tbody) return;
  tbody.innerHTML = users.map(u => `
    <tr>
      <td>
        <div class="user-info">
          <div class="user-avatar">${u.name[0]}</div>
          <div>
            <h4>${u.name}</h4>
            <p>${u.department}</p>
          </div>
        </div>
      </td>
      <td>${u.role}</td>
      <td><span class="status-badge ${u.status}">${u.status}</span></td>
      <td>${u.lastActive}</td>
    </tr>
  `).join('');
}
