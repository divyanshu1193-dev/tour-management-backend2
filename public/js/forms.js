// forms.js
import { showNotification } from './notifications.js';
import { submitApplication } from './api.js';

export function setupNewApplicationPage(appInstance) {
  const form = document.getElementById('newApplicationForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(form);

    // Map your old form field names here
    formData.append('user_id', appInstance.loggedInUser?.user_id || '');
    formData.append('employee_id', appInstance.loggedInUser?.employee_id || '');

    try {
      showNotification('Submitting application...', 'info');
      const result = await submitApplication(formData);
      showNotification(`Application ${result.application_id} submitted successfully!`, 'success');
      form.reset();
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
    }
  });

  setupCostCalculator();
  setupFileUpload();
}

export function setupCostCalculator() {
  const inputs = document.querySelectorAll('[data-cost-part]');
  const totalField = document.getElementById('totalEstimatedCost');
  if (!inputs.length || !totalField) return;

  function updateTotal() {
    let total = 0;
    inputs.forEach(input => total += parseFloat(input.value) || 0);
    totalField.value = total.toFixed(2);
  }
  inputs.forEach(i => i.addEventListener('input', updateTotal));
}

export function setupFileUpload() {
  document.querySelectorAll('.file-upload-area').forEach(area => {
    const fileInput = area.querySelector('input[type="file"]');

    area.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      showNotification(`${fileInput.files.length} file(s) selected`, 'info');
    });

    area.addEventListener('dragover', e => {
      e.preventDefault();
      area.classList.add('dragover');
    });
    area.addEventListener('dragleave', () => area.classList.remove('dragover'));
    area.addEventListener('drop', e => {
      e.preventDefault();
      area.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        showNotification(`${fileInput.files.length} file(s) dropped`, 'info');
      }
    });
  });
}
