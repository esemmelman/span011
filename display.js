// Use the usable CSS viewport for layout; monitor scaling is reflected in its size.
function updateDisplay() {
  const viewport = window.visualViewport;
  const width = Math.round(viewport?.width || window.innerWidth);
  const height = Math.round(viewport?.height || window.innerHeight);
  const scale = window.devicePixelRatio || 1;
  const root = document.documentElement;
  root.dataset.display = width < 420 || height < 500 ? 'tight' : width < 700 || height < 750 ? 'compact' : 'standard';
  root.dataset.screenResolution = `${Math.round(screen.width * scale)}x${Math.round(screen.height * scale)}`;
  root.dataset.screenScale = scale.toFixed(2);
  root.style.setProperty('--word-font-size', `${Math.round(Math.max(14, Math.min(width / 23, height / 26, 46)))}px`);
  root.style.setProperty('--question-font-size', `${Math.round(Math.max(22, Math.min(width / 23, height / 11, 56)))}px`);
  root.style.setProperty('--feedback-font-size', `${Math.round(Math.max(20, Math.min(width / 30, height / 16, 38)))}px`);
  root.style.setProperty('--column-title-size', `${Math.round(Math.max(13, Math.min(width / 45, height / 28, 26)))}px`);
  root.style.setProperty('--action-font-size', `${Math.round(Math.max(17, Math.min(width / 45, height / 26, 32)))}px`);
  window.dispatchEvent(new Event('displaychange'));
}

updateDisplay();
window.addEventListener('resize', updateDisplay);
window.visualViewport?.addEventListener('resize', updateDisplay);
