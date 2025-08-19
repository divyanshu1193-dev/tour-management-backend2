// public/js/main.js

import { initLogin } from './auth.js';
import { TourManager } from './TourManager.js';
import { updateNavigationForRole, initNavigation } from './navigation.js';

const app = new TourManager();
window.app = app;

// Make navigation functions globally available
window.updateNavigationForRole = updateNavigationForRole;

// Initialize navigation system
initNavigation(app);

// Listen for component loaded events to initialize features
document.addEventListener('componentLoaded', (event) => {
  const { componentPath, containerId } = event.detail;
  
  // Initialize login when login component is loaded
  if (containerId === 'login-container') {
    initLogin(app);
  }
  
  // Update navigation based on user role when sidebar is loaded
  if (containerId === 'sidebar-container') {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const userRole = localStorage.getItem('userRole') || 'user';
      console.log('Updating navigation for role:', userRole);
      updateNavigationForRole(userRole);
    }, 100);
  }
  
  // Initialize modals when they are loaded
  if (containerId === 'modals-container') {
    initModalHandlers();
  }
});

// Initialize modal handlers
function initModalHandlers() {
  // Enhanced tour modal
  const enhancedTourBtns = document.querySelectorAll('.btn-enhanced-tour');
  enhancedTourBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById('enhancedTourModal');
      if (modal) modal.style.display = 'block';
    });
  });

  // Create tour modal
  const createTourBtn = document.getElementById('createTourBtn');
  if (createTourBtn) {
    createTourBtn.addEventListener('click', () => {
      const modal = document.getElementById('createTourModal');
      if (modal) modal.style.display = 'block';
    });
  }

  // Quick request modal
  const newRequestBtn = document.getElementById('newRequestBtn');
  if (newRequestBtn) {
    newRequestBtn.addEventListener('click', () => {
      const modal = document.getElementById('newRequestModal');
      if (modal) modal.style.display = 'block';
    });
  }

  // Close modal handlers
  document.querySelectorAll('.btn-close, .modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      if (modal) modal.style.display = 'none';
    });
  });

  // Close modal when clicking outside
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Tour Management System - Modular Version Initialized');
});

