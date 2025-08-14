/**
 * TourManager.js
 * Final orchestration class – coordinates app state and delegates to feature modules.
 */

// Notifications & popups
import { showNotification } from './notifications.js';

// Page modules
import { loadAndRenderMyApplications, handleApprove, handleReject } from './applications.js';
import { loadAndRenderMyTours, handleCompletionSubmit, handleVerification } from './tours.js';
import { loadAndRenderApprovalQueue, approveFromQueue, rejectFromQueue } from './approvalQueue.js';
import { loadAndRenderVerificationQueue } from './verificationQueue.js';
import { loadAndRenderDashboard } from './dashboard.js';
import { loadAndRenderAlerts, filterAlertsUI, markAllAlertsRead } from './alerts.js';
import { loadAndRenderUsers } from './users.js';
import { renderReportsPlaceholder } from './reports.js';

// UI/Forms/Settings
import { setupNewApplicationPage } from './forms.js';
import { changeSettingPanel, initUpdateFrequencySlider } from './settings.js';
import { openModal, closeAllModals } from './modals.js';

// Utilities
import { setupTableSearch, exportData } from './utils.js';

export class TourManager {
  constructor() {
    this.currentPage = 'dashboard';
    this.userRole = null;
    this.userName = '';
    this.loggedInUser = null;

    // State for loaded data
    this.allApplications = [];
    this.approvedTours = [];
    this.alerts = [];
    this.users = [];
    this.stats = {};

    this.init();
  }

  /**
   * Initialises event handlers and loads default dashboard data.
   */
  init() {
    this.setupGlobalEventListeners();
    this.navigateTo('dashboard');
  }

  /**
   * Called after login by auth.js
   */
  setUserRole(role, name) {
    this.userRole = role;
    this.userName = name;
    const uname = document.getElementById('officialUserName');
    if (uname) uname.textContent = this.userName;
    this.navigateTo(role === 'user' ? 'user-dashboard' : 'dashboard');
  }

  /**
   * Navigation: switch active page, trigger page-specific module.
   */
  navigateTo(page) {
    // Update nav active styling
    document.querySelectorAll('.nav-item.active').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');

    // Update active page content
    document.querySelectorAll('.page.active').forEach(p => p.classList.remove('active'));
    document.getElementById(page)?.classList.add('active');

    this.currentPage = page;

    // Page-specific data/render calls
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
   * Sets up all application-wide event handlers.
   */
  setupGlobalEventListeners() {
    // Navigation clicks
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        this.navigateTo(item.dataset.page);
      });
    });

    // Modal close
    document.querySelectorAll('.modal-close, .btn-close').forEach(btn =>
      btn.addEventListener('click', closeAllModals)
    );

    // Approve/Reject in Applications
    document.addEventListener('click', e => {
      if (e.target.matches('.approve-btn')) handleApprove(this, e.target.dataset.appId);
      if (e.target.matches('.reject-btn')) handleReject(this, e.target.dataset.appId);
    });

    // Approve/Reject in Approval Queue
    document.addEventListener('click', e => {
      if (e.target.matches('.queue-approve-btn')) approveFromQueue(this, e.target.dataset.appId);
      if (e.target.matches('.queue-reject-btn')) rejectFromQueue(this, e.target.dataset.appId);
    });

    // Tour completion / verification
    document.addEventListener('click', e => {
      if (e.target.matches('.complete-tour-btn')) {
        handleCompletionSubmit(e.target.dataset.tourId, document.getElementById('completionForm'));
      }
      if (e.target.matches('.verify-tour-btn')) {
        handleVerification(e.target.dataset.tourId, e.target.dataset.status);
      }
    });

    // Alert filters
    document.querySelectorAll('.filter-btn').forEach(btn =>
      btn.addEventListener('click', () => filterAlertsUI(btn.dataset.filter))
    );

    // Mark all alerts read
    document.getElementById('markAllReadBtn')?.addEventListener('click', markAllAlertsRead);

    // Settings panel switches
    document.querySelectorAll('.settings-nav li').forEach(li => {
      li.addEventListener('click', () => changeSettingPanel(li.dataset.setting));
    });

    // Export buttons
    document.querySelectorAll('.export-buttons .btn').forEach(btn =>
      btn.addEventListener('click', () => exportData(btn.dataset.format, btn.dataset.table))
    );

    // Table search (example for My Applications)
    setupTableSearch('#myApplicationsTable', '#searchApplications');

    // Init update frequency slider (settings)
    initUpdateFrequencySlider();
  }
}
