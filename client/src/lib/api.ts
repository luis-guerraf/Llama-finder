import { SearchResponse } from "../types/api";

export async function searchModels(query: string): Promise<SearchResponse> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Failed to search models");
  }
  return response.json();
}
