import { Client } from "jsr:@db/postgres";

const client = new Client(Deno.env.get("DATABASE_URL")!);
await client.connect();

export default client;
