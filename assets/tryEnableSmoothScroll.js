// Use smooth scroll if on desktop else don't
(function tryEnableSmoothScroll(speed, scrollBy) {
    if (isDesktopUser()) {
        new smoothScroll(document, speed, scrollBy);
    }
})(50, 30);
// Allow smooth scrolling on the document (IIFE)