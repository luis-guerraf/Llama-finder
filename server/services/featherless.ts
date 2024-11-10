import axios, { AxiosError } from "axios";

interface FeatherlessModel {
  id: string;
  name: string;
  [key: string]: any;
}

// Cache implementation
let modelsCache: FeatherlessModel[] | null = null;
refreshModelsCache();

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function fetchModelsWithRetry(
  retryCount = 0,
): Promise<FeatherlessModel[]> {
  try {
    const response = await axios.get<FeatherlessModel[]>(
      "https://api.featherless.ai/v1/models",
    );

    if (!Array.isArray(response.data["data"])) {
      console.error("Unexpected response format:", response.data["data"][0]);
      return [];
    }

    return response.data["data"];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Featherless API error:", {
        status: axiosError.response?.status,
        message: axiosError.message,
        data: axiosError.response?.data,
      });

      // Retry logic for 5xx errors or network issues
      if (
        retryCount < MAX_RETRIES &&
        (axiosError.response?.status === undefined ||
          axiosError.response?.status >= 500)
      ) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
        console.log(`Retrying Featherless API call in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchModelsWithRetry(retryCount + 1);
      }
    } else {
      console.error("Unexpected error during Featherless API call:", error);
    }
    return [];
  }
}

async function refreshModelsCache(): Promise<FeatherlessModel[]> {
  const models = await fetchModelsWithRetry();
  modelsCache = models;
  return models;
}

function normalizeModelName(name: string): string {
  return name.toLowerCase().replace(/[-_\s]/g, "");
}

function findModelInList(
  modelName: string,
  models: FeatherlessModel[],
): FeatherlessModel | undefined {
  const normalizedSearchName = normalizeModelName(modelName);
  return models.find(
    (model) =>
      normalizeModelName(model.id).includes(normalizedSearchName) ||
      normalizeModelName(model.name).includes(normalizedSearchName),
  );
}

export async function checkAvailability(modelName: string): Promise<boolean> {
  try {
    // Check if cache needs refresh
    if (!modelsCache) {
      await refreshModelsCache();
    }

    // Use cached data
    const models = modelsCache || [];
    const model = findModelInList(modelName, models);
    return model !== undefined || false;
  } catch (error) {
    console.error("Error checking model availability:", {
      modelName,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
