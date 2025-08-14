// utils.js
export function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

export function setupTableSearch(tableSelector, inputSelector) {
  const table = document.querySelector(tableSelector);
  const searchInput = document.querySelector(inputSelector);
  if (!table || !searchInput) return;

  searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    table.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(filter) ? '' : 'none';
    });
  });
}

export function exportData(format, tableSelector) {
  const table = document.querySelector(tableSelector);
  if (!table) return;
  if (format !== 'csv') {
    alert('Only CSV export implemented');
    return;
  }
  let csv = [];
  table.querySelectorAll('tr').forEach(row => {
    const cols = Array.from(row.children).map(td => `"${td.innerText}"`);
    csv.push(cols.join(','));
  });
  const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'export.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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