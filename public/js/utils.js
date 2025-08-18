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

export function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function getDayOfWeek(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long'
    });
}

export function getStatusIcon(status) {
    const icons = {
        'approved': 'check-circle',
        'pending': 'hourglass-half',
        'submitted': 'paper-plane',
        'rejected': 'ban',
        'in-review': 'eye'
    };
    return icons[status] || 'question-circle';
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

export function renderCompletionCell(tour, formatDateTime) {
    switch (tour.completionStatus) {
        case 'not-uploaded':
            if (tour.tourStatus === 'completed' || tour.travelStatus === 'completed') {
                return `
                    <div class="completion-upload-section">
                        <button class="btn btn-primary btn-sm upload-completion-btn" data-tour-id="${tour.id}">
                            <i class="fas fa-camera"></i> Upload Image
                            <input type="file" accept="image/*" style="display: none;">
                        </button>
                        <br><small class="text-muted">Upload geo-tagged image</small>
                    </div>
                `;
            } else {
                return `<span class="completion-status-badge not-uploaded">Complete tour first</span>`;
            }
        case 'pending':
            return `
                <div class="completion-pending-section">
                    <span class="completion-status-badge pending">
                        <i class="fas fa-clock"></i> Pending Verification
                    </span>
                    <br><small class="text-info">Image submitted: ${formatDateTime(tour.submittedAt)}</small>
                </div>
            `;
        case 'verified':
            return `
                <div class="completion-verified-section">
                    <span class="completion-status-badge verified">
                        <i class="fas fa-check-circle"></i> Verified
                    </span>
                    <br><small class="text-success">Tour completion verified</small>
                </div>
            `;
        case 'rejected':
            return `
                <div class="completion-rejected-section">
                    <span class="completion-status-badge rejected">
                        <i class="fas fa-times-circle"></i> Not Verified
                    </span>
                    <br>
                    <button class="btn btn-primary btn-sm upload-completion-btn" data-tour-id="${tour.id}">
                        <i class="fas fa-camera"></i> Re-upload
                        <input type="file" accept="image/*" style="display: none;">
                    </button>
                </div>
            `;
        default:
            return `<span class="completion-status-badge not-uploaded">Not Available</span>`;
    }
}
