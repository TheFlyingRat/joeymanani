import { playSound } from './audio';

let charsTyped = 0;
let typingPaused = false;

export async function type(
  id: string,
  text: string,
  speed: number
): Promise<void> {
  const typingCursor = document.getElementById('typing-cursor');
  const textPlaceholder = document.getElementById(id);
  if (!textPlaceholder || !typingCursor) return;

  return new Promise((resolve) => {
    charsTyped = 0;
    const intervalId = setInterval(function () {
      if (!typingPaused && charsTyped < text.length) {
        typingCursor.classList.remove('typing-cursor-animation');
        if (text.charAt(charsTyped) === '\n') {
          typingPaused = true;
          typingCursor.classList.add('typing-cursor-animation');
          setTimeout(() => {
            playSound('enter');
            typingCursor.classList.remove('typing-cursor-animation');
            textPlaceholder.appendChild(document.createElement('br'));
            charsTyped++;
            typingPaused = false;
          }, 1000);
        } else {
          playSound('button');
          textPlaceholder.appendChild(
            document.createTextNode(text.charAt(charsTyped))
          );
          charsTyped++;
        }
      } else if (charsTyped === text.length) {
        clearInterval(intervalId);
        typingCursor.classList.add('typing-cursor-animation');
        resolve();
      }
    }, speed);
  });
}
