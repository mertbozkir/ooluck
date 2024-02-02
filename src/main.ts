import axios from 'axios';
import {Client} from 'pg';
import * as fs from "node:fs";
import crypto from 'node:crypto';
import {Handler, Context, Callback} from 'aws-lambda';

// Create a new client instance and provide your connection details
const client = new Client({
  user: 'phi2eternity', // DATABASE_USERNAME
  host: 'phi2eternitydatabase-dbinstance-gei3bm5lcwra.ctkageiiwi0g.us-east-1.rds.amazonaws.com', // DATABASE_URL
  database: 'phi2eternity', // DATABASE_NAME
  password: 'phi2eternity', // DATABASE_PASSWORD
  port: 5432, // DATABASE_PORT
  ssl: {
    rejectUnauthorized: false, // Important: This disables certificate verification
  },
});


// Function to fetch the latest story IDs from Hacker News
async function fetchLatestStoryIds(): Promise<number[]> {
  try {
    const response = await axios.get('https://hacker-news.firebaseio.com/v0/newstories.json');
    return response.data;
  } catch (error) {
    console.error("Error fetching latest story IDs:", error);
    throw error;
  }
}

// Function to fetch an individual story by ID
async function fetchStory(id: number): Promise<any> {
  try {
    const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching story ${id}:`, error);
    throw error;
  }
}

// Function to filter stories from the current day
function filterStoriesFromToday(stories: any[]): any[] {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return stories.filter(story => {
    const storyDate = new Date(story.time * 1000); // Convert UNIX timestamp to JavaScript Date
    return storyDate >= startOfToday;
  });
}

// Main function to fetch and filter daily stories
async function fetchTodaysStories() {
  const storyIds = await fetchLatestStoryIds();
  const storyPromises = storyIds.map(id => fetchStory(id));
  const stories = await Promise.all(storyPromises);
  return filterStoriesFromToday(stories);
}


// Function to generate SHA-256 hash and return first 16 characters
function generateDigest(title: string) {
  return crypto.createHash('sha256').update(title).digest('hex').substring(0, 16);
}


// Function to insert a batch of stories into the database transactionally
async function insertStoriesBatchIntoDatabase(storiesBatch: any[]) {
  try {
    await client.query('BEGIN'); // Start transaction

    const queryText = `
  INSERT INTO raw_posts(title, created_at, url, score, post_id, digest) 
  VALUES($1, $2, $3, $4, $5, $6)
  ON CONFLICT (digest) DO UPDATE 
  SET title = EXCLUDED.title, 
      created_at = EXCLUDED.created_at, 
      url = EXCLUDED.url, 
      score = EXCLUDED.score, 
      post_id = EXCLUDED.post_id`;
    for (const story of storiesBatch) {
      const digest = generateDigest(story.title);

      const values = [story.title, new Date(story.time * 1000), // Convert UNIX timestamp to JavaScript Date
        story.url || '', // Handle null or undefined URLs
        story.score, story.id, digest];
      await client.query(queryText, values);
    }

    await client.query('COMMIT'); // Commit transaction
    console.log(`Batch of ${storiesBatch.length} stories inserted successfully.`);
  } catch (error) {
    const {code, detail, stack} = error as never;
    if (code === '23505') { // Unique violation error code
      console.error('Unique constraint violation:', detail);
    } else {
      console.error('Error inserting batch of stories:', stack);
    }
    await client.query('ROLLBACK');
  }
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  // Avoid timing out by closing the database connection prematurely
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Connect to the database
    await client.connect();

    // Fetch and process stories
    const stories = await fetchTodaysStories();
    await insertStoriesBatchIntoDatabase(stories);

    // Disconnect from the database
    await client.end();

    // Return a successful response
    callback(null, {
      statusCode: 200, body: JSON.stringify({message: 'Stories processed successfully'}),
    });
  } catch (error) {
    console.error('Error in Lambda execution', error);
    callback(error as never);
  }
};
