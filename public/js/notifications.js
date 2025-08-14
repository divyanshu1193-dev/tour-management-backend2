/**
 * notifications.js
 * Simple reusable notification system.
 */

export function showNotification(message, type = 'info') {
  // Remove existing notification
  const existing = document.querySelector('.simple-notification');
  if (existing) existing.remove();

  // Create new notification element
  const notification = document.createElement('div');
  notification.className = `simple-notification ${type}`;
  notification.innerHTML = `${message}`;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${
      type === 'success'
        ? '#28a745'
        : type === 'error'
        ? '#dc3545'
        : type === 'warning'
        ? '#ffc107'
        : '#007bff'
    };
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;

  // Add keyframe animation style only once
  if (!document.getElementById('notification-animation-style')) {
    const style = document.createElement('style');
    style.id = 'notification-animation-style';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) notification.remove();
  }, 5000);
}
