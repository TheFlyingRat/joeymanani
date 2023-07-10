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

// Check if user is a desktop user theflyingrat/joeymanani #9
function isDesktopUser() {
  // Feature detection: Check for touch support
  var isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints);

  // Responsive design technique: Check viewport width
  var isViewportWideEnough = window.innerWidth >= 1024;

  // Laptop check: Check if device is not a touchscreen laptop
  var isLaptop = window.matchMedia('(hover: hover)').matches || window.matchMedia('(hover: none)').matches;

  // Check for smaller laptop screens
  var isSmallLaptop = window.innerWidth < 1024 && window.innerHeight < 768;

  // Return true if any of the desktop conditions are met
  if (!isTouchDevice && isViewportWideEnough && (isLaptop || isSmallLaptop)) {
    return true;
  }

  // Assume as mobile user if unable to determine
  return false;
}

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Audio object
const audioThread1 = new Audio();
const audioThread2 = new Audio();

// In-memory cache for the audio files
const audioCache = {};

// Preload the audio files into memory cache and create Blob URLs
async function preloadAudio(sound) {
  try {
    if (audioCache[sound]) {
      // Audio data already exists in cache
      return;
    }

    const base64Data = localStorage.getItem(sound);
    if (base64Data) {
      const blob = base64ToBlob(base64Data);
      audioCache[sound] = URL.createObjectURL(blob); // Create Blob URL
    } else {
      console.log(`Audio data for ${sound} not found in localStorage.`);
      await fetchAudioData(sound); // Fetch the missing audio data
    }
  } catch (error) {
    console.log("Error preloading audio: " + error);
  }
}

// Fetch the audio data from the server
async function fetchAudioData(sound) {
  try {
    const response = await fetch("https://cdn.theflyingrat.com/assets/joeymanani/assets/" + sound + ".mp3");
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
    const reader = new FileReader();

    reader.onload = function () {
      const base64Data = reader.result;
      audioCache[sound] = URL.createObjectURL(blob); // Create Blob URL
      localStorage.setItem(sound, base64Data); // Store in localStorage
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.log("Error fetching audio data: " + error);
  }
}

// Preload all the audio files when the page loads
window.addEventListener("load", function() {
  const sounds = ["click", "success", "alert", "enter", "backspace", "button"];
  sounds.forEach((sound) => {
    preloadAudio(sound);
  });
});
// The above could be migrated to a main.js file 


// Play a sound from the in-memory cache
function playSound(sound) {
  try {
    if (audioCache[sound]) {
      const audioElement = audioThread1.paused ? audioThread1 : audioThread2;
      audioElement.src = audioCache[sound];
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(function(error) {
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

// Helper function to convert base64 to Blob
function base64ToBlob(base64Data) {
  const parts = base64Data.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const byteCharacters = atob(parts[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}
