import "@std/dotenv/load";
import { saveEvent, searchSimilarEvents } from "./events.ts";

// Save some events in Portuguese
// await saveEvent("Fui à academia e fiz treino de pernas");
// await saveEvent("Almocei feijoada com a família");
// await saveEvent("Trabalhei no projeto agora pela manhã");
// await saveEvent("Corri 5km no parque");
// await saveEvent("Reunião com o time sobre o novo projeto");

console.log("\n--- Buscando eventos sobre exercício ---");
const exerciseEvents = await searchSimilarEvents("exercício físico", 3);
exerciseEvents.forEach((event) => {
  console.log(`[${event.similarity}] ${event.content}`);
});

console.log("\n--- Buscando eventos sobre trabalho ---");
const workEvents = await searchSimilarEvents("trabalho programação", 3);
workEvents.forEach((event) => {
  console.log(`[${event.similarity}] ${event.content}`);
});

Deno.exit(0);
