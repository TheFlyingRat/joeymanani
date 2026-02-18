import clickUrl from '../assets/audio/click.mp3';
import successUrl from '../assets/audio/success.mp3';
import alertUrl from '../assets/audio/alert.mp3';
import enterUrl from '../assets/audio/enter.mp3';
import backspaceUrl from '../assets/audio/backspace.mp3';
import buttonUrl from '../assets/audio/button.mp3';

const soundUrls: Record<string, string> = {
  click: clickUrl,
  success: successUrl,
  alert: alertUrl,
  enter: enterUrl,
  backspace: backspaceUrl,
  button: buttonUrl,
};

const audioThread1 = new Audio();
const audioThread2 = new Audio();
const audioCache: Record<string, string> = {};

function base64ToBlob(base64Data: string): Blob {
  const parts = base64Data.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const byteCharacters = atob(parts[1]);
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
}

async function fetchAudioData(sound: string): Promise<void> {
  try {
    const response = await fetch(soundUrls[sound]);
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const reader = new FileReader();

    reader.onload = function () {
      const base64Data = reader.result as string;
      audioCache[sound] = URL.createObjectURL(blob);
      localStorage.setItem(sound, base64Data);
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.log('Error fetching audio data: ' + error);
  }
}

async function preloadAudio(sound: string): Promise<void> {
  try {
    if (audioCache[sound]) return;

    const base64Data = localStorage.getItem(sound);
    if (base64Data) {
      const blob = base64ToBlob(base64Data);
      audioCache[sound] = URL.createObjectURL(blob);
    } else {
      await fetchAudioData(sound);
    }
  } catch (error) {
    console.log('Error preloading audio: ' + error);
  }
}

export async function preloadAllAudio(): Promise<void> {
  const sounds = ['click', 'success', 'alert', 'enter', 'backspace', 'button'];
  await Promise.all(sounds.map((sound) => preloadAudio(sound)));
}

export function playSound(sound: string): void {
  try {
    if (audioCache[sound]) {
      const audioElement = audioThread1.paused ? audioThread1 : audioThread2;
      audioElement.src = audioCache[sound];
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(function () {
          console.log("User didn't interact with document!");
        });
      }
    } else {
      console.log(`Audio data for ${sound} not found in cache.`);
    }
  } catch (error) {
    console.log("Couldn't play sound because of an error: " + error);
  }
}
