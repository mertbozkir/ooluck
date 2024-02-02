import axios from 'axios';
import fs from 'node:fs';
import { SingleBar, Presets } from 'cli-progress';

const prompt = (content: string): string => {
  return `
    Classify the following Hacker News story and respond in JSON format. 
    - Sentiment should be categorized as either "POSITIVE", "NEGATIVE", or "NEUTRAL".
    - Keywords should include entities like company names, technologies, and celebrities.
    - Category should be one of the following: "AI & Machine Learning", "Startups & Entrepreneurship", "Programming & Development", "Cybersecurity & Hacking", "Technology Updates", "Science & Space", "Productivity & Tools", "Digital Culture & Internet Trends", "Hardware & Gadgets", or "Other".

    Please format the response as follows:
    {
      "sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
      "keywords": ["array", "of", "relevant", "entities"],
      "category": "AI & Machine Learning" | "Startups & Entrepreneurship" | "Programming & Development" | "Cybersecurity & Hacking" | "Technology Updates" | "Science & Space" | "Productivity & Tools" | "Digital Culture & Internet Trends" | "Hardware & Gadgets" | "Other"
    }

    Story: '${content}'
  `;
};


const generate = async (prompt:string) => {
  const { data } = await axios.post('http://localhost:11434/api/generate', {
    model: 'phi',
    prompt,
    stream: false,
    top_p: 1,
    temperature: 0,

  });
  const { response,created_at,done,total_duration } = data;
  return { response,created_at,done,total_duration };

}

const readCsvFile = async (path:string) => {
  const fileContent = fs.readFileSync(path, 'utf8');
  const lines = fileContent.split('\n');
  const headers:string[] = lines[0].split(',');
  const rows = lines.slice(1).map(line => line.split(','));
  const data = rows.map(row => {
    const obj  : {
      [key: string]: string;
    } = {} ;
    for (const [index, value] of row.entries()) {
      const header = headers[index] as string
      obj[header] = value;
    }
    return obj;
  });
  return data;
}


const main = async () => {
  const progressBar = new SingleBar({}, Presets.shades_classic);
  const rows = await readCsvFile('data.csv');
  const responses = [];
  let current = 0;

  progressBar.start(rows.length, current);
  for (const row of rows) {
    const title = row['title'];
    const promptText = prompt(title);
    const { response } = await generate(promptText);

    try{

      const jsonResponse = JSON.parse(response);
      jsonResponse['story'] =  row['title']
      responses.push(jsonResponse);

    }catch(e){
      console.error(title);
      console.error(response);
    }finally{
      progressBar.update(++current);
    }

  }
  // Write responses to file
  fs.writeFileSync('responses.json', JSON.stringify(responses));
}

main();
/*
 {
    "sentiment": "POSITIVE",
    "keywords": ["Pathom 3", "Library for navigating data"],
    "category": "AI & Machine Learning"
}


 */
