import axios from "axios";
import { ModelInfo } from "../../client/src/types/api";
import * as cheerio from "cheerio";

interface HuggingFaceModelResponse {
  modelId: string;
  tags: string[];
  pipeline_tag: string;
  private: boolean;
  downloads: number;
  likes: number;
  lastModified: string;
  cardData?: {
    model_name?: string;
    inference?: {
      parameters?: number;
    };
    training_loss?: number;
    perplexity?: number;
  };
  [key: string]: any;
}

async function scrapeModelPage(modelId: string): Promise<{ html: string }> {
  try {
    const response = await axios.get(`https://huggingface.co/${modelId}`);
    const $ = cheerio.load(response.data);

    return {
      html: $.html() || "No description available",
    };
  } catch (error) {
    console.error(`Error scraping model page for ${modelId}:`, error);
    return {
      html: "",
    };
  }
}

export async function searchModels(
  searchTerms: string[],
): Promise<ModelInfo[]> {
  try {
    var modelsArray: ModelInfo[] = [];
    for (var searchTerm of searchTerms) {
      const response = await axios.get<HuggingFaceModelResponse[]>(
        `https://huggingface.co/api/models?search=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
          params: {
            filter: "text-generation",
            direction: -1,
            limit: 3,
            full: true,
          },
        },
      );

      const models = await Promise.all(
        response.data
          .filter(
            (model) =>
              model.pipeline_tag === "text-generation" && !model.private,
          )
          .map(async (model) => {
            const { html } = await scrapeModelPage(model.modelId);
            return {
              name: model.modelId,
              html: html,
              dataset: model.cardData?.model_name || "Unknown",
              size: formatModelSize(model.cardData?.inference?.parameters),
              instruct: model.tags?.includes("instruct") || false,
              featherlessAvailable: false, // Will be updated later
              downloads: model.downloads || 0,
              likes: model.likes || 0,
              lastUpdated: model.lastModified || "",
              trainingMetrics: {
                loss: model.cardData?.training_loss,
                perplexity: model.cardData?.perplexity,
              },
            };
          }),
      );
      modelsArray = modelsArray.concat(models);
    }
    return modelsArray;
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
