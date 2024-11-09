import axios from "axios";
import { ModelInfo } from "../../client/src/types/api";

export async function searchModels(searchTerms: string[]): Promise<ModelInfo[]> {
  try {
    const response = await axios.post(
      "https://huggingface.co/api/models",
      {
        search: searchTerms.join(" OR "),
        filter: "text-generation",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    return response.data.map((model: any) => ({
      flavor: model.modelId,
      features: model.tags || [],
      dataset: model.dataset || "Unknown",
      size: model.parameters || "Unknown",
      instruct: model.tags?.includes("instruct") || false,
      details: model.description || "",
      featherlessAvailable: false, // Will be updated later
    }));
  } catch (error) {
    console.error("HuggingFace API error:", error);
    return [];
  }
}
