// Step 1: Import the Car model
import { Car } from "../../models/Car.model.js";

// Step 2: Perform BM25 search using MongoDB Atlas Search
export const bm25Search = async ({
  query,
  limit = 10,
  filters = {},
}) => {
  // Step 3: Build Atlas Search compound query
  const must = [
    {
      text: {
        query,
        path: [
          "title",
          "variant",
          "features",
          "fuelType",
          "transmission",
          "driveType",
          "location.city",
          "location.state",
        ],
      },
    },
  ];

  // Step 4: Build optional filters
  const filter = [];

  if (filters.fuelType) {
    filter.push({
      text: {
        query: filters.fuelType,
        path: "fuelType",
      },
    });
  }

  if (filters.transmission) {
    filter.push({
      text: {
        query: filters.transmission,
        path: "transmission",
      },
    });
  }

  if (filters.driveType) {
    filter.push({
      text: {
        query: filters.driveType,
        path: "driveType",
      },
    });
  }

  if (filters.city) {
    filter.push({
      text: {
        query: filters.city,
        path: "location.city",
      },
    });
  }
  if (filters.state) {
    filter.push({
      text: {
        query: filters.state,
        path: "location.state",
      },
    });
  }

  // Step 5: Execute Atlas Search
  return await Car.aggregate([
    {
      $search: {
        index: "cars_search",
        compound: {
          must,
          filter,
        },
      },
    },

    // Step 6: Attach BM25 score
    {
      $addFields: {
        bm25Score: {
          $meta: "searchScore",
        },
      },
    },

    // Step 7: Limit results
    {
      $limit: limit,
    },

    // Step 8: Return only what's needed
    {
      $project: {
        _id: 1,
        bm25Score: 1,
      },
    },
  ]);
};