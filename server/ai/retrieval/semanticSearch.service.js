// // Step 1: Import dependencies
// import { generateEmbedding } from "../embeddings/embedding.service.js";
// import { semanticSearch as chromaSemanticSearch } from "../vector/chroma.service.js";

// // Step 2: Perform semantic search using Chroma
// export const semanticSearch = async ({
//   query,
//   limit = 10,
//   where = undefined,
// }) => {
//   // Step 3: Validate the search query
//   if (!query || typeof query !== "string") {
//     throw new Error("Search query is required.");
//   }

//   // Step 4: Generate an embedding for the user's query
//   const embedding = await generateEmbedding(query);

//   // Step 5: Search Chroma Cloud
//   const results = await chromaSemanticSearch({
//     embedding,
//     limit,
//     where,
//   });

//   // Step 6: Return raw Chroma results
//   return results;
// };

// Step 1: Import dependencies
import { generateEmbedding } from "../embeddings/embedding.service.js";
import { semanticSearch as chromaSemanticSearch } from "../vector/chroma.service.js";

// Step 2: Perform semantic search using Chroma
export const semanticSearch = async ({
  query,
  limit = 10,
  filters = {},
}) => {

  // Step 3: Validate the search query
  if (!query || typeof query !== "string") {
    throw new Error("Search query is required semantic search.");
  }

  // Step 4: Generate query embedding
  const embedding = await generateEmbedding(query);

  // Step 5: Build Chroma metadata filter
const conditions = [];

if (filters.brand) {
  conditions.push({
    brand: filters.brand.toLowerCase(),
  });
}

if (filters.city) {
  conditions.push({
    city: filters.city.toLowerCase(),
  });
}

if (filters.state) {
  conditions.push({
    state: filters.state.toLowerCase(),
  });
}

if (filters.fuelType) {
  conditions.push({
    fuelType: filters.fuelType.toLowerCase(),
  });
}

if (filters.transmission) {
  conditions.push({
    transmission: filters.transmission.toLowerCase(),
  });
}

if (filters.driveType) {
  conditions.push({
    driveType: filters.driveType.toLowerCase(),
  });
}

if (filters.lifecycleStatus) {
  conditions.push({
    lifecycleStatus: filters.lifecycleStatus.toLowerCase(),
  });
}

let where;

if (conditions.length === 1) {
  where = conditions[0];
} else if (conditions.length > 1) {
  where = {
    $and: conditions,
  };
}

  // Step 6: Search Chroma
  return await chromaSemanticSearch({
    embedding,
    limit,
    // where: Object.keys(where).length ? where : undefined,
    where: where || undefined,
  });
};