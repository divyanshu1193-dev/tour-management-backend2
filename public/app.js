// Simple Login Handler with Role Support
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginPage = document.getElementById('loginPage');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            let userRole = null;
            let userName = '';
            
            // Check credentials and assign roles
            if (email === 'admin@demo.com' && password === 'admin123') {
                userRole = 'admin';
                userName = 'Admin User';
            } else if (email === 'user@demo.com' && password === 'user123') {
                userRole = 'user';
                userName = 'Dr. DHARMENDRA SINGH YADAV';
            } else {
                showNotification('Invalid credentials. Use admin@demo.com/admin123 or user@demo.com/user123', 'error');
                return;
            }
            
            // Hide login page
            loginPage.style.display = 'none';
            
            // Show main application
            document.body.classList.add('app-visible');
            document.body.classList.add(userRole + '-role');
            
            // Store user_id and employee_id for app session
            if (!window.app) window.app = {};
            if (userRole === 'admin') {
                window.app.loggedInUser = { user_id: 1, employee_id: 'EMPADMIN' };
            } else if (userRole === 'user') {
                window.app.loggedInUser = { user_id: 2, employee_id: 'EMP001' };
            }

            // Update official header
            const officialUserName = document.getElementById('officialUserName');
            if (officialUserName) {
                officialUserName.textContent = userName;
            }
            
            // Initialize app with role
            window.app.setUserRole(userRole, userName);
            
            // Show success message
            setTimeout(() => {
                showNotification(`Login successful! Welcome ${userName}.`, 'success');
            }, 500);
        });
    }
    
    // Add skip login button for demo
    const skipBtn = document.createElement('button');
    skipBtn.textContent = 'Skip as Admin (Demo)';
    skipBtn.className = 'skip-login-btn';
    skipBtn.onclick = function() {
        loginPage.style.display = 'none';
        document.body.classList.add('app-visible');
        document.body.classList.add('admin-role');
        window.app.setUserRole('admin', 'Admin User');
        skipBtn.remove();
        showNotification('Skipped login - Admin Demo Mode', 'info');
    };
    document.body.appendChild(skipBtn);
}

// Simple notification function
function showNotification(message, type) {
    const existing = document.querySelector('.simple-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `simple-notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Enhanced Application Class with Tour Completion Features
class MasterTourPro {
    constructor() {
        this.currentPage = 'dashboard';
        this.userRole = 'admin';
        this.userName = 'Admin User';
        this.allApplications = [];
        this.approvedTours = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupEnhancedEventListeners();
        this.loadSampleData();
        this.updateStats();
        this.setupTableSearch();
        this.setupNewApplicationPage();
    }

    setUserRole(role, name) {
        this.userRole = role;
        this.userName = name;
        
        // Navigate to appropriate dashboard
        if (role === 'user') {
            this.navigateTo('user-dashboard');
        } else {
            this.navigateTo('dashboard');
        }
        
        this.updateUserInterface();
    }

    updateUserInterface() {
        // Update user name in government header
        const officialUserName = document.getElementById('officialUserName');
        if (officialUserName) {
            officialUserName.textContent = this.userName;
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });

        // Modal handlers
        const createTourBtn = document.getElementById('createTourBtn');
        const addTourBtn = document.getElementById('addTourBtn');
        const newRequestBtn = document.getElementById('newRequestBtn');
        
        if (createTourBtn) {
            createTourBtn.addEventListener('click', () => this.openModal('createTourModal'));
        }
        if (addTourBtn) {
            addTourBtn.addEventListener('click', () => this.openModal('createTourModal'));
        }
        if (newRequestBtn) {
            newRequestBtn.addEventListener('click', () => this.openModal('newRequestModal'));
        }

        // Modal close buttons
        document.querySelectorAll('.btn-close, .modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Save Tour (Admin)
        const saveTourBtn = document.getElementById('saveTourBtn');
        if (saveTourBtn) {
            saveTourBtn.addEventListener('click', () => this.saveTour());
        }

        // Submit Request (User)
        const submitRequestBtn = document.getElementById('submitRequestBtn');
        if (submitRequestBtn) {
            submitRequestBtn.addEventListener('click', () => this.submitRequest());
        }

        document.querySelectorAll('.btn-enhanced-tour').forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.app) {
                    window.app.navigateTo('new-application');
                }
            });
        });

        // Update quick action button
        const newApplicationBtn = document.querySelector('.quick-action-btn[onclick*="New Application"]');
        if (newApplicationBtn) {
            newApplicationBtn.onclick = () => {
                if (window.app) {
                    window.app.navigateTo('new-application');
                }
            };
        }

        // Settings navigation
        document.querySelectorAll('.settings-nav li').forEach(item => {
            item.addEventListener('click', () => {
                const setting = item.dataset.setting;
                this.changeSettingPanel(setting);
                
                const activeItem = document.querySelector('.settings-nav li.active');
                if (activeItem) activeItem.classList.remove('active');
                item.classList.add('active');
            });
        });

        // Alert filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const activeBtn = document.querySelector('.filter-btn.active');
                if (activeBtn) activeBtn.classList.remove('active');
                btn.classList.add('active');
                this.filterAlerts(btn.dataset.filter);
            });
        });

        // Export buttons
        document.querySelectorAll('.export-buttons .btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.format;
                this.exportData(format);
            });
        });

        // Other button handlers
        this.setupButtonHandlers();

        // Logout functionality in government header
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Setup mobile menu
        this.setupMobileMenu();
    }

    setupEnhancedEventListeners() {
        // Enhanced tour form submission
        const submitEnhancedTourBtn = document.getElementById('submitEnhancedTourBtn');
        if (submitEnhancedTourBtn) {
            submitEnhancedTourBtn.addEventListener('click', () => {
                this.submitEnhancedTour();
            });
        }

        // Setup file upload and cost calculator
        this.setupFileUpload();
        this.setupCostCalculator();
        
        // Open enhanced tour modal
        document.querySelectorAll('.btn-enhanced-tour').forEach(btn => {
            btn.addEventListener('click', () => {
                this.openModal('enhancedTourModal');
            });
        });

        // Approval actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.approve-btn')) {
                const appId = e.target.dataset.appId;
                this.approveApplication(appId);
            } else if (e.target.matches('.reject-btn')) {
                const appId = e.target.dataset.appId;
                this.rejectApplication(appId);
            }
        });
    }

    setupButtonHandlers() {
        // Refresh map
        const refreshMapBtn = document.getElementById('refreshMapBtn');
        if (refreshMapBtn) {
            refreshMapBtn.addEventListener('click', () => {
                showNotification('Map refreshed successfully', 'success');
            });
        }

        // Mark all alerts read
        const markAllReadBtn = document.getElementById('markAllReadBtn');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                showNotification('All alerts marked as read', 'success');
            });
        }

        // Generate report
        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => {
                showNotification('Report generated successfully', 'success');
            });
        }

        // Update frequency slider
        const updateFrequency = document.getElementById('updateFrequency');
        if (updateFrequency) {
            const sliderValue = updateFrequency.parentNode.querySelector('.slider-value');
            updateFrequency.addEventListener('input', () => {
                sliderValue.textContent = updateFrequency.value + ' seconds';
            });
        }
    }

    // Replace your existing navigateTo method with this updated version
    navigateTo(page) {
        if (this.currentPage === page) return;
        
        // Update navigation active state
        const activeNavItem = document.querySelector('.nav-item.active');
        if (activeNavItem) activeNavItem.classList.remove('active');
        
        const newNavItem = document.querySelector('.nav-item[data-page="' + page + '"]');
        if (newNavItem) newNavItem.classList.add('active');

        // Update page content
        const activePage = document.querySelector('.page.active');
        if (activePage) activePage.classList.remove('active');
        
        const newPage = document.getElementById(page);
        if (newPage) newPage.classList.add('active');

        this.currentPage = page;

        // Load page-specific data
        if (page === 'my-applications') {
            this.loadApplications().then(() => {
                this.renderMyApplications();
            });
        } else if (page === 'my-tours') {
            this.loadTours().then(() => {
                this.renderMyTours();
            });
        } else if (page === 'approval-queue') {
            this.renderApprovalQueue();
        } else if (page === 'tour-completion-verification') {
            this.renderCompletionVerificationQueue();
        } else if (page === 'new-application') {
            this.setupNewApplicationPage();
        }
    }


    // Enhanced data loading with all relationships
    async loadSampleData() {
        try {
            console.log('Loading all data from database APIs...');
            
            await Promise.all([
            this.loadApplications(),
            this.loadTours(),
            this.loadAlerts(),
            this.loadUsers(),
            this.loadStats()
            ]);
            
            console.log('All data loaded successfully from database');
            this.updateUI();
            
        } catch (error) {
            console.error('Error loading data from database:', error);
            showNotification('Error connecting to database. Please check connection.', 'error');
        }
    }

    async loadApplications() {
        const { employee_id } = this.loggedInUser || {};
        const response = await fetch(`/api/applications?employee_id=${encodeURIComponent(employee_id || '')}&include_approved_tours=true`);

        if (!response.ok) throw new Error(`Applications API error: ${response.status}`);
        
        const applicationsData = await response.json();
        this.allApplications = applicationsData.map(app => ({
            id: app.id,
            applicationId: app.application_id,
            type: app.type,
            origin: app.origin,
            destination: app.destination,
            fromDate: app.from_date,
            toDate: app.to_date,
            fromTime: app.from_time,
            toTime: app.to_time,
            purpose: app.purpose,
            travelMode: app.travel_mode,
            accommodationRequired: app.accommodation_required,
            transportRequired: app.transport_required,
            estimatedCost: app.estimated_cost,
            priority: app.priority,
            urgency: app.urgency,
            status: app.status,
            currentlyWith: app.currently_with,
            submittedDate: app.submitted_date,
            approvedDate: app.approved_date,
            rejectedDate: app.rejected_date,
            comments: app.comments,
            supportingDocuments: app.supporting_documents,
            fullName: app.full_name,
            employeeId: app.employee_id,
            department: app.department,
            requestNo: app.request_no,
            tourStatus: app.tour_status,
            completionStatus: app.completion_status
        }));
    }

    // Fixed submission method with proper backend mapping
    async submitNewApplication() {
        const form = document.getElementById('newApplicationForm');
        if (!form) return;

        const formData = new FormData(form);

        // 🔹 Map frontend field names to backend expected names
        // Ensure these match your form names exactly
        formData.append('type', formData.get('tourType'));
        formData.append('origin', formData.get('originStation'));
        formData.append('destination', formData.get('destinationStation'));
        formData.append('from_date', formData.get('departureDate'));
        formData.append('to_date', formData.get('arrivalDate'));
        formData.append('from_time', formData.get('departureTime'));
        formData.append('to_time', formData.get('arrivalTime'));
        formData.append('purpose', formData.get('tourPurpose'));
        formData.append('travel_mode', formData.get('modeOfTravel'));

        // 🔹 Append IDs from login
        formData.append('user_id', this.loggedInUser?.user_id || '');
        formData.append('employee_id', this.loggedInUser?.employee_id || '');

        try {
            showNotification('Submitting application...', 'info');

            const response = await fetch('/api/applications', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            showNotification(`Application ${result.application_id} submitted successfully!`, 'success');

            // Reset form
            form.reset();

            // 🔹 Reload from DB so only real records are shown
            await this.loadApplications();
            await this.loadStats();
            this.updateUI();
            this.navigateTo('my-applications');

        } catch (error) {
            console.error('Error submitting application:', error);
            showNotification('Error submitting application: ' + error.message, 'error');
        }
    }



    // Enhanced approval method
    async approveApplication(applicationId) {
        try {
            showNotification('Processing approval...', 'info');
            
            const response = await fetch(`/api/applications/${applicationId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                status: 'approved', 
                comments: 'Approved by admin',
                approved_by: this.userId || 1
            })
            });

            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            showNotification('Application approved successfully! Tour created.', 'success');
            
            // Refresh all data
            await this.loadApplications();
            await this.loadTours();
            await this.loadAlerts();
            await this.loadStats();
            this.updateUI();

        } catch (error) {
            console.error('Error approving application:', error);
            showNotification('Error approving application: ' + error.message, 'error');
        }
    }

    // Enhanced rejection method
    async rejectApplication(applicationId) {
        const reason = prompt('Please provide reason for rejection:');
        if (!reason) return;

        try {
            showNotification('Processing rejection...', 'info');
            
            const response = await fetch(`/api/applications/${applicationId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                status: 'rejected', 
                comments: reason 
            })
            });

            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            showNotification('Application rejected', 'warning');
            
            // Refresh data
            await this.loadApplications();
            await this.loadAlerts();
            await this.loadStats();
            this.updateUI();

        } catch (error) {
            console.error('Error rejecting application:', error);
            showNotification('Error rejecting application: ' + error.message, 'error');
        }
    }

    // Tour completion submission
    async submitTourCompletion(tourId) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content large-modal">
            <div class="modal-header">
                <h3>Submit Tour Completion</h3>
                <button class="btn-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="completionForm" enctype="multipart/form-data">
                <div class="form-group">
                    <label>Completion Description *</label>
                    <textarea name="completion_description" required rows="4" 
                            placeholder="Describe your tour completion..."></textarea>
                </div>
                <div class="form-group">
                    <label>Location *</label>
                    <input type="text" name="completion_location" required 
                        placeholder="Where did you complete the tour?">
                </div>
                <div class="form-group">
                    <label>Completion Certificate/Image *</label>
                    <input type="file" name="completion_image" accept="image/*,.pdf" required>
                </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="btn btn-primary" onclick="window.app.processCompletionSubmission(${tourId})">Submit</button>
            </div>
            </div>
        `;
        
        modal.querySelector('.btn-close').onclick = () => modal.remove();
        document.body.appendChild(modal);
    }

    async processCompletionSubmission(tourId) {
        const form = document.getElementById('completionForm');
        const formData = new FormData(form);
        
        try {
            showNotification('Submitting tour completion...', 'info');
            
            const response = await fetch(`/api/tours/${tourId}/completion`, {
            method: 'PUT',
            body: formData
            });

            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            showNotification('Tour completion submitted successfully!', 'success');
            document.querySelector('.modal').remove();
            
            // Refresh data
            await this.loadTours();
            await this.loadAlerts();
            this.updateUI();

        } catch (error) {
            console.error('Error submitting completion:', error);
            showNotification('Error submitting completion: ' + error.message, 'error');
        }
    }

    // Tour verification (for admin)
    async verifyTourCompletion(tourId, status) {
        const comments = prompt(`Please provide verification comments for ${status}:`);
        
        try {
            const response = await fetch(`/api/tours/${tourId}/verify`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                verification_status: status,
                verification_comments: comments,
                verified_by: this.userId || 1
            })
            });

            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            showNotification(`Tour completion ${status} successfully!`, 'success');
            
            // Refresh data
            await this.loadTours();
            await this.loadAlerts();
            this.renderCompletionVerificationQueue();

        } catch (error) {
            console.error('Error verifying tour:', error);
            showNotification('Error verifying tour: ' + error.message, 'error');
        }
    }

    // Enhanced rendering methods
    renderMyApplications() {
        const tableBody = document.querySelector('#myApplicationsTable tbody');
        if (!tableBody) return;

        if (this.allApplications.length === 0) {
            tableBody.innerHTML = `
            <tr>
                <td colspan="11" class="text-center">
                <i class="fas fa-inbox"></i><br>
                No applications found. <a href="#" onclick="window.app.navigateTo('new-application')">Create your first application</a>
                </td>
            </tr>
            `;
            return;
        }

        tableBody.innerHTML = this.allApplications.map((application, index) => {
            const formatDate = (dateStr) => {
            if (!dateStr) return 'N/A';
            try {
                const date = new Date(dateStr);
                return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
            } catch (e) {
                return 'N/A';
            }
            };

            // Add tour info if application is approved
            const tourInfo = application.status === 'approved' && application.requestNo ? 
            `<br><small class="text-info">Tour: ${application.requestNo}</small>` : '';

            return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${application.applicationId || 'N/A'}</strong>${tourInfo}</td>
                <td><span class="application-type-badge ${application.type || 'unknown'}">${this.capitalize(application.type || 'Unknown')}</span></td>
                <td class="route-cell">
                <div><i class="fas fa-map-marker-alt start-icon"></i> ${application.origin || 'N/A'}</div>
                <div><i class="fas fa-arrow-down"></i></div>
                <div><i class="fas fa-map-marker-alt end-icon"></i> ${application.destination || 'N/A'}</div>
                </td>
                <td class="date-cell"><strong>${formatDate(application.fromDate)}</strong></td>
                <td class="date-cell"><strong>${formatDate(application.toDate)}</strong></td>
                <td><span class="priority-badge ${application.priority || 'medium'}">${this.capitalize(application.priority || 'Medium')}</span></td>
                <td><span class="status-badge ${application.status || 'unknown'}">${this.capitalize(application.status || 'Unknown')}</span></td>
                <td class="currently-with-cell"><strong>${application.currentlyWith || 'N/A'}</strong></td>
                <td class="date-cell"><strong>${formatDate(application.submittedDate)}</strong></td>
                <td class="action-buttons">
                <button class="btn btn-sm btn-info"><i class="fas fa-eye"></i> View</button>
                ${this.userRole === 'admin' && application.status === 'pending' ? `
                    <button class="btn btn-sm btn-success approve-btn" data-app-id="${application.id}">
                    <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-sm btn-danger reject-btn" data-app-id="${application.id}">
                    <i class="fas fa-times"></i> Reject
                    </button>
                ` : ''}
                </td>
            </tr>
            `;
        }).join('');
    }

    renderMyTours() {
        const tableBody = document.querySelector('#myToursTable tbody');
        if (!tableBody) {
            console.error('myToursTable tbody not found');
            return;
        }

        console.log('Rendering tours:', this.approvedTours.length, 'tours found');

        if (this.approvedTours.length === 0) {
            tableBody.innerHTML = `
            <tr>
                <td colspan="12" class="text-center">
                <i class="fas fa-route"></i><br>
                No tours found. Tours will appear here once your applications are approved.
                </td>
            </tr>
            `;
            return;
        }

        tableBody.innerHTML = this.approvedTours.map((tour, index) => {
            const formatDate = (dateStr) => {
                if (!dateStr) return 'N/A';
                try {
                    const date = new Date(dateStr);
                    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
                } catch (e) {
                    return 'N/A';
                }
            };

            const getCompletionButton = () => {
                switch (tour.completionStatus) {
                    case 'not-uploaded':
                    return tour.tourStatus === 'completed' ? 
                        `<button class="btn btn-sm btn-primary" onclick="window.app.submitTourCompletion(${tour.id})">
                        <i class="fas fa-upload"></i> Upload
                        </button>` :
                        `<span class="completion-status-badge not-uploaded">Not Available</span>`;
                    case 'pending':
                    return `<span class="completion-status-badge pending">Pending Review</span>`;
                    case 'verified':
                    return `<span class="completion-status-badge verified">✓ Verified</span>`;
                    case 'rejected':
                    return `<button class="btn btn-sm btn-warning" onclick="window.app.submitTourCompletion(${tour.id})">
                                <i class="fas fa-redo"></i> Re-upload
                            </button>`;
                    default:
                    return `<span class="completion-status-badge not-uploaded">Not Available</span>`;
                }
            };

            return `
            <tr>
                <td>${index + 1}</td>
                <td class="request-cell"><strong>${tour.requestNo || 'N/A'}</strong></td>
                <td class="route-cell"><strong>${tour.route || 'N/A'}</strong></td>
                <td class="date-cell"><strong>${formatDate(tour.fromDate)}</strong></td>
                <td class="date-cell"><strong>${formatDate(tour.toDate)}</strong></td>
                <td class="purpose-cell"><strong>${tour.purpose || 'N/A'}</strong></td>
                <td><span class="tour-status-badge ${tour.tourStatus || 'unknown'}">${this.capitalize(tour.tourStatus || 'Unknown')}</span></td>
                <td><span class="travel-status-badge ${tour.travelStatus || 'unknown'}">${this.capitalize(tour.travelStatus || 'Unknown')}</span></td>
                <td class="reports-cell"><button class="btn btn-sm btn-info"><i class="fas fa-file-alt"></i> Reports</button></td>
                <td class="ticket-status"><span class="ticket-badge ${tour.ticketsBooked ? 'booked' : 'not-booked'}">${tour.ticketsBooked ? '✓ Booked' : 'Not Booked'}</span></td>
                <td class="tour-completion-cell">${getCompletionButton()}</td>
                <td class="action-buttons"><button class="btn btn-sm btn-info"><i class="fas fa-eye"></i> View</button></td>
            </tr>
            `;
        }).join('');

        console.log('Tours table rendered successfully');
    }


    // Render completion verification queue for admin
    async renderCompletionVerificationQueue() {
        const container = document.querySelector('.completion-queue-container');
        if (!container) return;

        try {
            const response = await fetch('/api/tours/pending-verification');
            const pendingTours = await response.json();

            if (pendingTours.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                <i class="fas fa-clipboard-check"></i>
                <h3>No Pending Verifications</h3>
                <p>All tour completions have been processed.</p>
                </div>
            `;
            return;
            }

            container.innerHTML = pendingTours.map(tour => `
            <div class="completion-verification-item pending">
                <div class="completion-header">
                <div>
                    <h4>${tour.request_no} - ${tour.full_name}</h4>
                    <p class="text-muted">${tour.route} • ${tour.employee_id}</p>
                </div>
                <span class="status-badge pending">Pending Verification</span>
                </div>
                <div class="completion-body">
                ${tour.completion_image ? `
                    <div class="completion-image-section">
                    <img src="${tour.completion_image}" alt="Completion Certificate" 
                        class="completion-image" onclick="window.app.openImageModal('${tour.completion_image}')">
                    </div>
                ` : ''}
                <div class="completion-details">
                    <div class="detail-group">
                    <span class="detail-label">Description</span>
                    <span class="detail-value">${tour.completion_description || 'N/A'}</span>
                    </div>
                    <div class="detail-group">
                    <span class="detail-label">Location</span>
                    <span class="detail-value">${tour.completion_location || 'N/A'}</span>
                    </div>
                    <div class="detail-group">
                    <span class="detail-label">Submitted</span>
                    <span class="detail-value">${new Date(tour.submitted_at).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-group">
                    <span class="detail-label">Tour Period</span>
                    <span class="detail-value">${new Date(tour.from_date).toLocaleDateString()} - ${new Date(tour.to_date).toLocaleDateString()}</span>
                    </div>
                </div>
                </div>
                <div class="completion-actions">
                <button class="btn btn-success" onclick="window.app.verifyTourCompletion(${tour.id}, 'verified')">
                    <i class="fas fa-check"></i> Verify
                </button>
                <button class="btn btn-danger" onclick="window.app.verifyTourCompletion(${tour.id}, 'rejected')">
                    <i class="fas fa-times"></i> Reject
                </button>
                </div>
            </div>
            `).join('');

        } catch (error) {
            console.error('Error loading verification queue:', error);
            container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Data</h3>
                <p>Please refresh the page and try again.</p>
            </div>
            `;
        }
    }

    async loadTours() {
        try {
            const { employee_id } = this.loggedInUser || {};
            const response = await fetch(`/api/tours?employee_id=${encodeURIComponent(employee_id || '')}`);

            if (!response.ok) throw new Error(`Tours API error: ${response.status}`);
            
            const toursData = await response.json();
            console.log('Raw tours data from API:', toursData);
            
            // Map tours data to match your frontend structure
            this.approvedTours = toursData.map(tour => ({
            id: tour.id,
            requestNo: tour.request_no,
            route: tour.route,
            fromDate: tour.from_date,
            toDate: tour.to_date,
            purpose: tour.purpose,
            tourStatus: tour.tour_status,
            travelStatus: tour.travel_status,
            ticketsBooked: tour.tickets_booked,
            accommodationBooked: tour.accommodation_booked,
            transportArranged: tour.transport_arranged,
            completionStatus: tour.completion_status || 'not-uploaded',
            completionImage: tour.completion_image,
            completionImageName: tour.completion_image_name,
            completionDescription: tour.completion_description,
            completionLocation: tour.completion_location,
            verifiedBy: tour.verified_by,
            verifiedAt: tour.verified_at,
            submittedAt: tour.submitted_at,
            fullName: tour.full_name,
            employeeId: tour.employee_id,
            department: tour.department,
            applicationType: tour.application_type,
            priority: tour.priority,
            travelMode: tour.travel_mode
            }));
            
            console.log('Processed tours data:', this.approvedTours);
        } catch (error) {
            console.error('Error loading tours:', error);
            this.approvedTours = [];
        }
    }



    setupNewApplicationPage() {
        // Setup form submission
        const newApplicationForm = document.getElementById('newApplicationForm');
        if (newApplicationForm) {
            newApplicationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitNewApplication();
            });
        }

        // Setup event listener for district change
        const districtSelect = document.getElementById('districtDropdown');
        if (districtSelect) {
            districtSelect.addEventListener('change', (e) => {
                this.loadULBs(e.target.value);
                });
            }

        this.loadDistricts();

        // Setup auto-save functionality
        this.setupAutoSave();
        
        // Setup form progress tracking
        this.setupFormProgress();
        
        // Setup file upload
        this.setupFileUpload();
        
        // Setup cost calculator
        this.setupCostCalculator();
        
        // Pre-populate user data if available
        this.prePopulateUserData();
    }

    // Add this method to pre-populate user information
    prePopulateUserData() {
        const form = document.getElementById('newApplicationForm');
        if (!form) return;
        
        // Pre-populate with current user data
        const userData = {
            fullName: this.userName || 'Dr. DHARMENDRA SINGH YADAV',
            employeeId: 'EMP001',
            email: 'dharmendra.yadav@gov.in',
            department: 'it',
            designation: 'Deputy Director'
        };
        
        Object.keys(userData).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = userData[key];
            }
        });
    }

    // Add this method for form progress tracking
    // Replace your existing setupFormProgress method with this updated version
    setupFormProgress() {
        const form = document.getElementById('newApplicationForm');
        if (!form) return;
        
        // Check if progress indicator already exists
        let progressContainer = document.querySelector('.form-progress');
        
        // Only create if it doesn't exist
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.className = 'form-progress';
            progressContainer.innerHTML = `
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" id="formProgressBar"></div>
                </div>
                <div class="progress-text" id="formProgressText">Form completion: 0%</div>
            `;
            
            const newApplicationContent = document.querySelector('.new-application-content');
            if (newApplicationContent) {
                newApplicationContent.insertBefore(progressContainer, newApplicationContent.firstChild);
            }
        }
        
        // Track form completion
        const requiredFields = form.querySelectorAll('[required]');
        const updateProgress = () => {
            const filledFields = Array.from(requiredFields).filter(field => {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    return field.checked;
                }
                return field.value.trim() !== '';
            });
            
            const progress = Math.round((filledFields.length / requiredFields.length) * 100);
            const progressBar = document.getElementById('formProgressBar');
            const progressText = document.getElementById('formProgressText');
            
            if (progressBar) progressBar.style.width = progress + '%';
            if (progressText) progressText.textContent = `Form completion: ${progress}%`;
        };
        
        // Remove any existing event listeners to prevent duplicates
        const existingListeners = form._progressListeners || [];
        existingListeners.forEach(({ field, handler }) => {
            field.removeEventListener('input', handler);
            field.removeEventListener('change', handler);
        });
        
        // Add event listeners to track changes
        const newListeners = [];
        requiredFields.forEach(field => {
            const inputHandler = () => updateProgress();
            const changeHandler = () => updateProgress();
            
            field.addEventListener('input', inputHandler);
            field.addEventListener('change', changeHandler);
            
            // Store listeners for cleanup
            newListeners.push(
                { field, handler: inputHandler },
                { field, handler: changeHandler }
            );
        });
        
        // Store listeners on form for cleanup
        form._progressListeners = newListeners;
        
        // Initial progress check
        updateProgress();
    }


    async loadDistricts() {
        try {
            const res = await fetch('/api/ulb/districts');
            if (!res.ok) throw new Error('Failed to load districts');
            const districts = await res.json();
            
            const districtSelect = document.getElementById('districtDropdown');
            districtSelect.innerHTML = '<option value="">Select District</option>';
            districts.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.district_name;
                opt.textContent = d.district_name;
                districtSelect.appendChild(opt);
            });
        } catch (err) {
            console.error('Error loading districts:', err);
        }
    }

    async loadULBs(district) {
        if (!district) {
            document.getElementById('ulbDropdown').innerHTML =
                '<option value="">Select ULB</option>';
            return;
        }
        try {
            const res = await fetch(`/api/ulb/ulbs?district=${encodeURIComponent(district)}`);
            if (!res.ok) throw new Error('Failed to load ULBs');
            const ulbs = await res.json();
            
            const ulbSelect = document.getElementById('ulbDropdown');
            ulbSelect.innerHTML = '<option value="">Select ULB</option>';
            ulbs.forEach(u => {
                const opt = document.createElement('option');
                opt.value = u.ulb_name_en;
                opt.textContent = u.ulb_name_en;
                ulbSelect.appendChild(opt);
            });
        } catch (err) {
            console.error('Error loading ULBs:', err);
        }
    }


    // Add this method for auto-save functionality
    setupAutoSave() {
        const form = document.getElementById('newApplicationForm');
        if (!form) return;
        
        let autoSaveTimeout;
        const AUTOSAVE_DELAY = 3000; // 3 seconds
        
        const showAutoSaveIndicator = () => {
            let indicator = document.getElementById('autoSaveIndicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'autoSaveIndicator';
                indicator.className = 'auto-save-indicator';
                indicator.innerHTML = '<i class="fas fa-save"></i> Auto-saved';
                document.body.appendChild(indicator);
            }
            
            indicator.classList.add('visible');
            setTimeout(() => {
                indicator.classList.remove('visible');
            }, 2000);
        };
        
        const autoSave = () => {
            // Save form data to localStorage
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            localStorage.setItem('tour_application_draft', JSON.stringify({
                ...data,
                savedAt: new Date().toISOString()
            }));
            
            showAutoSaveIndicator();
        };
        
        // Add auto-save to all form inputs
        form.addEventListener('input', () => {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(autoSave, AUTOSAVE_DELAY);
        });
        
        // Load saved draft if available
        this.loadDraft();
    }

    // Add this method to load saved draft
    loadDraft() {
        const savedDraft = localStorage.getItem('tour_application_draft');
        if (!savedDraft) return;
        
        try {
            const data = JSON.parse(savedDraft);
            const form = document.getElementById('newApplicationForm');
            if (!form) return;
            
            // Populate form with saved data
            Object.keys(data).forEach(key => {
                if (key === 'savedAt') return;
                
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = input.value === data[key];
                    } else {
                        input.value = data[key];
                    }
                }
            });
            
            showNotification('Draft loaded from auto-save', 'info');
        } catch (error) {
            console.error('Error loading draft:', error);
        }
    }

    // Add this method to save draft manually
    saveDraft() {
        const form = document.getElementById('newApplicationForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem('tour_application_draft', JSON.stringify({
            ...data,
            savedAt: new Date().toISOString()
        }));
        
        showNotification('Application saved as draft successfully', 'success');
    }

    // Add this method to clear form
    clearForm() {
        if (confirm('Are you sure you want to clear all form data? Any unsaved changes will be lost.')) {
            const form = document.getElementById('newApplicationForm');
            if (form) {
                form.reset();
                localStorage.removeItem('tour_application_draft');
                this.prePopulateUserData();
                showNotification('Form cleared successfully', 'info');
            }
        }
    }

    renderMyApplications() {
        const tbody = document.querySelector('#myApplicationsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        this.allApplications.forEach((application, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div class="request-cell">
                        <strong>${application.applicationId}</strong><br>
                        <small>${application.requestNo || '-'}</small>
                    </div>
                </td>
                <td>
                    <span class="application-type-badge ${application.type}">
                        ${this.capitalize(application.type)}
                    </span>
                </td>
                <td>
                    <div class="route-cell">
                        <i class="fas fa-map-marker-alt start-icon"></i>
                        ${application.origin}<br>
                        <i class="fas fa-arrow-down"></i><br>
                        <i class="fas fa-map-marker-alt end-icon"></i>
                        ${application.destination}
                    </div>
                </td>
                <td>
                    <div class="date-cell">
                        <strong>${this.formatDate(application.fromDate)}</strong><br>
                        <small>${this.getDayOfWeek(application.fromDate)}</small>
                    </div>
                </td>
                <td>
                    <div class="date-cell">
                        <strong>${this.formatDate(application.toDate)}</strong><br>
                        <small>${this.getDayOfWeek(application.toDate)}</small>
                    </div>
                </td>
                <td>
                    <span class="priority-badge ${application.priority}">
                        ${this.capitalize(application.priority)}
                    </span>
                </td>
                <td>
                    <div class="status-cell">
                        <span class="status-badge ${application.status}">
                            <i class="fas fa-${this.getStatusIcon(application.status)}"></i>
                            ${this.capitalize(application.status)}
                        </span>
                    </div>
                </td>
                <td>
                    <div class="currently-with-cell">
                        <strong>${application.currentlyWith}</strong><br>
                        <small>Processing</small>
                    </div>
                </td>
                <td>
                    <div class="date-cell">
                        <strong>${this.formatDate(application.submittedDate)}</strong>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-sm" title="View Details" onclick="app.viewApplicationDetails('${application.applicationId}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${application.status === 'pending' || application.status === 'submitted' ? 
                            `<button class="btn btn-warning btn-sm" title="Edit" onclick="app.editApplication('${application.applicationId}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" title="Cancel" onclick="app.cancelApplication('${application.applicationId}')">
                                <i class="fas fa-times"></i>
                            </button>` : 
                            ''
                        }
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Update summary counts
        this.updateApplicationSummary();
    }

    renderMyTours() {
        const tbody = document.querySelector('#myToursTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        this.approvedTours.forEach((tour, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div class="request-cell">
                        <strong>${tour.requestNo}</strong>
                    </div>
                </td>
                <td>
                    <div class="route-cell">
                        ${tour.route}
                    </div>
                </td>
                <td>
                    <div class="date-cell">
                        <strong>${this.formatDate(tour.fromDate)}</strong><br>
                        <small>${this.getDayOfWeek(tour.fromDate)}</small>
                    </div>
                </td>
                <td>
                    <div class="date-cell">
                        <strong>${this.formatDate(tour.toDate)}</strong><br>
                        <small>${this.getDayOfWeek(tour.toDate)}</small>
                    </div>
                </td>
                <td>
                    <div class="purpose-cell">
                        <strong>${tour.purpose}</strong>
                    </div>
                </td>
                <td>
                    <span class="tour-status-badge ${tour.tourStatus}">
                        ${this.capitalize(tour.tourStatus)}
                    </span>
                </td>
                <td>
                    <span class="travel-status-badge ${tour.travelStatus}">
                        ${this.capitalize(tour.travelStatus.replace('-', ' '))}
                    </span>
                </td>
                <td>
                    <div class="reports-cell">
                        ${tour.tourStatus === 'completed' ? 
                            `<button class="btn btn-info btn-sm" onclick="app.downloadReport('${tour.requestNo}')" title="Download Report">
                                <i class="fas fa-download"></i>
                            </button>` : 
                            `<button class="btn btn-secondary btn-sm" disabled title="Not Available">
                                <i class="fas fa-file-alt"></i>
                            </button>`
                        }
                    </div>
                </td>
                <td>
                    <div class="ticket-status">
                        ${tour.ticketsBooked ? 
                            `<span class="ticket-badge booked">
                                <i class="fas fa-check"></i>
                                Booked
                            </span>` :
                            `<button class="btn btn-primary btn-sm" onclick="app.bookTicket('${tour.requestNo}')" title="Book Ticket">
                                <i class="fas fa-ticket-alt"></i>
                                Book
                            </button>`
                        }
                    </div>
                </td>
                <td>
                    ${this.renderCompletionCell(tour)}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-sm" title="View Details" onclick="app.viewTourDetails('${tour.requestNo}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${tour.tourStatus !== 'completed' ? 
                            `<button class="btn btn-warning btn-sm" title="Update Status" onclick="app.updateTourStatus('${tour.requestNo}')">
                                <i class="fas fa-edit"></i>
                            </button>` : 
                            ''
                        }
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Update tour summary counts
        this.updateTourSummary();

        // Setup completion upload handlers
        this.setupCompletionUploads();
    }

    // Render completion cell based on status
    renderCompletionCell(tour) {
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
                        <br><small class="text-info">Image submitted: ${this.formatDateTime(tour.submittedAt)}</small>
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

    // Setup completion upload handlers
    setupCompletionUploads() {
        document.querySelectorAll('.upload-completion-btn').forEach(button => {
            const fileInput = button.querySelector('input[type="file"]');
            if (fileInput) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    fileInput.click();
                });

                fileInput.addEventListener('change', (e) => {
                    if (e.target.files.length > 0) {
                        const tourId = button.dataset.tourId;
                        this.uploadCompletionImage(tourId, e.target.files[0]);
                    }
                });
            }
        });
    }

    // Upload completion image
    uploadCompletionImage(tourId, file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showNotification('Image too large. Maximum size is 5MB.', 'error');
            return;
        }

        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file.', 'error');
            return;
        }

        showNotification('Uploading geo-tagged completion image...', 'info');

        // Simulate file upload with FileReader
        const reader = new FileReader();
        reader.onload = (e) => {
            const tour = this.approvedTours.find(t => t.id == tourId);
            if (tour) {
                tour.completionImage = e.target.result;
                tour.completionImageName = file.name;
                tour.completionStatus = 'pending';
                tour.submittedAt = new Date().toISOString();

                setTimeout(() => {
                    showNotification('Geo-tagged image uploaded successfully! Awaiting admin verification.', 'success');
                    this.renderMyTours();
                }, 1500);
            }
        };
        reader.readAsDataURL(file);
    }

    renderApprovalQueue() {
        const container = document.getElementById('approvalQueueContainer');
        if (!container) return;

        container.innerHTML = '';

        // Filter applications that need approval
        const pendingApprovals = this.allApplications.filter(app => 
            app.status === 'submitted' || app.status === 'pending'
        );

        if (pendingApprovals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No Pending Approvals</h3>
                    <p>All applications have been processed.</p>
                </div>
            `;
            return;
        }

        pendingApprovals.forEach(application => {
            const approvalItem = document.createElement('div');
            approvalItem.className = 'approval-item';
            
            approvalItem.innerHTML = `
                <div class="approval-header">
                    <div>
                        <h4>Application: ${application.applicationId}</h4>
                        <p>${this.capitalize(application.type)} Tour - ${application.origin} → ${application.destination}</p>
                    </div>
                    <div class="priority-badge ${application.priority}">
                        ${this.capitalize(application.priority)} Priority
                    </div>
                </div>
                
                <div class="approval-body">
                    <div class="form-row">
                        <div class="form-group">
                            <strong>From Date:</strong> ${this.formatDate(application.fromDate)}
                        </div>
                        <div class="form-group">
                            <strong>To Date:</strong> ${this.formatDate(application.toDate)}
                        </div>
                    </div>
                    <div class="form-group">
                        <strong>Currently With:</strong> ${application.currentlyWith}
                    </div>
                    <div class="form-group">
                        <strong>Submitted:</strong> ${this.formatDate(application.submittedDate)}
                    </div>
                </div>
                
                <div class="approval-actions">
                    <button class="btn btn-success approve-btn" data-app-id="${application.applicationId}">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-danger reject-btn" data-app-id="${application.applicationId}">
                        <i class="fas fa-times"></i> Reject
                    </button>
                    <button class="btn btn-secondary" onclick="app.viewApplicationDetails('${application.applicationId}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            `;
            
            container.appendChild(approvalItem);
        });
    }

    // Render completion verification queue for admin
    renderCompletionVerificationQueue() {
        const container = document.getElementById('completionVerificationContainer');
        if (!container) return;

        container.innerHTML = '';

        const pendingCompletions = this.approvedTours.filter(tour => 
            tour.completionStatus === 'pending' || tour.completionStatus === 'verified' || tour.completionStatus === 'rejected'
        );

        if (pendingCompletions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-camera"></i>
                    <h3>No Completion Images</h3>
                    <p>No tour completion images have been submitted for verification.</p>
                </div>
            `;
            return;
        }

        pendingCompletions.forEach(tour => {
            const completionItem = document.createElement('div');
            completionItem.className = `completion-verification-item ${tour.completionStatus}`;
            
            completionItem.innerHTML = `
                <div class="completion-header">
                    <div>
                        <h4>Tour: ${tour.requestNo}</h4>
                        <p>${tour.route} • ${tour.purpose}</p>
                    </div>
                    <span class="completion-status-badge ${tour.completionStatus}">
                        ${this.capitalize(tour.completionStatus)}
                    </span>
                </div>
                
                <div class="completion-body">
                    <div class="completion-image-section">
                        <img src="${tour.completionImage}" 
                             alt="Tour completion image" 
                             class="completion-image"
                             onclick="app.showImageModal('${tour.completionImage}')">
                        <br><br>
                        <strong>File:</strong> ${tour.completionImageName}<br>
                        <strong>Submitted:</strong> ${this.formatDateTime(tour.submittedAt)}
                    </div>
                    
                    <div class="completion-details">
                        <div class="detail-group">
                            <span class="detail-label">Tour Dates</span>
                            <span class="detail-value">${this.formatDate(tour.fromDate)} - ${this.formatDate(tour.toDate)}</span>
                        </div>
                        <div class="detail-group">
                            <span class="detail-label">Purpose</span>
                            <span class="detail-value">${tour.purpose}</span>
                        </div>
                        <div class="detail-group">
                            <span class="detail-label">Route</span>
                            <span class="detail-value">${tour.route}</span>
                        </div>
                        <div class="detail-group">
                            <span class="detail-label">Current Status</span>
                            <span class="detail-value">${this.capitalize(tour.completionStatus)}</span>
                        </div>
                    </div>
                </div>
                
                ${tour.completionStatus === 'pending' ? `
                    <div class="completion-actions">
                        <button class="btn btn-danger" onclick="app.rejectCompletion('${tour.id}')">
                            <i class="fas fa-times"></i> Reject Verification
                        </button>
                        <button class="btn btn-success" onclick="app.verifyCompletion('${tour.id}')">
                            <i class="fas fa-check"></i> Mark as Verified
                        </button>
                    </div>
                ` : ''}
            `;
            
            container.appendChild(completionItem);
        });
    }

    // Verify completion
    verifyCompletion(tourId) {
        const tour = this.approvedTours.find(t => t.id == tourId);
        if (tour) {
            tour.completionStatus = 'verified';
            tour.tourStatus = 'completed';
            showNotification(`Tour ${tour.requestNo} completion verified successfully!`, 'success');
            this.renderCompletionVerificationQueue();
            if (this.currentPage === 'my-tours') {
                this.renderMyTours();
            }
        }
    }

    // Reject completion
    rejectCompletion(tourId) {
        if (confirm('Are you sure you want to reject this tour completion verification? The user will need to re-submit.')) {
            const tour = this.approvedTours.find(t => t.id == tourId);
            if (tour) {
                tour.completionStatus = 'rejected';
                showNotification(`Tour ${tour.requestNo} completion verification rejected.`, 'warning');
                this.renderCompletionVerificationQueue();
                if (this.currentPage === 'my-tours') {
                    this.renderMyTours();
                }
            }
        }
    }

    // Show image in modal
    showImageModal(imageSrc) {
        let modal = document.getElementById('imageModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'imageModal';
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="image-modal-content">
                    <button class="image-modal-close" onclick="app.closeImageModal()">&times;</button>
                    <img src="" alt="Full size image">
                </div>
            `;
            document.body.appendChild(modal);

            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeImageModal();
                }
            });
        }

        modal.querySelector('img').src = imageSrc;
        modal.classList.add('active');
    }

    // Close image modal
    closeImageModal() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Refresh completion queue
    refreshCompletionQueue() {
        showNotification('Refreshing completion verification queue...', 'info');
        setTimeout(() => {
            this.renderCompletionVerificationQueue();
            showNotification('Completion queue refreshed successfully', 'success');
        }, 1000);
    }

    updateApplicationSummary() {
        const pendingCount = this.allApplications.filter(app => app.status === 'pending' || app.status === 'submitted').length;
        const approvedCount = this.allApplications.filter(app => app.status === 'approved').length;
        const rejectedCount = this.allApplications.filter(app => app.status === 'rejected').length;

        const pendingElement = document.getElementById('pendingCount');
        const approvedElement = document.getElementById('approvedCount');
        const rejectedElement = document.getElementById('rejectedCount');

        if (pendingElement) pendingElement.textContent = pendingCount;
        if (approvedElement) approvedElement.textContent = approvedCount;
        if (rejectedElement) rejectedElement.textContent = rejectedCount;
    }

    updateTourSummary() {
        const ongoingCount = this.approvedTours.filter(tour => tour.tourStatus === 'ongoing').length;
        const upcomingCount = this.approvedTours.filter(tour => tour.tourStatus === 'upcoming').length;
        const completedCount = this.approvedTours.filter(tour => tour.tourStatus === 'completed').length;

        const ongoingElement = document.getElementById('ongoingToursCount');
        const upcomingElement = document.getElementById('upcomingToursCount');
        const completedElement = document.getElementById('completedToursCount');

        if (ongoingElement) ongoingElement.textContent = ongoingCount;
        if (upcomingElement) upcomingElement.textContent = upcomingCount;
        if (completedElement) completedElement.textContent = completedCount;
    }

    refreshMyTours() {
        showNotification('Refreshing tour data...', 'info');
        setTimeout(() => {
            this.renderMyTours();
            showNotification('Tour data refreshed successfully', 'success');
        }, 1000);
    }

    // Application management methods
    viewApplicationDetails(applicationId) {
        showNotification(`Viewing details for application ${applicationId}`, 'info');
    }

    editApplication(applicationId) {
        showNotification(`Editing application ${applicationId}`, 'info');
    }

    cancelApplication(applicationId) {
        if (confirm(`Are you sure you want to cancel application ${applicationId}?`)) {
            this.allApplications = this.allApplications.filter(app => app.applicationId !== applicationId);
            showNotification(`Application ${applicationId} cancelled successfully`, 'success');
            this.renderMyApplications();
        }
    }

    // Tour management methods
    viewTourDetails(requestNo) {
        showNotification(`Viewing details for tour ${requestNo}`, 'info');
    }

    updateTourStatus(requestNo) {
        showNotification(`Updating status for tour ${requestNo}`, 'info');
    }

    bookTicket(requestNo) {
        showNotification(`Booking ticket for tour ${requestNo}...`, 'info');
        setTimeout(() => {
            // Update the tour data
            const tour = this.approvedTours.find(t => t.requestNo === requestNo);
            if (tour) {
                tour.ticketsBooked = true;
            }
            this.renderMyTours();
            showNotification(`Ticket booked successfully for ${requestNo}`, 'success');
        }, 1500);
    }

    downloadReport(requestNo) {
        showNotification(`Downloading report for tour ${requestNo}...`, 'info');
        setTimeout(() => {
            showNotification(`Report downloaded successfully`, 'success');
        }, 1000);
    }

    // Approval methods
    approveApplication(applicationId) {
        const application = this.allApplications.find(app => app.applicationId === applicationId);
        if (application) {
            application.status = 'approved';
            application.currentlyWith = 'Travel Desk';
            showNotification(`Application ${applicationId} approved successfully`, 'success');
            this.renderApprovalQueue();
            this.renderMyApplications();
        }
    }

    rejectApplication(applicationId) {
        if (confirm('Are you sure you want to reject this application?')) {
            const application = this.allApplications.find(app => app.applicationId === applicationId);
            if (application) {
                application.status = 'rejected';
                application.currentlyWith = 'Completed';
                showNotification(`Application ${applicationId} rejected`, 'warning');
                this.renderApprovalQueue();
                this.renderMyApplications();
            }
        }
    }

    // Enhanced tour submission
    submitEnhancedTour() {
        const form = document.getElementById('enhancedTourForm');
        if (!form || !form.checkValidity()) {
            form?.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const applicationId = 'APP' + new Date().getFullYear() + String(Date.now()).slice(-6);
        
        const newApplication = {
            id: this.allApplications.length + 1,
            applicationId: applicationId,
            type: formData.get('tourType') || 'official',
            origin: formData.get('originStation'),
            destination: formData.get('destinationStation'),
            fromDate: formData.get('departureDate'),
            toDate: formData.get('arrivalDate'),
            priority: formData.get('priority') || 'medium',
            status: 'submitted',
            currentlyWith: 'Reporting Officer',
            submittedDate: new Date().toISOString().split('T')[0],
            requestNo: 'REQ' + new Date().getFullYear() + String(this.allApplications.length + 1).padStart(3, '0')
        };

        this.allApplications.push(newApplication);
        
        this.closeAllModals();
        form.reset();
        showNotification(`Application ${applicationId} submitted successfully!`, 'success');
        
        if (this.currentPage === 'my-applications') {
            this.renderMyApplications();
        }
    }

    submitRequest() {
        const form = document.getElementById('newRequestForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const applicationId = 'APP' + new Date().getFullYear() + String(Date.now()).slice(-6);
        const requestNo = 'REQ' + new Date().getFullYear() + String(this.allApplications.length + 1).padStart(3, '0');
        
        const newApplication = {
            id: this.allApplications.length + 1,
            applicationId: applicationId,
            type: 'official',
            origin: formData.get('origin'),
            destination: formData.get('destination'),
            fromDate: formData.get('fromDate'),
            toDate: formData.get('toDate'),
            priority: 'medium',
            status: 'submitted',
            currentlyWith: 'Reporting Officer',
            submittedDate: new Date().toISOString().split('T')[0],
            requestNo: requestNo
        };

        this.allApplications.push(newApplication);
        
        this.closeAllModals();
        form.reset();
        showNotification(`Quick request ${requestNo} submitted successfully`, 'success');
        
        if (this.currentPage === 'my-applications') {
            this.renderMyApplications();
        }
    }

    // Search functionality
    setupTableSearch() {
        const applicationsSearch = document.getElementById('applicationsSearch');
        if (applicationsSearch) {
            applicationsSearch.addEventListener('input', (e) => {
                this.filterTable('myApplicationsTable', e.target.value);
            });
        }
        
        const myToursSearch = document.getElementById('myToursSearch');
        if (myToursSearch) {
            myToursSearch.addEventListener('input', (e) => {
                this.filterTable('myToursTable', e.target.value);
            });
        }

        // Status filters
        const applicationStatusFilter = document.getElementById('applicationStatusFilter');
        if (applicationStatusFilter) {
            applicationStatusFilter.addEventListener('change', (e) => {
                this.filterApplicationsByStatus(e.target.value);
            });
        }

        const tourTypeFilter = document.getElementById('tourTypeFilter');
        if (tourTypeFilter) {
            tourTypeFilter.addEventListener('change', (e) => {
                this.filterToursByType(e.target.value);
            });
        }

        // Completion filter
        const completionFilter = document.getElementById('completionFilter');
        if (completionFilter) {
            completionFilter.addEventListener('change', (e) => {
                this.filterCompletionsByStatus(e.target.value);
            });
        }
    }

    filterTable(tableId, searchTerm) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const rows = table.querySelectorAll('tbody tr');
        const term = searchTerm.toLowerCase();
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(term)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    filterApplicationsByStatus(status) {
        const rows = document.querySelectorAll('#myApplicationsTable tbody tr');
        rows.forEach(row => {
            if (!status || row.querySelector('.status-badge').classList.contains(status)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    filterToursByType(type) {
        const rows = document.querySelectorAll('#myToursTable tbody tr');
        rows.forEach(row => {
            if (!type || row.querySelector('.tour-status-badge').classList.contains(type)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    filterCompletionsByStatus(status) {
        const items = document.querySelectorAll('.completion-verification-item');
        items.forEach(item => {
            if (!status || item.classList.contains(status)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // File upload and cost calculator
    setupFileUpload() {
        const fileUploadArea = document.querySelector('.file-upload-area');
        const fileInput = fileUploadArea?.querySelector('input[type="file"]');
        
        if (!fileUploadArea || !fileInput) return;

        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('dragover');
        });

        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.classList.remove('dragover');
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            this.handleFileUpload(files);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });
    }

    handleFileUpload(files) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
        
        Array.from(files).forEach(file => {
            if (file.size > maxSize) {
                showNotification(`File ${file.name} is too large. Maximum size is 5MB.`, 'error');
                return;
            }
            
            if (!allowedTypes.includes(file.type)) {
                showNotification(`File ${file.name} has unsupported format.`, 'error');
                return;
            }
            
            showNotification(`File ${file.name} uploaded successfully.`, 'success');
        });
    }

    setupCostCalculator() {
        const travelCostInput = document.querySelector('input[name="travelCost"]');
        const accommodationCostInput = document.querySelector('input[name="accommodationCost"]');
        const miscCostInput = document.querySelector('input[name="miscCost"]');
        const estimatedCostInput = document.querySelector('input[name="estimatedCost"]');
        
        const calculateTotal = () => {
            const travel = parseFloat(travelCostInput?.value || 0);
            const accommodation = parseFloat(accommodationCostInput?.value || 0);
            const misc = parseFloat(miscCostInput?.value || 0);
            const total = travel + accommodation + misc;
            
            if (estimatedCostInput) {
                estimatedCostInput.value = total;
            }
        };

        [travelCostInput, accommodationCostInput, miscCostInput].forEach(input => {
            if (input) {
                input.addEventListener('input', calculateTotal);
            }
        });
    }

    // Modal management
    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    saveTour() {
        const form = document.getElementById('createTourForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        this.closeAllModals();
        form.reset();
        showNotification('Tour created successfully', 'success');
    }

    changeSettingPanel(setting) {
        const activePanel = document.querySelector('.setting-panel.active');
        if (activePanel) activePanel.classList.remove('active');
        
        const newPanel = document.getElementById(setting + '-settings');
        if (newPanel) newPanel.classList.add('active');
    }

    filterAlerts(filter) {
        const alerts = document.querySelectorAll('.alert-card');
        alerts.forEach(alert => {
            if (filter === 'all' || alert.classList.contains(filter)) {
                alert.style.display = 'flex';
            } else {
                alert.style.display = 'none';
            }
        });
    }

    exportData(format) {
        showNotification(`Exporting data as ${format.toUpperCase()}...`, 'info');
        
        setTimeout(() => {
            showNotification(`Data exported successfully as ${format.toUpperCase()}`, 'success');
        }, 1500);
    }

    updateStats() {
        // Update user dashboard stats
        if (this.currentPage === 'user-dashboard') {
            const pendingCount = this.allApplications.filter(r => r.status === 'pending' || r.status === 'submitted').length;
            const statsCards = document.querySelectorAll('#user-dashboard .stat-card h3');
            if (statsCards.length >= 1) {
                statsCards[0].textContent = pendingCount;
            }
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            document.body.classList.remove('app-visible');
            document.body.classList.remove('admin-role');
            document.body.classList.remove('user-role');
            document.getElementById('loginPage').style.display = 'flex';
            document.getElementById('loginForm').reset();
            showNotification('Logged out successfully', 'info');
        }
    }

    setupMobileMenu() {
        if (window.innerWidth <= 768) {
            const existingToggle = document.querySelector('.nav-toggle');
            if (existingToggle) existingToggle.remove();

            const navToggle = document.createElement('button');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            navToggle.className = 'nav-toggle';
            navToggle.style.cssText = `
                position: fixed;
                top: 90px;
                left: 15px;
                background: #007bff;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 5px;
                z-index: 1200;
                cursor: pointer;
                display: ${document.body.classList.contains('app-visible') ? 'block' : 'none'};
            `;
            
            document.body.appendChild(navToggle);
            
            navToggle.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('active');
            });
        }
    }

    // Utility methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getDayOfWeek(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long'
        });
    }

    capitalize(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).replace('-', ' ');
    }

    getStatusIcon(status) {
        const icons = {
            'approved': 'check-circle',
            'pending': 'hourglass-half',
            'submitted': 'paper-plane',
            'rejected': 'ban',
            'in-review': 'eye'
        };
        return icons[status] || 'question-circle';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize login first
    initLogin();
    
    // Initialize main app
    window.app = new MasterTourPro();
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.app) {
        window.app.setupMobileMenu();
    }
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        if (window.app) {
            window.app.closeAllModals();
        }
    }
});

// Handle escape key for closing modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (window.app) {
            window.app.closeAllModals();
        }
    }
});

// Example: Handling new application form submission
document.getElementById('applicationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form); // gathers all inputs
    const employeeId = CURRENT_EMPLOYEE_ID; // however you store this after login


    try {
        // Disable submit button to prevent double submit
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Send to backend
        const response = await fetch('/api/applications', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to create application.');
        }

        const newApp = await response.json();
        console.log('Application created successfully:', newApp);

        // ✅ Only now update the UI
        addApplicationToUI(newApp);

        // Optionally refresh the "My Applications" list from server
        await loadMyApplications(employeeId);

        // Reset form
        form.reset();

    } catch (err) {
        console.error('Application submission error:', err);
        alert('Error submitting application: ' + err.message);
    } finally {
        // Re-enable button
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
    }
});

// Helper to load applications from API
async function loadMyApplications(employeeId) {
    try {
        const res = await fetch(`/api/applications?employee_id=${encodeURIComponent(employeeId)}`);
        const data = await res.json();
        renderApplicationsList(data); // your function to refresh the list in the UI
    } catch (err) {
        console.error('Error loading applications:', err);
    }
}

// Helper to append one new application to the UI
function addApplicationToUI(app) {
    const list = document.getElementById('applicationsList');
    const item = document.createElement('li');
    item.textContent = `${app.application_id} - ${app.type} - ${app.status}`;
    list.prepend(item);
}

