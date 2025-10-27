import { pipeline } from "@xenova/transformers";

// This model works well with Brazilian Portuguese
let embedder: any = null;

async function getEmbedder() {
  if (!embedder) {
    console.log("Loading embedding model...");
    // paraphrase-multilingual-MiniLM-L12-v2 supports Portuguese well
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/paraphrase-multilingual-MiniLM-L12-v2",
    );
    console.log("Model loaded!");
  }
  return embedder;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = await getEmbedder();
  const output = await model(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}
