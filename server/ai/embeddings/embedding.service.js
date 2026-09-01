// Step 1: Import the pipeline utility
import { pipeline } from "@huggingface/transformers";

// Step 2: Cache the embedding pipeline so the model is loaded only once
let embeddingPipeline = null;

// Step 3: Load the embedding model
const loadEmbeddingPipeline = async () => {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  console.log("Embedding length:", embeddingPipeline.length);


  return embeddingPipeline;
};

// Step 4: Generate an embedding vector from text
export const generateEmbedding = async (text) => {
  const extractor = await loadEmbeddingPipeline();

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
};


