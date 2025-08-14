// utils.js
export function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

export function setupTableSearch(tableSelector, searchInputSelector) {
  const table = document.querySelector(tableSelector);
  const search = document.querySelector(searchInputSelector);
  if (!table || !search) return;

  search.addEventListener('input', () => {
    const filter = search.value.toLowerCase();
    table.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(filter) ? '' : 'none';
    });
  });
}

export function exportData(format, tableSelector) {
  const table = document.querySelector(tableSelector);
  if (!table) return;

  if (format === 'csv') {
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
  } else {
    alert(`Export to ${format} not implemented`);
  }
}
