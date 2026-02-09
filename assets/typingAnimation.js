var charsTyped = 0;
const typingCursor = document.getElementById("typing-cursor");
let typingPaused = false;

async function type(id, text, speed) {
  const textPlaceholder = document.getElementById(id);
  return new Promise((resolve) => {
    var intervalId = setInterval(function () {
      if (!typingPaused && charsTyped < text.length) {
        typingCursor.classList.remove("typing-cursor-animation");
        if (text.charAt(charsTyped) === "\n") {
          typingPaused = true;
          typingCursor.classList.add("typing-cursor-animation");
          setTimeout(() => {
            playSound("enter");
            typingCursor.classList.remove("typing-cursor-animation");
            textPlaceholder.appendChild(document.createElement("br"));
            charsTyped++;
            typingPaused = false;
          }, 1000); // Delay of 30 milliseconds after typing the line break
        } else {
          playSound("button");
          textPlaceholder.appendChild(document.createTextNode(text.charAt(charsTyped)));
          charsTyped++;
        }
      } else if (charsTyped === text.length) {
        clearInterval(intervalId);
        typingCursor.classList.add("typing-cursor-animation");
        resolve();
      }
    }, speed);
    charsTyped = 0;
  });
}
