// Get the links from the page
const links = document.querySelectorAll('.content a');

// Current link index that the mouse is at (0,1,2,3 thus 4 links)
let currentLinkIndex = 0;

// Listen for a keydown event
document.addEventListener('keydown', event => {
    // Prevent arrow keys scrolling down the page (default behavior) 
    event.preventDefault();
    // If down arrow pressed
    if (event.key === 'ArrowDown') {
        // Do this stuff, self explanatory
        playSound("click");
        hideArrow(links[currentLinkIndex]);
        currentLinkIndex = (currentLinkIndex + 1) % links.length;
        showArrow(links[currentLinkIndex]);
    } else if (event.key === 'ArrowUp' || (event.shiftKey && event.key === 'Tab')) {
        // If arrow up or Shift+Tab is pressed, go backwards
        playSound("click");
        hideArrow(links[currentLinkIndex]);
        currentLinkIndex = (currentLinkIndex - 1 + links.length) % links.length;
        showArrow(links[currentLinkIndex]);
    } else if (event.key === 'Tab') {
        playSound("click");
        hideArrow(links[currentLinkIndex]);
        currentLinkIndex = (currentLinkIndex + 1) % links.length;
        showArrow(links[currentLinkIndex]);
    } else if (event.key === 'Enter') {
        // However if enter was pressed, redirect to the highlighted link
        playSound("success");
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
        // Prevent arrow keys scrolling down the page (default behavior)
        event.preventDefault();
        // Self explanatory
        hideArrow(links[currentLinkIndex]);
        currentLinkIndex = index;
        showArrow(links[currentLinkIndex]);
        playSound("success");
        document.getElementById("body-container").style.opacity = 0;
        setTimeout(() => {
            window.location.href = link.href;
        }, 1800);
    });
    // Listens for the mouse to go over it
    link.addEventListener('mouseover', event => {
        // Self explanatory
        hideArrow(links[currentLinkIndex]);
        currentLinkIndex = index;
        showArrow(links[currentLinkIndex]);
        playSound("click");
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