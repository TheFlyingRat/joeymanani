import { sleep, getDateDifference } from './utils';
import { preloadAllAudio } from './audio';
import { playShellAnimation, playTypingAnimation } from './animations';

// Calculate birthday difference
const date = new Date();
const difference = getDateDifference(date);
const dateString = date.toUTCString();

// Update all time-since-birthday elements
const timeSinceBirthdayElements = document.getElementsByClassName('time-since-birthday');
for (let i = 0; i < timeSinceBirthdayElements.length; i++) {
  timeSinceBirthdayElements[i].textContent = `${difference.years}.${difference.months}.${difference.days}`;
}

// Update current date
const currentDateEl = document.getElementById('current-date');
if (currentDateEl) currentDateEl.textContent = dateString;

// Bottom button click handlers
document.getElementById('contact')?.parentElement?.addEventListener('click', () => {
  window.location.href = 'mailto:contact@joeymanani.com';
});
document.getElementById('links')?.parentElement?.addEventListener('click', () => {
  document.location.href = 'https://tfrs.link/links';
});
document.getElementById('skip-button')?.parentElement?.addEventListener('click', () => {
  document.location.href = '/home';
});

// Main animation sequence
window.onload = async () => {
  document.body.style.opacity = '1';
  preloadAllAudio();

  // Press any key to skip
  document.onkeypress = () => {
    window.location.href = '/home';
  };

  await sleep(2250);
  await playShellAnimation();
  await sleep(400);
  await playTypingAnimation();
};
