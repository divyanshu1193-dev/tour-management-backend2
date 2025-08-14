/**
 * modals.js
 * Simple modal utilities: open, close, close all.
 */
export function openModal(id) {
  document.getElementById(id)?.classList.add('active');
}

export function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

export function closeAllModals() {
  document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
}
