// Step 1: Import the Cars collection
import { getCarCollection } from "../collections/createcarcollection.js";

// Step 2: Upsert a car into Chroma Cloud
export const upsertCarVector = async ({
  id,
  document,
  embedding,
  metadata,
}) => {
  const collection = await getCarCollection();

  await collection.upsert({
    ids: [id],
    documents: [document],
    embeddings: [embedding],
    metadatas: [metadata],
  });
};

// Step 3: Delete a car from Chroma Cloud
export const deleteCarVector = async (id) => {
  const collection = await getCarCollection();

  await collection.delete({
    ids: [id],
  });
};

// Step 4: Perform semantic vector search
export const semanticSearch = async ({
  embedding,
  limit = 10,
  where = undefined,
}) => {
  const collection = await getCarCollection();

  return await collection.query({
    queryEmbeddings: [embedding],
    nResults: limit,
    where,
  });
};

