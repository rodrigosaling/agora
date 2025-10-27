import db from "./db.ts";
import { generateEmbedding } from "./embeddings.ts";

export interface Event {
  id: number;
  content: string;
  event_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface EventWithSimilarity extends Event {
  similarity: number;
}

// Save a new event
export async function saveEvent(
  content: string,
  eventDate?: Date,
): Promise<Event> {
  const embedding = await generateEmbedding(content);
  const date = eventDate || new Date();

  const result = await db.queryObject<Event>`
    INSERT INTO events (content, event_date, embedding)
    VALUES (${content}, ${date}, ${JSON.stringify(embedding)})
    RETURNING *
  `;

  return result.rows[0];
}

// Search similar events using semantic search
export async function searchSimilarEvents(
  query: string,
  limit = 10,
): Promise<EventWithSimilarity[]> {
  const embedding = await generateEmbedding(query);

  const result = await db.queryObject<EventWithSimilarity>`
    SELECT 
      id, 
      content, 
      event_date,
      created_at,
      updated_at,
      1 - (embedding <=> ${JSON.stringify(embedding)}) as similarity
    FROM events
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${JSON.stringify(embedding)}
    LIMIT ${limit}
  `;

  return result.rows;
}

// Get events by date range
export async function getEventsByDateRange(
  startDate: Date,
  endDate: Date,
): Promise<Event[]> {
  const result = await db.queryObject<Event>`
    SELECT id, content, event_date, created_at, updated_at
    FROM events
    WHERE event_date BETWEEN ${startDate} AND ${endDate}
    ORDER BY event_date DESC
  `;

  return result.rows;
}
