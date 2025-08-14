/**
 * navigation.js
 * Handles switching between app pages and applying active nav styles.
 */
export function initNavigation(appInstance) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      appInstance.navigateTo(item.dataset.page);
    });
  });
}

export function navigateToPage(page) {
  const activeNav = document.querySelector('.nav-item.active');
  if (activeNav) activeNav.classList.remove('active');
  const newNav = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (newNav) newNav.classList.add('active');

  const activePage = document.querySelector('.page.active');
  if (activePage) activePage.classList.remove('active');
  const newPage = document.getElementById(page);
  if (newPage) newPage.classList.add('active');
}
