// Step 1: Import the Chroma Cloud client
import { CloudClient } from "chromadb";

// Step 2: Create a singleton Chroma Cloud client
const chromaClient = new CloudClient({
 apiKey: 'ck-4Zn8zmuWRAwHLnpYfs974HnKsAn5WyvpUxKoaLjiK8qN',
  tenant: 'c55c4c02-7a90-4807-a7d5-93ec917b4a37',
  database: 'newdatabase'
});

try {
  const collections = await chromaClient.listCollections();
  console.log("✅ Connected!");
  console.log(collections);
} catch (err) {
  console.error("❌ Connection failed:");
  console.error(err);
}
// Step 3: Export the client
export default chromaClient;

