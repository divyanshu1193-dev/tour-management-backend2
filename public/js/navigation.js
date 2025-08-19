/**
 * navigation.js
 * Handles switching between app pages and applying active nav styles.
 * Updated to work with modular component system.
 */

export function initNavigation(appInstance) {
  // Navigation is now handled by TourManager using event delegation
  // This function is kept for compatibility but navigation listeners
  // are handled in TourManager.setupGlobalEventListeners()
  console.log('Navigation system initialized - using event delegation');
}

export async function navigateToPage(page) {
  // Update navigation active state
  const activeNav = document.querySelector('.nav-item.active');
  if (activeNav) activeNav.classList.remove('active');
  const newNav = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (newNav) newNav.classList.add('active');

  // Load the page component using componentLoader
  if (window.componentLoader) {
    const userRole = localStorage.getItem('userRole') || 'user';
    await window.componentLoader.loadPage(page, userRole);
  } else {
    console.error('ComponentLoader not available');
  }
}

// Helper function to check if user has access to a page
export function hasPageAccess(page, userRole) {
  const adminOnlyPages = ['dashboard', 'tours', 'locations', 'users', 'approval-queue'];
  const userOnlyPages = ['user-dashboard', 'new-application', 'my-applications', 'my-tours'];
  
  if (adminOnlyPages.includes(page) && userRole !== 'admin') {
    return false;
  }
  
  if (userOnlyPages.includes(page) && userRole !== 'user') {
    return false;
  }
  
  return true;
}

// Function to show/hide navigation items based on user role
export function updateNavigationForRole(userRole) {
  console.log(`Updating navigation for role: ${userRole}`);
  
  const adminItems = document.querySelectorAll('.nav-item.admin-only');
  const userItems = document.querySelectorAll('.nav-item.user-only');
  
  console.log(`Found ${adminItems.length} admin items and ${userItems.length} user items`);
  
  if (userRole === 'admin') {
    adminItems.forEach(item => {
      item.style.display = 'block';
      console.log('Showing admin item:', item.textContent.trim());
    });
    userItems.forEach(item => {
      item.style.display = 'none';
      console.log('Hiding user item:', item.textContent.trim());
    });
  } else {
    adminItems.forEach(item => {
      item.style.display = 'none';
      console.log('Hiding admin item:', item.textContent.trim());
    });
    userItems.forEach(item => {
      item.style.display = 'block';
      console.log('Showing user item:', item.textContent.trim());
    });
  }
}
