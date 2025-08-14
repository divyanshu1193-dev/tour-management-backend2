/**
 * auth.js
 * Handles demo login with role support and skip-login.
 */

import { showNotification } from './notifications.js';

export function initLogin(appInstance) {
  const loginForm = document.getElementById('loginForm');
  const loginPage = document.getElementById('loginPage');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      let userRole = null;
      let userName = '';

      // Demo hardcoded credentials
      if (email === 'admin@demo.com' && password === 'admin123') {
        userRole = 'admin';
        userName = 'Admin User';
      } else if (email === 'user@demo.com' && password === 'user123') {
        userRole = 'user';
        userName = 'Dr. DHARMENDRA SINGH YADAV';
      } else {
        showNotification(
          'Invalid credentials. Use admin@demo.com/admin123 or user@demo.com/user123',
          'error'
        );
        return;
      }

      loginPage.style.display = 'none';
      document.body.classList.add('app-visible', `${userRole}-role`);

      if (!window.app) window.app = {};
      window.app.loggedInUser =
        userRole === 'admin'
          ? { user_id: 1, employee_id: 'EMPADMIN' }
          : { user_id: 2, employee_id: 'EMP001' };

      // Show name in header
      const officialUserName = document.getElementById('officialUserName');
      if (officialUserName) officialUserName.textContent = userName;

      // Pass to app class
      appInstance.setUserRole(userRole, userName);

      setTimeout(() => {
        showNotification(`Login successful! Welcome ${userName}.`, 'success');
      }, 500);
    });
  }

  // Add skip login button (demo)
  const skipBtn = document.createElement('button');
  skipBtn.textContent = 'Skip as Admin (Demo)';
  skipBtn.className = 'skip-login-btn';
  skipBtn.onclick = function () {
    loginPage.style.display = 'none';
    document.body.classList.add('app-visible', 'admin-role');
    appInstance.setUserRole('admin', 'Admin User');
    skipBtn.remove();
    showNotification('Skipped login - Admin Demo Mode', 'info');
  };
  document.body.appendChild(skipBtn);
}
