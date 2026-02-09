const elementIds = [
    "shell",
    "menu",
    "looking",
    "output",
    "find",
    "errorDesc",
    "errorMsg",
    "prompt",
    "menuWrapper",
    "menuDescription",
    "menuMessage",
    "menuResolution",
    "optionBack",
    "optionHome"
];

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const pathName = window.location.pathname.substring(1);
const href = window.location.href;
const currentURL = document.getElementsByClassName("currentURL");

// Element ID mapping
const elements = {};
elementIds.forEach((id) => {
    elements[id] = document.getElementById(id);
});

async function animate() {
    await sleep(2800);

    elements.looking.classList.remove("typing-cursor-animation");
    elements.output.classList.remove("hidden");

    await sleep(2000);

    elements.find.classList.remove("hidden");
    elements.prompt.classList.remove("hidden");

    await sleep(1500);

    elements.shell.classList.add("hidden");
    elements.menuWrapper.classList.remove("hidden");
}

function handleErrorCode(code) {
    const errorMessages = {
        "404": {
        errorMsg: "No such file or directory",
        errorDesc: "could not find",
        desc: "The application encountered a 404 error (No such file or directory)",
        message: "This means the file either no longer exists or the URL is incorrect!",
        resolution: "Use your keyboard or mouse to select an option!"
        },
        "403": {
        errorMsg: "Permission denied",
        errorDesc: "had no permission for",
        desc: "The application encountered a 403 error (Permission denied)",
        message: "You do not have sufficient permissions to access this resource!",
        resolution: "Contact the administrator for proper access or authentication!"
        },
        "400": {
        errorMsg: "Syntax error",
        errorDesc: "could not interpret",
        desc: "The application encountered a 400 error (Syntax error)",
        message: "There is an issue with the provided syntax or format!",
        resolution: "Check the input data or syntax and try again!"
        },
        "401": {
        errorMsg: "Permission denied",
        errorDesc: "had no permission for",
        desc: "The application encountered a 401 error (Permission denied)",
        message: "You are unauthorized to access this resource!",
        resolution: "Provide proper credentials or contact the administrator for access!"
        },
        "500": {
        errorMsg: "Application error",
        errorDesc: "could not understand",
        desc: "The application encountered a 500 error (Application error)",
        message: "An internal server error occurred!",
        resolution: "Please try again later or contact the administrator for assistance!"
        }
    };

    const errorCode = errorMessages[code] || {};

    elements.errorMsg.textContent = errorCode.errorMsg || "No such file or directory";
    elements.errorDesc.textContent = errorCode.errorDesc || "could not find";
    elements.menuDescription.textContent = errorCode.desc || "The application encountered a 404 error (No such file or directory)";
    elements.menuMessage.textContent = errorCode.message || "This means the file either no longer exists or the URL is incorrect!";
    elements.menuResolution.textContent = errorCode.resolution || "Use your keyboard or mouse to select an option!";
}

function getDateDifference(date) {
const targetDate = new Date(1148169600000);
let diffTime = date - targetDate;
let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
let diffMonths = 0;
let diffYears = 0;

while (diffDays >= 365) {
    let year = new Date(targetDate.getFullYear() + diffYears + 1, 0, 0).getTime() - new Date(targetDate.getFullYear() + diffYears, 0, 0).getTime();
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
const timeSinceBirthdayStrings = document.getElementsByClassName("time-since-birthday");
const currentDateString = document.getElementById("current-date");

// Change the current date string to the current date human readable
currentDateString.textContent = dateString;

// Update each elem which calculates how long its been since my birthday with my birthday
Array.from(timeSinceBirthdayStrings).forEach((elem) => {
elem.textContent = `${difference.years}.${difference.months}.${difference.days}`;
});

document.getElementById("pathName").textContent = pathName;

Array.from(currentURL).forEach((elem) => {
elem.textContent = href;
});

let selection = 0;

document.addEventListener("keydown", (e) => {
if (e.key === "ArrowLeft") {
    e.preventDefault();
    selectOption(0);
}
if (e.key === "ArrowRight") {
    e.preventDefault();
    selectOption(1);
}
if (e.key === "Enter") {
    e.preventDefault();
    executeOption(selection);
}
if (e.key === "Tab") {
    e.preventDefault();
    selection = selection === 1 ? 0 : 1; // Select the other option
    playSound("click"); // Since selection gets overridden, sound wont play - so manually play it.
    selectOption(selection);
}
});

const optionBack = elements.optionBack;
const optionHome = elements.optionHome;

optionBack.addEventListener("mouseover", () => {
selectOption(0);
});

optionHome.addEventListener("mouseover", () => {
selectOption(1);
});

optionBack.addEventListener("click", () => {
executeOption(0);
});

optionHome.addEventListener("click", () => {
executeOption(1);
});

function selectOption(optionCode) {
if (optionCode !== selection) {
    playSound("click");
}
if (optionCode === 0) {
    selection = 0;
    optionBack.classList.add("selected");
    optionHome.classList.remove("selected");
}
if (optionCode === 1) {
    selection = 1;
    optionHome.classList.add("selected");
    optionBack.classList.remove("selected");
}
}

function executeOption(optionCode) {
if (optionCode === 0) {
    history.back();
}
if (optionCode === 1) {
    window.location.href = "/home";
}
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded.");

    animate();
    handleErrorCode(code);
});
