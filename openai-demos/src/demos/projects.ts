import {
  SineValue,
  generateRandomDates,
  getRandomNumber,
  getRandomNumbers,
} from "./rangenerators";

const pms = ["John", "Mary", "Tom"];
const engineers = ["Susan", "David", "Sally", "Bob"];
const status = ["Unapproved", "Active", "Closed"];

export const getProjects = (): string => {
  let content = "Fiscal year is from 07/2022 to 06/2023\nProjects\n";
  let projects = getRandomNumbers(1000, 1010, 3);
  let fiveK = getRandomNumber(1, 5) <= 3 ? "Yes" : "Exception";
  let timespamp = new Date();
  for (let i = 1000; i <= 1010; i++) {
    const pm = pms[Math.floor(Math.random() * pms.length)];
    if (projects.includes(i)) {
      const error = getRandomNumber(1, 5);
      let cosd = "Yes";
      let dw = "Yes";
      switch (error) {
        case 1:
          fiveK = "No";
          break;
        case 2:
          dw = "No";
          break;
        case 3:
          cosd = "No";
          break;
        default:
          break;
      }
      content += `ID: ${i}, PM: ${pm}, Status: Unapproved, 5K: ${fiveK}, DAW: ${dw}, WDCOS: ${cosd}\n`;
    } else {
      content += `ID: ${i}, PM: ${pm}, Status: Unapproved, 5K: ${fiveK}, DAW: Yes, WDCOS: Yes\n`;
    }
  }
  projects = getRandomNumbers(1011, 1030, 6);
  content += "Projects\n";
  for (let i = 1011; i <= 1030; i++) {
    const pm = pms[Math.floor(Math.random() * pms.length)];
    const engineer = engineers[Math.floor(Math.random() * engineers.length)];
    const pStatus = getRandomNumber(1, 5) <= 4 ? status[1] : status[2];
    const degrees = (i - 1011) * 6;
    const phase = getRandomNumber(0, 60) * 6;
    let nsat = SineValue(180, 195, degrees, phase);
    const { startDate, endDate } = generateRandomDates(
      new Date(2022, 6, 1),
      new Date(2023, 4, 15)
    );
    if (projects.includes(i)) {
      const isGood = getRandomNumber(1, 5) <= 3 ? true : false;
      if (isGood) {
        content += `ID: ${i},PM: ${pm},Eng: ${engineer},Status: Closed,Start: ${startDate},End: ${endDate},WDCOS: Yes, SE: Yes, RR: Yes, NSAT: ${nsat}\n`;
      } else {
        const errorType = getRandomNumber(1, 4);
        let coc = "Yes";
        let se = "Yes";
        let rr = "Yes";
        switch (errorType) {
          case 1:
            coc = "No";
            break;
          case 2:
            se = "No";
            break;
          case 3:
            rr = "No";
            break;
          case 4:
            nsat = SineValue(140, 155, degrees, phase);
            break;
          default:
            break;
        }
        content += `ID: ${i},PM: ${pm},Eng: ${engineer},Status: Closed,Start: ${startDate},End: ${endDate},WDCOS: ${coc}, SE: ${se}, RR: ${rr}, NSAT: ${nsat}\n`;
      }
    } else {
      content += `ID: ${i},PM: ${pm},Eng: ${engineer},Status: Active,Start: ${startDate},End:,COC:, SE:,RR:,NSAT:\n`;
    }
  }
  return content;
};
