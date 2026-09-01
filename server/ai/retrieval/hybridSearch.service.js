// Step 1: Import dependencies
import mongoose from "mongoose";

import { Car } from "../../models/Car.model.js";


import { semanticSearch } from "./semanticSearch.service.js";
import { bm25Search } from "./bm25Search.service.js";
import { reciprocalRankFusion } from "./rrf.service.js";

// Step 2: Perform Hybrid Search
export const hybridSearch = async ({
  query,
  limit = 10,
  filters = {},
}) => {

  // Step 3: Run Semantic Search and BM25 Search in parallel
  const [semanticResult, bm25Result] = await Promise.all([
    semanticSearch({
      query,
      limit,
      filters,
    }),

    bm25Search({
      query,
      limit,
      filters,
    }),
  ]);

  // Step 4: Extract Chroma IDs
  const semanticIds = semanticResult.ids?.[0] ?? [];
console.log("Semantic IDs:", semanticIds);
  // Step 5: Extract BM25 IDs
  const bm25Ids = bm25Result.map((car) => car._id.toString());
console.log("BM25 IDs:", bm25Ids);
  // Step 6: Merge rankings using Reciprocal Rank Fusion
  const fusedIds = reciprocalRankFusion({
    semanticResults: semanticIds,
    bm25Results: bm25Ids,
  });
console.log("Fused IDs:", fusedIds);

  // Step 7: Return empty response if nothing found
  if (!fusedIds.length) {
    return [];
  }

  // Step 8: Convert to Mongo ObjectIds
  const objectIds = fusedIds.map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  // Step 9: Fetch complete cars
  const cars = await Car.find({
    _id: {
      $in: objectIds,
    },
  }).populate("brand");

  // Step 10: Preserve Hybrid Ranking
  const carMap = new Map(
    cars.map((car) => [
      car._id.toString(),
      car,
    ])
  );
 // Step 11: Return cars in Hybrid order
  return fusedIds
    .map((id) => carMap.get(id))
    .filter(Boolean);
};