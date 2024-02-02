import fs from 'node:fs';


const convertJsonToCsv = (jsonPath) => {
    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const headers = ['story','sentiment','keywords','category'];
    const rows = json.map((obj) => {
      const row = [];
      for (const header of headers) {
        row.push(obj[header]);
      }
      return row;
    });
    const csv = [headers.join(','), ...rows.map((row:string[]) => row[0] + "," + row[1] + "," + (row[2] as unknown as string[]).join('|') + "," + row[3]
    )].join('\n');
    fs.writeFileSync('responses.csv', csv);
  }
  convertJsonToCsv('responses.json');