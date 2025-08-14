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
    this.userRole = role;
    this.userName = name;

    // Apply role-based body class for UI visibility rules
    document.body.classList.add(`${role}-role`);

    // Update name in header
    const uname = document.getElementById('officialUserName');
    if (uname) uname.textContent = this.userName;

    // Show correct dashboard
    this.navigateTo(role === 'user' ? 'user-dashboard' : 'dashboard');
  }

  /**
   * Navigation + page-specific module calls
   */
  navigateTo(page) {
    // Update active nav item
    document.querySelectorAll('.nav-item.active').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');

    // Show page
    document.querySelectorAll('.page.active').forEach(p => p.classList.remove('active'));
    document.getElementById(page)?.classList.add('active');

    this.currentPage = page;

    // Load content based on page
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
   * Global event listeners from original app.js
   */
  setupGlobalEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        this.navigateTo(item.dataset.page);
      });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', e => {
        e.preventDefault();
        this.logout();
      });
    }

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
    // Reset app state
    this.userRole = null;
    this.userName = '';
    this.loggedInUser = null;
    document.body.classList.remove('admin-role', 'user-role', 'app-visible');

    // Refresh / show login page
    location.reload();
  }
}
