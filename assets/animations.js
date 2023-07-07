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
    quotes = [
        '"Innovation distinguishes between a leader and a follower."\n - Steve Jobs',
        '"The best way to predict the future is to create it."\n - Peter F. Drucker',
        '"Innovation is seeing what everybody has seen and thinking what nobody has thought."\n - Dr. Albert Szent-Györgyi',
        '"The future belongs to those who believe in the beauty of their dreams."\n - Eleanor Roosevelt',
        '"The art of programming is the skill of controlling complexity."\n - Marijn Haverbeke',
        '"The only way to do great work is to love what you do."\n - Steve Jobs',
        '"The future is already here — it\'s just not evenly distributed."\n - William Gibson',
        '"Innovation is the specific instrument of entrepreneurship."\n - Peter F. Drucker',
        '"Innovation is the ability to see change as an opportunity, not a threat."\n - Steve Jobs',
        '"The best way to find yourself is to lose yourself in the service of others."\n - Mahatma Gandhi',
        '"Great things are not done by impulse, but by a series of small things brought together."\n - Vincent Van Gogh',
        '"The future depends on what you do today."\n - Mahatma Gandhi',
        '"The only limit to our realization of tomorrow will be our doubts of today."\n - Franklin D. Roosevelt',
        '"Programming is the closest thing we have to magic."\n - Drew Houston',
        '"Innovation is taking two things that already exist and putting them together in a new way."\n - Tom Freston',
        '"The future starts today, not tomorrow."\n - Pope John Paul II',
        '"Be yourself; everyone else is already taken."\n - Oscar Wilde',
        '"Stay hungry, stay foolish."\n - Steve Jobs',
        '"Dream big and dare to fail."\n - Norman Vaughan',
        '"Don\'t worry, be happy."\n - Bobby McFerrin',
        '"Life is short, smile while you still have teeth."\n - Mallory Hopkins',
        '"Strive not to be a success, but rather to be of value."\n - Albert Einstein',
        '"Do what you love."\n - Confucius',
        '"Live simply, love generously, speak truthfully."\n - Buddha',
        '"Success is not final, failure is not fatal: It is the courage to continue that counts."\n - Winston Churchill',
        '"Every moment is a fresh beginning."\n - T.S. Eliot',
        '"Life is either a daring adventure or nothing at all."\n - Helen Keller',
        '"Happiness depends upon ourselves."\n - Aristotle',
        '"Believe you can and you\'re halfway there."\n - Theodore Roosevelt',
        '"Be the change."\n - Mahatma Gandhi',
        '"Live, laugh, love."\n - Unknown',
        '"It does not matter how slowly you go as long as you do not stop."\n - Confucius',
        '"You only live once, but if you do it right, once is enough."\n - Mae West',
        '"Success is walking from failure to failure with no loss of enthusiasm."\n - Winston Churchill',
        '"Keep calm and carry on."\n - Unknown',
        '"Life is a one-time offer. Use it well."\n - Unknown',
        '"The best revenge is massive success."\n - Frank Sinatra',
        '"Love all, trust a few, do wrong to none."\n - William Shakespeare',
        '"Believe in yourself and all that you are."\n - Christian D. Larson',
        '"Chase your dreams."\n - Unknown',
        '"Life is what happens when you\'re busy making other plans."\n - John Lennon',
        '"Live the life you love. Love the life you live."\n - Bob Marley',
        '"Don\'t count the days, make the days count."\n - Muhammad Ali',
        '"The best is yet to come."\n - Frank Sinatra'
    ];


    const randomIndex = Math.floor(Math.random() * quotes.length);
    await type("title-placeholder", quotes[randomIndex], 78);
    await sleep(550);

    // TODO: Make this scene more exciting i guess.

    document.location.href = "/home";
}
