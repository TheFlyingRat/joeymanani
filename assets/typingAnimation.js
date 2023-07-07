var charsTyped = 0;
const typingCursor = document.getElementById("typing-cursor");

async function type(id, text, speed) {
    const textPlaceholder = document.getElementById(id);
    return new Promise(resolve => {
        var id = setInterval(function() {
            if (charsTyped < text.length) {
                typingCursor.classList.remove("typing-cursor-animation");
                if (text.charAt(charsTyped) === '\n') {
                    textPlaceholder.innerHTML += '<br>';
                } else {
                    textPlaceholder.innerHTML += text.charAt(charsTyped);
                }
                playSound("button")
                charsTyped++;
            } else {
                clearInterval(id);
                typingCursor.classList.add("typing-cursor-animation");
                resolve();
            }
        }, speed);
        charsTyped = 0;
    });
}