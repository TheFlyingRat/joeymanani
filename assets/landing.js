function getDateDifference(date) {
    const targetDate = new Date(1148169600000);
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

// Create a new data object, get its difference between my birthday and convert it to human readable
const date = new Date();
const difference = getDateDifference(date);
const dateString = date.toUTCString();

// Get each elem of my birthday string and the string where the human readable date is required
const timeSinceBirthdayString = document.getElementsByClassName("time-since-birthday"); // Could use querySelector
const currentDateString = document.getElementById("current-date");

// Change the current date string to the current date human readable
currentDateString.innerHTML = dateString;

// Update each elem which calculates how long its been since my birthday with my birthday
for (let i = 0; i < timeSinceBirthdayString.length; i++) {
    timeSinceBirthdayString[i].innerHTML = `${difference.years}.${difference.months}.${difference.days}`;
}


// Bottom button click handlers (moved from inline onclick)
document.getElementById("contact").parentElement.addEventListener("click", function () {
    window.location.href = "mailto:contact@joeymanani.com";
});
document.getElementById("links").parentElement.addEventListener("click", function () {
    document.location.href = "https://tfrs.link/links";
});
document.getElementById("skip-button").parentElement.addEventListener("click", function () {
    document.location.href = "/home";
});

window.onload = async () => {
    document.getElementsByTagName("body")[0].style.opacity = 1;
    // Executes on body load
    console.log("Finished loading.")
    // Press any key to skip animations declaration. Must be when page is loaded to prevent user redirect while page still loading
    document.onkeypress = (event) => {
        console.log("Skipping animation since key was pressed!!")
        window.location.href = "/home";
    };
    await sleep(2250);
    console.log('Commencing animations!')
    await playShellAnimation();
    await sleep(400);
    await playTypingAnimation();
}

