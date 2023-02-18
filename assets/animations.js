async function playShellAnimation() {
    const enterSound = new Audio('/assets/enter.wav');
    const alertSound = new Audio('/assets/alert.wav');
    const shellResp = document.getElementById("shell-response");
    const shellWrapper = document.getElementById("shell");
    const headingWrapper = document.getElementById("heading");
    const messages = [
        "[INFO] Loading joeymanani.com...",
        "[INFO] Initializing assets...",
        "[INFO] Opening program..."
    ];

    await type("shell-placeholder", "joey --load", 82);
    await sleep(180);
    enterSound.play();
    await sleep(740);
    document.getElementById("shell-cursor").innerHTML = "";
    for (const [index, message] of messages.entries()) {
        alertSound.currentTime = 0;
        alertSound.play();
        shellResp.innerHTML += `<br>${message}`;
        await sleep(index === 0 ? 550 : 1100);
    }
    alertSound.pause();
    shellWrapper.classList.add("hidden");
    headingWrapper.classList.remove("hidden");
}

async function playTypingAnimation() {
    // await type("title-placeholder", "Joey Manani", 106);
    // await sleep(2000);
    // await backspace("title-placeholder", "Joey Manani", 48);
    // await sleep(550);

    // TODO: Make this scene more exciting i guess.

    document.location.href = "/home";
}
