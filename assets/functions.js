function getDateDifference(date) {
    const targetDate = new Date("21 May, 2006");
    let diffTime = date - targetDate;
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    let diffMonths = 0;
    let diffYears = 0;

    while (diffDays >= 365) {
        let year = (new Date(targetDate.getFullYear() + diffYears + 1, 0, 0)).getTime() - (new Date(targetDate.getFullYear() + diffYears, 0, 0)).getTime();
        let daysInYear = Math.floor(year / (1000 * 60 * 60 * 24));
        if (diffDays >= daysInYear) {
        diffYears++;
        diffDays -= daysInYear;
        } else {
        break;
        }
    }

    while (diffDays >= 30) {
        let month = new Date(targetDate.getFullYear() + diffYears, targetDate.getMonth() + diffMonths + 1, 0).getDate();
        if (diffDays >= month) {
        diffMonths++;
        diffDays -= month;
        } else {
        break;
        }
    }

    return {
        days: diffDays,
        months: diffMonths,
        years: diffYears
    };
}

// Audio object
const audioThread1 = new Audio();
const audioThread2 = new Audio();

// Preload the audio files into memory cache and store them in local storage
async function preloadAudio(sound) {
  try {
    const response = await fetch("https://cdn.theflyingrat.com/assets/joeymanani/assets/" + sound + ".wav");
    const arrayBuffer = await response.arrayBuffer();
    const base64Data = arrayBufferToBase64(arrayBuffer);
    localStorage.setItem(sound, base64Data);
  } catch (error) {
    console.log("Error preloading audio: " + error);
  }
}

// Convert an ArrayBuffer to a Base64 string
function arrayBufferToBase64(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert a Base64 string to an ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Preload all the audio files when the JS executes
const audioFiles = ["click", "success", "alert", "enter", "backspace", "button"];
audioFiles.forEach(sound => {
  const cachedAudio = localStorage.getItem(sound);
  if (!cachedAudio) {
    preloadAudio(sound);
  }
});

// Create Blob URLs for audio files
const audioBlobURLs = {};
audioFiles.forEach(sound => {
  const base64Data = localStorage.getItem(sound);
  const arrayBuffer = base64ToArrayBuffer(base64Data);
  const audioBlob = new Blob([arrayBuffer], { type: "audio/wav" });
  audioBlobURLs[sound] = URL.createObjectURL(audioBlob);
});

// Play a sound from the in-memory cache
function playSound(sound) {
  try {
    var playPromise;
    if (audioThread1.paused) {
      audioThread1.src = audioBlobURLs[sound];
      playPromise = audioThread1.play();
    } else {
      audioThread2.src = audioBlobURLs[sound];
      playPromise = audioThread2.play();
    }

    if (playPromise !== undefined) {
      playPromise.catch(function (error) {
        console.log("User didn't interact. Can't play sound!");
      });
    }
  } catch (error) {
    console.log("Couldn't play sound because of error: " + error);
  }
}

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}