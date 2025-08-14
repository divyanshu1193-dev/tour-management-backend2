import { submitApplication } from './api.js';
import { showNotification } from './notifications.js';
import { setupCostCalculator } from './utils.js';
import { setupFileUpload } from './utils.js';

export function setupNewApplicationPage(appInstance) {
  const form = document.getElementById('newApplicationForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(form);
    formData.append('user_id', appInstance.loggedInUser?.user_id || '');
    formData.append('employee_id', appInstance.loggedInUser?.employee_id || '');

    try {
      showNotification('Submitting application...', 'info');
      const result = await submitApplication(formData);
      showNotification(`Application ${result.application_id} submitted successfully!`, 'success');
      form.reset();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  });

  setupCostCalculator();
  setupFileUpload();
}