// Step 1: Import OpenRouter
import { chatCompletion } from "../llm/openrouter.service.js";

// Step 2: Convert natural language into structured search intent
export const understandQuery = async (query) => {
  const systemPrompt = `
You are an AI search parser for a used car marketplace.

Extract structured search information.

Rules:
- Return ONLY valid JSON.
- Do not explain anything.
- If a value is missing, return null.
- Keep semanticQuery short.
- Convert prices to integers in INR.
- Recognize synonyms.

Fuel Types:
Petrol
Diesel
Electric
Hybrid
CNG
LPG

Transmission:
MT
AT
CVT
DCT
AMT
IMT
E-CVT
SINGLE-SPEED

Drive Types:
FWD
RWD
AWD
4WD

Return exactly:

{
  "semanticQuery":"",
  "filters":{
      "brand":null,
      "city":null,
      "state":null,
      "fuelType":null,
      "transmission":null,
      "driveType":null,
      "minPrice":null,
      "maxPrice":null,
      "minYear":null,
      "maxYear":null
  }
}
`;

  const userPrompt = query;

  return await chatCompletion({
    systemPrompt,
    userPrompt,
    temperature: 0,
  });
};