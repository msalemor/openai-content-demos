import { SineValue, getRandomNumber, getRandomNumbers } from "./rangenerators";

export function getServers(): string {
  let context = "Server List\n";
  const anomalyServers = getRandomNumbers(1000, 1100, 10);
  for (let i = 1001; i <= 1100; i++) {
    const hostname = `HOST${i}`;
    let temp = SineValue(
      45,
      50,
      getRandomNumber(0, 360),
      getRandomNumber(0, 360)
    );
    let voltage = SineValue(
      119.5,
      121.0,
      getRandomNumber(0, 360),
      getRandomNumber(0, 360)
    );
    let rpms = SineValue(
      2800,
      3000,
      getRandomNumber(0, 360),
      getRandomNumber(0, 360)
    );
    if (anomalyServers.includes(i)) {
      const anomalyType = getRandomNumber(1, 3);
      switch (anomalyType) {
        case 1:
          temp = getRandomNumber(1, 2) == 1 ? 0 : temp * 1.5;
          break;
        case 2:
          voltage = 0;
          break;
        case 3:
          rpms = 0 * 0.5;
          break;
        default:
          break;
      }
    }
    let server = `ID: ${i}, Hostname: ${hostname}, Voltage: ${voltage}, Temp: ${temp}, RPM: ${rpms}\n`;
    context += server;
  }
  return context;
}
