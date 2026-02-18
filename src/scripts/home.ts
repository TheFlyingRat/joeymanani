import { preloadAllAudio, playSound } from './audio';

preloadAllAudio();

const links = document.querySelectorAll<HTMLAnchorElement>('.content a');
let currentLinkIndex = 0;
let audioEnabled = true;

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (audioEnabled) playSound('click');
    hideArrow(links[currentLinkIndex]);
    currentLinkIndex = (currentLinkIndex + 1) % links.length;
    showArrow(links[currentLinkIndex]);
  } else if (event.key === 'ArrowUp' || (event.shiftKey && event.key === 'Tab')) {
    event.preventDefault();
    if (audioEnabled) playSound('click');
    hideArrow(links[currentLinkIndex]);
    currentLinkIndex = (currentLinkIndex - 1 + links.length) % links.length;
    showArrow(links[currentLinkIndex]);
  } else if (event.key === 'Tab') {
    event.preventDefault();
    if (audioEnabled) playSound('click');
    hideArrow(links[currentLinkIndex]);
    currentLinkIndex = (currentLinkIndex + 1) % links.length;
    showArrow(links[currentLinkIndex]);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if (audioEnabled) playSound('success');
    audioEnabled = false;
    document.getElementById('body-container')!.style.opacity = '0';
    setTimeout(() => {
      window.location.href = links[currentLinkIndex].href;
    }, 1800);
  }
});

links.forEach((link, index) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    hideArrow(links[currentLinkIndex]);
    currentLinkIndex = index;
    showArrow(links[currentLinkIndex]);
    if (audioEnabled) playSound('success');
    audioEnabled = false;
    document.getElementById('body-container')!.style.opacity = '0';
    setTimeout(() => {
      window.location.href = link.href;
    }, 1800);
  });
  link.addEventListener('mouseover', () => {
    if (currentLinkIndex !== index) {
      if (audioEnabled) playSound('click');
    }
    hideArrow(links[currentLinkIndex]);
    currentLinkIndex = index;
    showArrow(links[currentLinkIndex]);
  });
});

function hideArrow(link: HTMLAnchorElement) {
  const icon = link.querySelector('i');
  if (icon) (icon as HTMLElement).style.opacity = '0';
  link.classList.remove('current');
}

function showArrow(link: HTMLAnchorElement) {
  const icon = link.querySelector('i');
  if (icon) (icon as HTMLElement).style.opacity = '1';
  link.classList.add('current');
}

// Split title into spans for hover animation
const nameEl = document.getElementById('name');
if (nameEl) {
  const text = nameEl.textContent || '';
  nameEl.textContent = '';
  for (let i = 0; i < text.length; i++) {
    const letter = document.createElement('span');
    if (text[i] === ' ') {
      letter.textContent = '\u00A0'; // non-breaking space
    } else {
      letter.textContent = text[i];
    }
    nameEl.appendChild(letter);
  }
}

// FOUC reveal
window.onload = () => {
  document.getElementById('body-container')!.style.opacity = '1';
};
