async function playShellAnimation() {
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
    playSound("enter")
    await sleep(740);
    document.getElementById("shell-cursor").innerHTML = "";
    for (const [index, message] of messages.entries()) {
        playSound("alert")
        shellResp.innerHTML += `<br>${message}`;
        await sleep(index === 0 ? 550 : 1100);
    }
    shellWrapper.classList.add("hidden");
    headingWrapper.classList.remove("hidden");
}

async function playTypingAnimation() {
    const fallbackQuotes = [
        '"The best way to predict the future is to create it."\n - Peter F. Drucker',
        '"Stay hungry, stay foolish."\n - Steve Jobs',
        '"Be yourself; everyone else is already taken."\n - Oscar Wilde',
    ];

    let quotes = fallbackQuotes;
    try {
        const res = await fetch('https://api.theflyingrat.com/siteinfo/quotes');
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) quotes = data;
        }
    } catch {}

    const randomIndex = Math.floor(Math.random() * quotes.length);
    await type("title-placeholder", quotes[randomIndex], 78);
    await sleep(550);

    // TODO: Make this scene more exciting i guess.

    document.location.href = "/home";
}
