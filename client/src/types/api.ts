export interface ModelInfo {
  name: string;
  summary: string;
  html: string;
  dataset: string;
  size: string;
  instruct: boolean;
  featherlessAvailable: boolean;
  // Performance metrics
  downloads: number;
  likes: number;
  lastUpdated: string;
  trainingMetrics?: {
    loss?: number;
    perplexity?: number;
  };
}

export interface SearchResponse {
  llama3Models: ModelInfo[];
  alternatives: ModelInfo[];
  searchTerms: string[];
}

export interface ApiError {
  message: string;
  code: string;
}
