/**
 * Component Loader - Handles dynamic loading of HTML components
 */

class ComponentLoader {
    constructor() {
        this.cache = new Map();
        this.loadedComponents = new Set();
    }

    /**
     * Load a component from a partial file
     * @param {string} componentPath - Path to the component file
     * @param {string} containerId - ID of the container to load the component into
     * @param {boolean} cache - Whether to cache the component (default: true)
     */
    async loadComponent(componentPath, containerId, cache = true) {
        try {
            console.log(`Loading component: ${componentPath} into ${containerId}`);
            let html;
            
            // Check cache first
            if (cache && this.cache.has(componentPath)) {
                console.log(`Using cached version of ${componentPath}`);
                html = this.cache.get(componentPath);
            } else {
                console.log(`Fetching ${componentPath} from server`);
                const response = await fetch(componentPath);
                if (!response.ok) {
                    throw new Error(`Failed to load component: ${componentPath} (Status: ${response.status})`);
                }
                html = await response.text();
                console.log(`Successfully fetched ${componentPath}, length: ${html.length}`);
                
                // Cache the component if requested
                if (cache) {
                    this.cache.set(componentPath, html);
                }
            }

            // Insert the HTML into the container
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = html;
                this.loadedComponents.add(componentPath);
                console.log(`Component ${componentPath} loaded successfully into ${containerId}`);
                
                // Dispatch custom event for component loaded
                document.dispatchEvent(new CustomEvent('componentLoaded', {
                    detail: { componentPath, containerId }
                }));
            } else {
                console.error(`Container with ID '${containerId}' not found`);
                throw new Error(`Container with ID '${containerId}' not found`);
            }
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
            throw error;
        }
    }

    /**
     * Load multiple components
     * @param {Array} components - Array of {path, containerId} objects
     */
    async loadComponents(components) {
        const promises = components.map(({ path, containerId, cache = true }) => 
            this.loadComponent(path, containerId, cache)
        );
        await Promise.all(promises);
    }

    /**
     * Load a page component into the main content area
     * @param {string} pageName - Name of the page (e.g., 'dashboard', 'user-dashboard')
     * @param {string} userRole - User role ('admin' or 'user')
     */
    async loadPage(pageName, userRole = 'user') {
        console.log(`Loading page: ${pageName} for role: ${userRole}`);
        
        const pageMap = {
            'dashboard': 'partials/admin/dashboard.html',
            'user-dashboard': 'partials/user/dashboard.html',
            'new-application': 'partials/user/new-application.html',
            'my-applications': 'partials/user/my-applications.html',
            'my-tours': 'partials/user/my-tours.html',
            'tours': 'partials/admin/tours.html',
            'locations': 'partials/admin/locations.html',
            'users': 'partials/admin/users.html',
            'approval-queue': 'partials/admin/approval-queue.html',
            'reports': 'partials/reports.html',
            'alerts': 'partials/alerts.html',
            'settings': 'partials/settings.html'
        };

        const pagePath = pageMap[pageName];
        if (pagePath) {
            console.log(`Loading component from: ${pagePath}`);
            await this.loadComponent(pagePath, 'main-content', false);
            
            // Add active class to the loaded page
            setTimeout(() => {
                const pageElement = document.getElementById(pageName);
                if (pageElement) {
                    // Remove active class from all pages
                    document.querySelectorAll('.page.active').forEach(p => p.classList.remove('active'));
                    // Add active class to current page
                    pageElement.classList.add('active');
                    console.log(`Added active class to page: ${pageName}`);
                } else {
                    console.warn(`Page element with ID '${pageName}' not found`);
                }
            }, 50);
            
            // Update active navigation
            this.updateActiveNavigation(pageName);
            console.log(`Page ${pageName} loaded successfully`);
        } else {
            console.error(`Page '${pageName}' not found in pageMap`);
        }
    }

    /**
     * Update active navigation item
     * @param {string} pageName - Name of the active page
     */
    updateActiveNavigation(pageName) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current page nav item
        const activeNavItem = document.querySelector(`[data-page="${pageName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }

    /**
     * Load modal component
     * @param {string} modalName - Name of the modal
     */
    async loadModal(modalName) {
        const modalPath = `partials/modals/${modalName}.html`;
        await this.loadComponent(modalPath, 'modals-container', true);
    }

    /**
     * Initialize the application by loading core components
     */
    async initialize() {
        try {
            // Load core components
            await this.loadComponents([
                { path: 'partials/header.html', containerId: 'header-container' },
                { path: 'partials/login.html', containerId: 'login-container' },
                { path: 'partials/sidebar.html', containerId: 'sidebar-container' }
            ]);

            // Load common modals
            await this.loadComponents([
                { path: 'partials/modals/enhanced-tour-modal.html', containerId: 'modals-container' },
                { path: 'partials/modals/create-tour-modal.html', containerId: 'modals-container' },
                { path: 'partials/modals/quick-request-modal.html', containerId: 'modals-container' },
                { path: 'partials/modals/application-details-modal.html', containerId: 'modals-container' }
            ]);

            // Don't load default page here - let the auth system handle it
            console.log('Application components loaded successfully');
        } catch (error) {
            console.error('Error initializing components:', error);
        }
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        this.loadedComponents.clear();
    }
}

// Create global instance
window.componentLoader = new ComponentLoader();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.componentLoader.initialize();
});

export default ComponentLoader;