// Step 1: Import the shared Chroma client
import chromaClient from "../config/chroma.js";

const COLLECTION_NAME = "cars";

// Step 2: Create or retrieve the Cars collection
export const getCarCollection = async () => {
 return await chromaClient.getOrCreateCollection({
  name: COLLECTION_NAME,
  metadata: {
    description: "Semantic search collection for car listings",
  },
  embeddingFunction: null,
});
};