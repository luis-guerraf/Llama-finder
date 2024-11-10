import axios, { AxiosError } from "axios";

interface FeatherlessModel {
  id: string;
  name: string;
  available: boolean;
  [key: string]: any;
}

interface FeatherlessApiResponse {
  models: FeatherlessModel[];
}

// Cache implementation
let modelsCache: FeatherlessModel[] | null = null;
let lastCacheUpdate: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function fetchModelsWithRetry(retryCount = 0): Promise<FeatherlessModel[]> {
  try {
    const response = await axios.get<FeatherlessApiResponse>(
      "https://api.featherless.ai/v1/models",
      {
        headers: {
          Authorization: `Bearer ${process.env.BRAVE_API_KEY}`,
        },
      }
    );

    // Access the models array from the response
    const models = response.data.models;
    if (!Array.isArray(models)) {
      console.error("Unexpected response format:", response.data);
      return [];
    }

    return models;
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
  lastCacheUpdate = Date.now();
  return models;
}

function normalizeModelName(name: string): string {
  return name.toLowerCase().replace(/[-_\s]/g, "");
}

function findModelInList(
  modelName: string,
  models: FeatherlessModel[]
): FeatherlessModel | undefined {
  const normalizedSearchName = normalizeModelName(modelName);
  return models.find(
    (model) =>
      normalizeModelName(model.id).includes(normalizedSearchName) ||
      normalizeModelName(model.name).includes(normalizedSearchName)
  );
}

export async function checkAvailability(modelName: string): Promise<boolean> {
  try {
    // Check if cache needs refresh
    if (
      !modelsCache ||
      Date.now() - lastCacheUpdate > CACHE_TTL
    ) {
      await refreshModelsCache();
    }

    // Use cached data
    const models = modelsCache || [];
    const model = findModelInList(modelName, models);
    return model?.available || false;
  } catch (error) {
    console.error("Error checking model availability:", {
      modelName,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
