export const BIRTHDAY_EPOCH = 1148169600000;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isDesktopUser(): boolean {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isViewportWideEnough = window.innerWidth >= 1024;
  const isLaptop =
    window.matchMedia('(hover: hover)').matches ||
    window.matchMedia('(hover: none)').matches;
  const isSmallLaptop = window.innerWidth < 1024 && window.innerHeight < 768;

  if (!isTouchDevice && isViewportWideEnough && (isLaptop || isSmallLaptop)) {
    return true;
  }
  return false;
}

export function getDateDifference(date: Date) {
  const targetDate = new Date(BIRTHDAY_EPOCH);
  let diffTime = date.getTime() - targetDate.getTime();
  let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  let diffMonths = 0;
  let diffYears = 0;

  while (diffDays >= 365) {
    const year =
      new Date(targetDate.getFullYear() + diffYears + 1, 0, 0).getTime() -
      new Date(targetDate.getFullYear() + diffYears, 0, 0).getTime();
    const daysInYear = Math.floor(year / (1000 * 60 * 60 * 24));
    if (diffDays >= daysInYear) {
      diffYears++;
      diffDays -= daysInYear;
    } else {
      break;
    }
  }

  while (diffDays >= 30) {
    const month = new Date(
      targetDate.getFullYear() + diffYears,
      targetDate.getMonth() + diffMonths + 1,
      0
    ).getDate();
    if (diffDays >= month) {
      diffMonths++;
      diffDays -= month;
    } else {
      break;
    }
  }

  return { days: diffDays, months: diffMonths, years: diffYears };
}
