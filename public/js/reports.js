// reports.js
export function renderReportsPlaceholder() {
  const container = document.querySelector('.reports-grid');
  if (!container) return;
  container.innerHTML = `
    <div class="report-card"><div class="card-content">Distance Chart Placeholder</div></div>
    <div class="report-card"><div class="card-content">Time Chart Placeholder</div></div>
  `;
}
