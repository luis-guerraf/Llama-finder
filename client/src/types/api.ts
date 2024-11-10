export interface ModelInfo {
  name: string;
  summary: string;
  readMe: string;
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

export interface SourceInfo {
  title: string;
  url: string;
  description: string;
  published_date?: string;
  domain: string;
  domain_authority: {
    age_days?: number;
    backlinks?: number;
    rank?: number;
  };
}

export interface SearchResponse {
  llama3Models: ModelInfo[];
  alternatives: ModelInfo[];
  searchTerms: string[];
  sources: SourceInfo[];
}

export interface ApiError {
  message: string;
  code: string;
}
