// settings.js
export function changeSettingPanel(settingKey) {
  document.querySelectorAll('.setting-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === settingKey + '-settings');
  });
}

export function initUpdateFrequencySlider() {
  const slider = document.getElementById('updateFrequency');
  if (!slider) return;
  const sliderValue = slider.parentNode.querySelector('.slider-value');
  slider.addEventListener('input', () => {
    sliderValue.textContent = slider.value + ' seconds';
  });
}
