const studyKey = 'span011-study-until-v1';
const studyButton = document.querySelector('#study-timer');
const lockedControls = new Map();
let studyUntil = 0;
let intervalId = null;

try { studyUntil = Number(sessionStorage.getItem(studyKey)) || 0; } catch { /* Timer still works on this page. */ }

const countdown = document.createElement('output');
countdown.className = 'study-countdown';
countdown.setAttribute('role', 'timer');
countdown.setAttribute('aria-label', 'Study time remaining');
countdown.hidden = true;
document.body.append(countdown);

function setStudyLock(active) {
  document.documentElement.dataset.studyActive = String(active);
  if (active) {
    document.querySelectorAll('button, select, a').forEach(control => {
      if (!lockedControls.has(control)) {
        lockedControls.set(control, {
          disabled: 'disabled' in control ? control.disabled : null,
          tabIndex: control.getAttribute('tabindex'),
          ariaDisabled: control.getAttribute('aria-disabled')
        });
      }
      if ('disabled' in control) control.disabled = true;
      else { control.tabIndex = -1; control.setAttribute('aria-disabled', 'true'); }
    });
  } else {
    lockedControls.forEach((state, control) => {
      if (state.disabled !== null) control.disabled = state.disabled;
      if (state.tabIndex === null) control.removeAttribute('tabindex');
      else control.setAttribute('tabindex', state.tabIndex);
      if (state.ariaDisabled === null) control.removeAttribute('aria-disabled');
      else control.setAttribute('aria-disabled', state.ariaDisabled);
    });
    lockedControls.clear();
  }
}

function updateStudyTimer() {
  const remaining = Math.max(0, Math.ceil((studyUntil - Date.now()) / 1000));
  const active = remaining > 0;
  countdown.hidden = !active;
  if (active) countdown.textContent = `0:${String(remaining).padStart(2, '0')}`;
  setStudyLock(active);
  if (!active) {
    if (intervalId !== null) clearInterval(intervalId);
    intervalId = null;
    if (studyUntil) {
      studyUntil = 0;
      try { sessionStorage.removeItem(studyKey); } catch { /* No stored timer. */ }
    }
  }
}

function startStudyTimer() {
  studyUntil = Date.now() + 45_000;
  try { sessionStorage.setItem(studyKey, String(studyUntil)); } catch { /* Keep this page's timer. */ }
  updateStudyTimer();
  if (intervalId === null) intervalId = setInterval(updateStudyTimer, 250);
}

document.addEventListener('click', event => {
  if (studyUntil > Date.now() && event.target.closest('button, select, a')) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);
document.addEventListener('submit', event => {
  if (studyUntil > Date.now()) event.preventDefault();
}, true);
document.addEventListener('visibilitychange', updateStudyTimer);
window.addEventListener('pageshow', updateStudyTimer);
new MutationObserver(() => {
  if (studyUntil > Date.now()) setStudyLock(true);
}).observe(document.body, { childList: true, subtree: true });
studyButton?.addEventListener('click', startStudyTimer);
updateStudyTimer();
if (studyUntil > Date.now()) intervalId = setInterval(updateStudyTimer, 250);
