// Use smooth scroll if on desktop else don't
function tryEnableSmoothScroll(speed, scrollBy) {
    if (is.desktop()) {
        new smoothScroll(document, speed, scrollBy);
    }
}

// Allow smooth scrolling on the document
tryEnableSmoothScroll(50, 30);