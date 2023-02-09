var charsTyped = 0;
const typingCursor = document.getElementById("typing-cursor");
const backspaceSound = new Audio('/assets/backspace.wav');
const keySound = new Audio('/assets/button.wav');

async function type(id, text, speed) {
    const textPlaceholder = document.getElementById(id);
    return new Promise(resolve => {
        var id = setInterval(function() {
            if (charsTyped < text.length) {
                typingCursor.classList.remove("typing-cursor-animation");
                textPlaceholder.innerHTML += text.charAt(charsTyped);
                keySound.pause();
                keySound.currentTime = 0;
                keySound.play();
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

async function backspace(id, text, speed) {
    const textPlaceholder = document.getElementById(id);
    return new Promise(resolve => {
        var i = text.length;
        const removeOne = setInterval(function() {
            if (i > 0) {
                i--;
                textPlaceholder.innerHTML = text.substring(0, i);
                backspaceSound.play();
                typingCursor.classList.remove("typing-cursor-animation");
                setTimeout(function() {
                    clearInterval(removeOne);
                    const removeRest = setInterval(function() {
                        if (i > 0) {
                            i--;
                            textPlaceholder.innerHTML = text.substring(0, i);
                            backspaceSound.pause();
                            backspaceSound.currentTime = 0;
                            backspaceSound.play();
                            typingCursor.classList.remove("typing-cursor-animation");
                        } else {
                            clearInterval(removeRest);
                            typingCursor.classList.add("typing-cursor-animation");
                            resolve();
                        }
                    }, speed);
                }, 500);
            } else {
                clearInterval(removeOne);
                typingCursor.classList.add("typing-cursor-animation");
                resolve();
            }
        }, 500);
    });
}