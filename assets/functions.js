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

// Play a sound when the button is selected or hovered
function playSound(sound) {
    if (!audioThread1.paused) {
        audioThread2.src = '/assets/' + sound + '.wav';
        audioThread2.play();
        console.log("T2: Played.")
    } else {
        audioThread1.src = '/assets/' + sound + '.wav';
        audioThread1.play();
        console.log("T1: Played.")
    }
}

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}