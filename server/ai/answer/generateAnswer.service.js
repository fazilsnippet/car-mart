// Step 1: Import dependencies
import { understandQuery } from "../query/queryUnderstanding.service.js";
import { hybridSearch } from "../retrieval/hybridSearch.service.js";
import { buildContext } from "../contex/contextBuilder.service.js"
import { chatCompletion } from "../llm/openrouter.service.js";

// Step 2: Generate an AI answer
export const generateAnswer = async (userQuery) => {

  // Step 3: Understand the user's intent
  const parsedQuery = await understandQuery(userQuery);

  // Step 4: Retrieve relevant cars
  const cars = await hybridSearch({
    query: parsedQuery.semanticQuery || userQuery,
    filters: parsedQuery.filters,
    limit: 10,
  });

  // Step 5: Build context
  const context = buildContext(cars);

  // Step 6: AI instructions
  const systemPrompt = `
You are an AI assistant for a used car marketplace.

Rules:

- Answer ONLY using the provided context.
- Never invent cars.
- Never invent prices.
- Never invent specifications.
- If the answer cannot be found in the context, say:
"I couldn't find that information in the available inventory."

Keep answers short, professional and helpful.
`;

  // Step 7: User prompt
  const userPrompt = `
User Question:

${userQuery}

Available Inventory:

${context}
`;

  // Step 8: Generate AI response
  const ai = await chatCompletion({
    systemPrompt,
    userPrompt,
    temperature: 0.3,
  });

  // Step 9: Return everything
  return {
    parsedQuery,
    retrievedCars: cars,
    answer: ai,
  };
};