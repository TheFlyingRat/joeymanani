import { preloadAllAudio, playSound } from './audio';

preloadAllAudio();

const backBtn = document.getElementById('backBtn') as HTMLAnchorElement;
const forwardBtn = document.getElementById('forwardBtn') as HTMLAnchorElement;

let selectedBtn = backBtn;
let selectedClass = 'backBtn';
let audioEnabled = true;

document.addEventListener('keydown', handleKeydown);
document.addEventListener('keydown', handleEnterKey);
document.getElementsByClassName('logo')[0]?.addEventListener('click', handleGoHome);
backBtn.addEventListener('mouseover', handleMouseover);
forwardBtn.addEventListener('mouseover', handleMouseover);
backBtn.addEventListener('click', handleClick);
forwardBtn.addEventListener('click', handleClick);

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowLeft':
      if (selectedClass === 'forwardBtn') {
        toggleSelection(backBtn);
      }
      break;
    case 'ArrowRight':
      if (selectedClass === 'backBtn') {
        toggleSelection(forwardBtn);
      }
      break;
  }
}

function handleEnterKey(event: KeyboardEvent) {
  if (event.key === 'Enter' && selectedBtn.classList.contains('current')) {
    if (audioEnabled) playSound('success');
    audioEnabled = false;
    document.getElementById('body-container')!.style.opacity = '0';
    setTimeout(() => {
      window.location.href = selectedBtn.href;
    }, 1800);
  }
}

function handleClick(event: Event) {
  event.preventDefault();
  if (audioEnabled) playSound('success');
  audioEnabled = false;
  document.getElementById('body-container')!.style.opacity = '0';
  setTimeout(() => {
    window.location.href = selectedBtn.href;
  }, 1800);
}

function handleMouseover(event: Event) {
  toggleSelection(event.target as HTMLAnchorElement);
}

function handleGoHome() {
  window.location.href = '/home';
}

function toggleSelection(newSelectedBtn: HTMLAnchorElement) {
  if (selectedBtn !== newSelectedBtn) {
    if (audioEnabled) playSound('click');
  }
  selectedBtn.classList.remove('current');
  selectedBtn = newSelectedBtn;
  selectedClass = selectedBtn.id;
  selectedBtn.classList.add('current');
}

// FOUC reveal
window.onload = () => {
  document.getElementById('body-container')!.style.opacity = '1';
};
