// Step 1: Import dependencies
import { buildCarDocument } from "../documents/buildCarDocument.js";
import { buildCarMetadata } from "../documents/buildCarMetadata.js";
import { generateEmbedding } from "../embeddings/embedding.service.js";
import { upsertCarVector } from "../vector/chroma.service.js";

// Step 2: Index a car into Chroma Cloud
// Step 2: Index a car into Chroma Cloud
export const indexCar = async (car) => {
  console.log("🚀 Starting AI Indexing...");

  // Step 3: Build the semantic document
  const document = buildCarDocument(car);
  console.log("✅ Search document created");

  // Step 4: Build searchable metadata
  const metadata = buildCarMetadata(car);
  console.log("✅ Metadata created");

  // Step 5: Generate embedding
  const embedding = await generateEmbedding(document);
  console.log(`✅ Embedding generated (${embedding.length} dimensions)`);

  // Step 6: Store vector in Chroma Cloud
  await upsertCarVector({
    id: car._id.toString(),
    document,
    embedding,
    metadata,
  });

  console.log("✅ Car indexed into Chroma Cloud");
};