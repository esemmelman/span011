function fitSelectWidth(select) {
  const style = getComputedStyle(select);
  const context = document.createElement('canvas').getContext('2d');
  if (!context) return;
  context.font = style.font;
  const textWidth = Math.max(...[...select.options].map(option => context.measureText(option.textContent).width));
  const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  const arrowSpace = parseFloat(style.fontSize) * 1.1;
  select.style.width = `${Math.ceil(textWidth + padding + arrowSpace + 8)}px`;
}

function fitAllSelects() {
  document.querySelectorAll('select').forEach(fitSelectWidth);
}

window.addEventListener('displaychange', fitAllSelects);
document.fonts?.ready.then(fitAllSelects);
