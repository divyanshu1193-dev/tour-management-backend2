// public/js/main.js

import { initLogin } from './auth.js';
import { TourManager } from './TourManager.js';

const app = new TourManager();
window.app = app;

document.addEventListener('DOMContentLoaded', () => {
  initLogin(app);
});

