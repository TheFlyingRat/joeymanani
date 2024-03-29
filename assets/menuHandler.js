// Get the two buttons
const backBtn = document.getElementById("backBtn");
const forwardBtn = document.getElementById("forwardBtn");

// Variables to keep track of the current selected button
let selectedBtn = backBtn;
let selectedClass = "backBtn";

// theflyingrat/joeymanani #11 - prevent audio playing when the button is clicked (use a flag)
let audioEnabled = true;

// Add event listeners for keydown and mouseover
document.addEventListener("keydown", handleKeydown);
document.addEventListener("keydown", handleEnterKey);
document.getElementsByClassName("logo")[0].addEventListener("click", handleGoHome);
backBtn.addEventListener("mouseover", handleMouseover);
forwardBtn.addEventListener("mouseover", handleMouseover);
backBtn.addEventListener("click", handleClick);
forwardBtn.addEventListener("click", handleClick);

// Handle keydown event
function handleKeydown(event) {
    switch (event.keyCode) {
        case 37: // left arrow key
            if (selectedClass === "forwardBtn") {
                toggleSelection(backBtn);
            }
            break;
        case 39: // right arrow key
            if (selectedClass === "backBtn") {
                toggleSelection(forwardBtn);
            }
            break;
    }
}

// Handle enter key press
function handleEnterKey(event) {
    if (event.keyCode === 13 && selectedBtn.classList.contains("current")) {
        audioEnabled ? playSound("success") : null;
        audioEnabled = false;
        document.getElementById("body-container").style.opacity = 0;
        setTimeout(() => {
            window.location.href = selectedBtn.href;
        }, 1800);
    }
}

// Handle click event (same as above just no if check)
function handleClick(event) {
    event.preventDefault();
    audioEnabled ? playSound("success") : null;
    audioEnabled = false;
    document.getElementById("body-container").style.opacity = 0;
    setTimeout(() => {
        window.location.href = selectedBtn.href;
    }, 1800);
}

// Handle mouseover event
function handleMouseover(event) {
    toggleSelection(event.target);
}

// Handle user clicking logo
function handleGoHome(event) {
    window.location.href = "/home";
}

// Toggle selection of the two buttons
function toggleSelection(newSelectedBtn) {
    if (selectedBtn !== newSelectedBtn) {
        audioEnabled ? playSound("click") : null; // only play sound if they button selection is different
    }
    selectedBtn.classList.remove("current");
    selectedBtn = newSelectedBtn;
    selectedClass = selectedBtn.id;
    selectedBtn.classList.add("current");
}
