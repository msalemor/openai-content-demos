export function SineValue(
  min: number,
  max: number,
  degrees: number,
  phase: number
): number {
  const offset = (max + min) / 2;
  const amplitude = (max - min) / 2;
  const value =
    offset + amplitude * Math.sin(degrees * (Math.PI / 180) + phase);

  return +value.toFixed(2);
}

export function getRandomNumber(min: number, max: number): number {
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

export function getRandomNumbers(
  min: number,
  max: number,
  num: number
): number[] {
  if (max - min < num) {
    throw new Error(
      "Cannot generate unique numbers. Range is smaller than the count."
    );
  }

  const result: number[] = [];

  while (result.length < num) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!result.includes(randomNum)) {
      result.push(randomNum);
    }
  }

  return result;
}

export function generateRandomDates(
  fiscalYearStart: Date,
  fiscalYearEnd: Date
): { startDate: Date; endDate: Date } {
  const yearStart = fiscalYearStart.getTime();
  const yearEnd = fiscalYearEnd.getTime();

  const randomStart =
    Math.floor(Math.random() * (yearEnd - yearStart)) + yearStart;
  const randomEnd =
    Math.floor(Math.random() * (yearEnd - randomStart)) + randomStart;

  return {
    startDate: new Date(randomStart),
    endDate: new Date(randomEnd),
  };
}
