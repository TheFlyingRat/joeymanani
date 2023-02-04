async function playShellAnimation() {
    const enterSound = new Audio('/assets/enter.wav');
    const shellResp = document.getElementById("shell-response");
    const shellWrapper = document.getElementById("shell");
    const headingWrapper = document.getElementById("heading");

    await type("shell-placeholder", "joey --load", 82);
    await sleep(180);
    enterSound.play();
    await sleep(740);
    document.getElementById("shell-cursor").innerHTML = "";
    shellResp.innerHTML = "<br>[INFO] Loading joeymanani.com...";
    await sleep(550);
    shellResp.innerHTML += "<br>[INFO] Initializing assets...";
    await sleep(1100);
    shellResp.innerHTML += "<br>[INFO] Opening program...";
    await sleep(3000);
    shellWrapper.classList.add("hidden");
    headingWrapper.classList.remove("hidden");
}


async function playTypingAnimation() {
    await type("title-placeholder", "Joey Manani", 134);
    await sleep(2000);
    await backspace("title-placeholder", "Joey Manani", 48);
    await sleep(1500);
    await type("title-placeholder", "Software Developer", 134);
    await sleep(2000);
    await backspace("title-placeholder", "Software Developer", 48);
    await sleep(1500);
    await type("title-placeholder", "Victoria, Australia", 134);
    await sleep(2000);
    await backspace("title-placeholder", "Victoria, Australia", 48);
}
