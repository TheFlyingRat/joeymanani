import { isDesktopUser } from './utils';

function smoothScroll(
  el: HTMLElement | Document,
  speed: number,
  smoothness: number
) {
  let element: HTMLElement;
  if (el === document) {
    element =
      document.scrollingElement as HTMLElement ||
      document.documentElement ||
      document.body.parentNode as HTMLElement ||
      document.body;
  } else {
    element = el as HTMLElement;
  }

  let running = false;
  let targetScrollTop = element.scrollTop;
  const scrollContainer =
    element === document.body && document.documentElement
      ? document.documentElement
      : element;

  function scrolled(e: WheelEvent) {
    e.preventDefault();
    let delta: number;
    if ((e as any).detail) {
      delta = (e as any).wheelDelta
        ? ((e as any).wheelDelta / (e as any).detail / 40) *
          ((e as any).detail > 0 ? 1 : -1)
        : -(e as any).detail / 3;
    } else {
      delta = (e as any).wheelDelta / 120;
    }
    targetScrollTop += -delta * speed;
    targetScrollTop = Math.max(
      0,
      Math.min(targetScrollTop, element.scrollHeight - scrollContainer.clientHeight)
    );
    if (!running) update();
  }

  function update() {
    running = true;
    const diff = (targetScrollTop - element.scrollTop) / smoothness;
    element.scrollTop += diff;
    if (Math.abs(diff) > 0.5) {
      raf(update);
    } else {
      running = false;
    }
  }

  element.addEventListener('mousewheel', scrolled as EventListener, { passive: false });
  element.addEventListener('DOMMouseScroll', scrolled as EventListener, { passive: false });

  const raf =
    window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    (window as any).oRequestAnimationFrame ||
    (window as any).msRequestAnimationFrame ||
    function (cb: FrameRequestCallback) {
      window.setTimeout(cb, 20);
    };
}

export function initSmoothScroll(): void {
  if (isDesktopUser()) {
    smoothScroll(document, 50, 30);
  }
}
