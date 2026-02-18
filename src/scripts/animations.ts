import { sleep } from './utils';
import { playSound } from './audio';
import { type } from './typing';

export async function playShellAnimation(): Promise<void> {
  const shellResp = document.getElementById('shell-response');
  const shellWrapper = document.getElementById('shell');
  const headingWrapper = document.getElementById('heading');
  if (!shellResp || !shellWrapper || !headingWrapper) return;

  const messages = [
    '[INFO] Loading joeymanani.com...',
    '[INFO] Initializing assets...',
    '[INFO] Opening program...',
  ];

  await type('shell-placeholder', 'joey --load', 82);
  await sleep(180);
  playSound('enter');
  await sleep(740);
  const shellCursor = document.getElementById('shell-cursor');
  if (shellCursor) shellCursor.textContent = '';
  for (const [index, message] of messages.entries()) {
    playSound('alert');
    shellResp.appendChild(document.createElement('br'));
    shellResp.appendChild(document.createTextNode(message));
    await sleep(index === 0 ? 550 : 1100);
  }
  shellWrapper.classList.add('hidden');
  headingWrapper.classList.remove('hidden');
}

export async function playTypingAnimation(
  quotesPromise: Promise<unknown[] | null>,
): Promise<void> {
  const fallbackQuotes = [
    '"The best way to predict the future is to create it."\n - Peter F. Drucker',
    '"Stay hungry, stay foolish."\n - Steve Jobs',
    '"Be yourself; everyone else is already taken."\n - Oscar Wilde',
  ];

  let quotes = fallbackQuotes;
  const data = await quotesPromise;
  if (Array.isArray(data) && data.length > 0) quotes = data;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  await type('title-placeholder', quotes[randomIndex], 78);
  await sleep(550);

  document.location.href = '/home';
}
