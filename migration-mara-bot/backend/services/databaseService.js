// backend/services/databaseService.js
const supabase = require("./supabaseClient");
const { createEmbedding } = require("./embeddingService");

async function searchPolicies(question) {
  // Convert question to embedding
  const questionEmbedding = await createEmbedding(question);

  // Find 3 most relevant PDF chunks
  const { data, error } = await supabase.rpc("match_policy_chunks", {
    query_embedding: questionEmbedding,
    match_count: 3
  });

  if (error) {
    console.error("Vector search error:", error);
    return [];
  }

  // Only return chunks with >30% relevance
  return data?.filter(c => c.similarity > 0.3) || [];
}

// Check if MARA human agent is marked available
async function checkMaraAvailability() {
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "mara_available")
    .single();
  return data?.value === "true";
}

module.exports = { searchPolicies, checkMaraAvailability };
