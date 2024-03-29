// Get the links from the page
const links = document.querySelectorAll('.content a');

// Current link index that the mouse is at (0,1,2,3 thus 4 links)
let currentLinkIndex = 0;

// theflyingrat/joeymanani #11 - Fix bug when sound effect still plays when page fades out (use a flag)
let audioEnabled = true;

// Listen for a keydown event
document.addEventListener('keydown', event => {
    // If down arrow pressed
    if (event.key === 'ArrowDown') {
        // Do this stuff, self explanatory
        // Prevent arrow keys scrolling down the page (default behavior) 
        event.preventDefault();
        audioEnabled ? playSound("click") : null;
        hideArrow(links[currentLinkIndex]);
        currentLinkIndex = (currentLinkIndex + 1) % links.length;
        showArrow(links[currentLinkIndex]);
    } else if (event.key === 'ArrowUp' || (event.shiftKey && event.key === 'Tab')) {
        // If arrow up or Shift+Tab is pressed, go backwards
        event.preventDefault();
        audioEnabled ? playSound("click") : null;
        hideArrow(links[currentLinkIndex]);
        currentLinkIndex = (currentLinkIndex - 1 + links.length) % links.length;
        showArrow(links[currentLinkIndex]);
    } else if (event.key === 'Tab') {
        event.preventDefault();
        audioEnabled ? playSound("click") : null;
        hideArrow(links[currentLinkIndex]);
        currentLinkIndex = (currentLinkIndex + 1) % links.length;
        showArrow(links[currentLinkIndex]);
    } else if (event.key === 'Enter') {
        // However if enter was pressed, redirect to the highlighted link
        event.preventDefault();
        audioEnabled ? playSound("success") : null;
        audioEnabled = false;
        document.getElementById("body-container").style.opacity = 0;
        setTimeout(() => {
            window.location.href = links[currentLinkIndex].href;
        }, 1800);
    }
});

// Do this stuff for each of the links
links.forEach((link, index) => {
    // Listens for a mouse click
    link.addEventListener('click', event => {
        // Just to be safe, preventDefault
        event.preventDefault();
        // Self explanatory
        hideArrow(links[currentLinkIndex]);
        currentLinkIndex = index;
        showArrow(links[currentLinkIndex]);
        audioEnabled ? playSound("success") : null;
        audioEnabled = false;
        document.getElementById("body-container").style.opacity = 0;
        setTimeout(() => {
            window.location.href = link.href;
        }, 1800);
    });
    // Listens for the mouse to go over it
    link.addEventListener('mouseover', event => {
        // Self explanatory
        if (currentLinkIndex !== index) {
            audioEnabled ? playSound("click") : null;
        }
        hideArrow(links[currentLinkIndex]);
        currentLinkIndex = index;
        showArrow(links[currentLinkIndex]);
    });
});

// Hide the nav arrow
function hideArrow(link) {
    link.querySelector('i').style.opacity = 0;
    link.classList.remove('current');
}

// Reveal the nav arrow (wow)
function showArrow(link) {
    link.querySelector('i').style.opacity = 1;
    link.classList.add('current');
}

// Bouncy title animation thingy preparation (splitting it into spans)
const name = document.getElementById("name");
let text = name.innerHTML;
name.innerHTML = "";
for (let i = 0; i < text.length; i++) {
  if (text[i] == " ") {
    let letter = document.createElement("span");
    letter.innerHTML = "&nbsp;";
    name.appendChild(letter);
    continue;
  }
  let letter = document.createElement("span");
  letter.innerHTML = text[i];
  name.appendChild(letter);
}