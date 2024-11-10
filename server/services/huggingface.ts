import axios from "axios";
import { ModelInfo } from "../../client/src/types/api";

interface HuggingFaceModelResponse {
  modelId: string;
  tags: string[];
  pipeline_tag: string;
  private: boolean;
  downloads: number;
  likes: number;
  [key: string]: any;
}

export async function searchModels(
  searchTerms: string[],
): Promise<ModelInfo[]> {
  try {
    const query = searchTerms.join(" OR ");
    const response = await axios.get<HuggingFaceModelResponse[]>(
      `https://huggingface.co/api/models?search=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        params: {
          filter: "text-generation",
          sort: "downloads",
          direction: -1,
          limit: 20,
        },
      },
    );

    if (!Array.isArray(response.data)) {
      console.error(
        "Invalid response format from HuggingFace API:",
        response.data,
      );
      return [];
    }

    return response.data
      .filter(
        (model) => model.pipeline_tag === "text-generation" && !model.private,
      )
      .map((model) => ({
        name: model.modelId,
        features: model.tags || [],
        dataset: model.dataset || "Unknown",
        size: formatModelSize(model.parameters),
        instruct: model.tags?.includes("instruct") || false,
        details: model.description || "",
        featherlessAvailable: false, // Will be updated later
      }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("HuggingFace API error:", {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    } else {
      console.error("Unexpected error during HuggingFace API call:", error);
    }
    return [];
  }
}

function formatModelSize(parameters: number | undefined): string {
  if (!parameters) return "Unknown";

  if (parameters >= 1e9) {
    return `${(parameters / 1e9).toFixed(1)}B`;
  } else if (parameters >= 1e6) {
    return `${(parameters / 1e6).toFixed(1)}M`;
  } else {
    return `${parameters.toLocaleString()}`;
  }
}
