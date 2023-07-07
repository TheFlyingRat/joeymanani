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

// In-memory cache for the audio files
const audioCache = {};

// Preload the audio files into memory cache
async function preloadAudio(sound) {
  try {
    const response = await fetch("https://cdn.theflyingrat.com/assets/joeymanani/assets/" + sound + ".wav");
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    audioCache[sound] = url;
  } catch (error) {
    console.log("Error preloading audio: " + error);
    }
}

// Preload all the audio files when the page loads
window.addEventListener("load", function() {
    preloadAudio("click");
    preloadAudio("success");
    preloadAudio("alert");
    preloadAudio("enter");
    preloadAudio("backspace");
    preloadAudio("button");
});

// Play a sound from the in-memory cache
function playSound(sound) {
    try {
        var playPromise;
        if (audioThread1.paused) {
            audioThread1.src = audioCache[sound];
            playPromise = audioThread1.play();
        } else {
            audioThread2.src = audioCache[sound];
            playPromise = audioThread2.play();
        }

        if (playPromise !== undefined) {
            playPromise.catch(function(error) {
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