export interface ModelInfo {
  name: string;
  features: string[];
  dataset: string;
  size: string;
  instruct: boolean;
  details: string;
  featherlessAvailable: boolean;
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
