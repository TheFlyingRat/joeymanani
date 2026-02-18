import { sleep, getDateDifference } from './utils';
import { preloadAllAudio, playSound } from './audio';

preloadAllAudio();

const elementIds = [
  'shell', 'menu', 'looking', 'output', 'find', 'errorDesc', 'errorMsg',
  'prompt', 'menuWrapper', 'menuDescription', 'menuMessage', 'menuResolution',
  'optionBack', 'optionHome',
] as const;

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const pathName = window.location.pathname.substring(1);
const href = window.location.href;
const currentURL = document.getElementsByClassName('currentURL');

const elements: Record<string, HTMLElement | null> = {};
elementIds.forEach((id) => {
  elements[id] = document.getElementById(id);
});

async function animate() {
  await sleep(2800);
  elements.looking?.classList.remove('typing-cursor-animation');
  elements.output?.classList.remove('hidden');

  await sleep(2000);
  elements.find?.classList.remove('hidden');
  elements.prompt?.classList.remove('hidden');

  await sleep(1500);
  elements.shell?.classList.add('hidden');
  elements.menuWrapper?.classList.remove('hidden');
}

function handleErrorCode(errorCode: string | null) {
  const errorMessages: Record<string, { errorMsg: string; errorDesc: string; desc: string; message: string; resolution: string }> = {
    '404': {
      errorMsg: 'No such file or directory',
      errorDesc: 'could not find',
      desc: 'The application encountered a 404 error (No such file or directory)',
      message: 'This means the file either no longer exists or the URL is incorrect!',
      resolution: 'Use your keyboard or mouse to select an option!',
    },
    '403': {
      errorMsg: 'Permission denied',
      errorDesc: 'had no permission for',
      desc: 'The application encountered a 403 error (Permission denied)',
      message: 'You do not have sufficient permissions to access this resource!',
      resolution: 'Contact the administrator for proper access or authentication!',
    },
    '400': {
      errorMsg: 'Syntax error',
      errorDesc: 'could not interpret',
      desc: 'The application encountered a 400 error (Syntax error)',
      message: 'There is an issue with the provided syntax or format!',
      resolution: 'Check the input data or syntax and try again!',
    },
    '401': {
      errorMsg: 'Permission denied',
      errorDesc: 'had no permission for',
      desc: 'The application encountered a 401 error (Permission denied)',
      message: 'You are unauthorized to access this resource!',
      resolution: 'Provide proper credentials or contact the administrator for access!',
    },
    '500': {
      errorMsg: 'Application error',
      errorDesc: 'could not understand',
      desc: 'The application encountered a 500 error (Application error)',
      message: 'An internal server error occurred!',
      resolution: 'Please try again later or contact the administrator for assistance!',
    },
  };

  const err = (errorCode && errorMessages[errorCode]) || errorMessages['404'];

  if (elements.errorMsg) elements.errorMsg.textContent = err.errorMsg;
  if (elements.errorDesc) elements.errorDesc.textContent = err.errorDesc;
  if (elements.menuDescription) elements.menuDescription.textContent = err.desc;
  if (elements.menuMessage) elements.menuMessage.textContent = err.message;
  if (elements.menuResolution) elements.menuResolution.textContent = err.resolution;
}

// Birthday calculation
const date = new Date();
const difference = getDateDifference(date);
const dateString = date.toUTCString();

const timeSinceBirthdayElements = document.getElementsByClassName('time-since-birthday');
Array.from(timeSinceBirthdayElements).forEach((elem) => {
  elem.textContent = `${difference.years}.${difference.months}.${difference.days}`;
});

const currentDateEl = document.getElementById('current-date');
if (currentDateEl) currentDateEl.textContent = dateString;

const pathNameEl = document.getElementById('pathName');
if (pathNameEl) pathNameEl.textContent = pathName;

Array.from(currentURL).forEach((elem) => {
  elem.textContent = href;
});

// Option navigation
let selection = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    selectOption(0);
  }
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    selectOption(1);
  }
  if (e.key === 'Enter') {
    e.preventDefault();
    executeOption(selection);
  }
  if (e.key === 'Tab') {
    e.preventDefault();
    selection = selection === 1 ? 0 : 1;
    playSound('click');
    selectOption(selection);
  }
});

const optionBack = elements.optionBack;
const optionHome = elements.optionHome;

optionBack?.addEventListener('mouseover', () => selectOption(0));
optionHome?.addEventListener('mouseover', () => selectOption(1));
optionBack?.addEventListener('click', () => executeOption(0));
optionHome?.addEventListener('click', () => executeOption(1));

function selectOption(optionCode: number) {
  if (optionCode !== selection) {
    playSound('click');
  }
  if (optionCode === 0) {
    selection = 0;
    optionBack?.classList.add('selected');
    optionHome?.classList.remove('selected');
  }
  if (optionCode === 1) {
    selection = 1;
    optionHome?.classList.add('selected');
    optionBack?.classList.remove('selected');
  }
}

function executeOption(optionCode: number) {
  if (optionCode === 0) {
    history.back();
  }
  if (optionCode === 1) {
    window.location.href = '/home';
  }
}

// FOUC reveal + init
document.body.style.opacity = '1';
animate();
handleErrorCode(code);
