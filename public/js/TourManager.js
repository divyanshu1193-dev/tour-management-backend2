/**
 * TourManager.js – Final orchestrator (app.js refactored)
 * Holds global state, handles page navigation & delegates to modules.
 */

import { showNotification } from './notifications.js';

// Feature modules for loading and rendering
import { loadAndRenderMyApplications, handleApprove, handleReject } from './applications.js';
import { loadAndRenderMyTours, handleCompletionSubmit, handleVerification } from './tours.js';
import { loadAndRenderApprovalQueue, approveFromQueue, rejectFromQueue } from './approvalQueue.js';
import { loadAndRenderVerificationQueue } from './verificationQueue.js';
import { loadAndRenderDashboard } from './dashboard.js';
import { loadAndRenderAlerts, filterAlertsUI, markAllAlertsRead } from './alerts.js';
import { loadAndRenderUsers } from './users.js';
import { renderReportsPlaceholder } from './reports.js';

// Forms, settings, modals, utils
import { setupNewApplicationPage } from './forms.js';
import { changeSettingPanel, initUpdateFrequencySlider } from './settings.js';
import { openModal, closeAllModals } from './modals.js';
import { setupTableSearch, exportData } from './utils.js';

export class TourManager {
  constructor() {
    this.currentPage = 'dashboard';
    this.userRole = null;
    this.userName = '';
    this.loggedInUser = null;

    // Data state
    this.allApplications = [];
    this.approvedTours = [];
    this.alerts = [];
    this.users = [];
    this.stats = {};

    this.init();
  }

  /**
   * Startup
   */
  init() {
    this.setupGlobalEventListeners();
  }

  /**
   * Called by auth.js after successful login
   */
  setUserRole(role, name) {
    console.log(`TourManager: Setting user role to ${role}, name: ${name}`);
    this.userRole = role;
    this.userName = name;

    // Apply role-based body class for UI visibility rules
    document.body.classList.add(`${role}-role`);

    // Update name in header
    const uname = document.getElementById('officialUserName');
    if (uname) uname.textContent = this.userName;

    // Update navigation for role
    setTimeout(() => {
      if (window.updateNavigationForRole) {
        window.updateNavigationForRole(role);
      }
    }, 200);

    // Show correct dashboard
    this.navigateTo(role === 'user' ? 'user-dashboard' : 'dashboard');
  }

  /**
   * Navigation + page-specific module calls
   * Updated to work with modular component system
   */
  async navigateTo(page) {
    console.log(`TourManager: Navigating to ${page}, userRole: ${this.userRole}`);
    this.currentPage = page;

    // Use component loader for navigation
    if (window.componentLoader) {
      try {
        await window.componentLoader.loadPage(page, this.userRole);
        
        // After component is loaded, run page-specific initialization
        setTimeout(() => {
          console.log(`TourManager: Initializing page content for ${page}`);
          this.initializePageContent(page);
        }, 100); // Small delay to ensure DOM is ready
      } catch (error) {
        console.error(`Error navigating to ${page}:`, error);
      }
    } else {
      console.error('ComponentLoader not available');
    }
  }

  /**
   * Initialize page-specific content after component is loaded
   */
  initializePageContent(page) {
    switch (page) {
      case 'my-applications':
        loadAndRenderMyApplications(this);
        break;
      case 'my-tours':
        loadAndRenderMyTours(this);
        break;
      case 'approval-queue':
        loadAndRenderApprovalQueue(this);
        break;
      case 'tour-completion-verification':
        loadAndRenderVerificationQueue(this);
        break;
      case 'dashboard':
      case 'user-dashboard':
        loadAndRenderDashboard(this);
        break;
      case 'alerts':
        loadAndRenderAlerts(this);
        break;
      case 'users':
      case 'user-management':
        loadAndRenderUsers(this);
        break;
      case 'reports':
        renderReportsPlaceholder();
        break;
      case 'new-application':
        setupNewApplicationPage(this);
        break;
    }
  }

  /**
   * Global event listeners from original app.js
   * Updated to work with modular component system
   */
  setupGlobalEventListeners() {
    // Use event delegation for navigation since nav items are loaded dynamically
    document.addEventListener('click', (e) => {
      // Navigation handling for sidebar nav items
      const navItem = e.target.closest('.nav-item');
      if (navItem && navItem.dataset.page) {
        e.preventDefault();
        this.navigateTo(navItem.dataset.page);
        return;
      }

      // Navigation handling for dashboard buttons and links
      const navigateElement = e.target.closest('[data-navigate]');
      if (navigateElement) {
        e.preventDefault();
        this.navigateTo(navigateElement.dataset.navigate);
        return;
      }

      // Logout handling
      if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
        e.preventDefault();
        this.logout();
        return;
      }
    });

    // Modal close
    document.querySelectorAll('.modal-close, .btn-close').forEach(btn =>
      btn.addEventListener('click', closeAllModals)
    );

    // Approve/Reject – My Applications
    document.addEventListener('click', e => {
      if (e.target.matches('.approve-btn')) handleApprove(this, e.target.dataset.appId);
      if (e.target.matches('.reject-btn')) handleReject(this, e.target.dataset.appId);
    });

    // Approve/Reject – Approval Queue
    document.addEventListener('click', e => {
      if (e.target.matches('.queue-approve-btn')) approveFromQueue(this, e.target.dataset.appId);
      if (e.target.matches('.queue-reject-btn')) rejectFromQueue(this, e.target.dataset.appId);
    });

    // Completion / Verification
    document.addEventListener('click', e => {
      if (e.target.matches('.complete-tour-btn')) {
        handleCompletionSubmit(e.target.dataset.tourId, document.getElementById('completionForm'));
      }
      if (e.target.matches('.verify-tour-btn')) {
        handleVerification(e.target.dataset.tourId, e.target.dataset.status);
      }
    });

    // Alerts filter
    document.querySelectorAll('.filter-btn').forEach(btn =>
      btn.addEventListener('click', () => filterAlertsUI(btn.dataset.filter))
    );

    // Mark all alerts read
    document.getElementById('markAllReadBtn')?.addEventListener('click', markAllAlertsRead);

    // Settings nav
    document.querySelectorAll('.settings-nav li').forEach(li =>
      li.addEventListener('click', () => changeSettingPanel(li.dataset.setting))
    );

    // Export
    document.querySelectorAll('.export-buttons .btn').forEach(btn =>
      btn.addEventListener('click', () => exportData(btn.dataset.format, btn.dataset.table))
    );

    // Search (example – My Applications)
    setupTableSearch('#myApplicationsTable', '#searchApplications');

    // Init settings slider
    initUpdateFrequencySlider();
  }

  /**
   * Logout handling – matches app.js behaviour
   */
  logout() {
    console.log('TourManager: Logging out user');
    
    // Clear localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    
    // Reset app state
    this.userRole = null;
    this.userName = '';
    this.loggedInUser = null;
    document.body.classList.remove('admin-role', 'user-role', 'app-visible');

    // Clear component loader cache
    if (window.componentLoader) {
      window.componentLoader.clearCache();
    }

    // Refresh / show login page
    location.reload();
  }
}
