import axios from "axios";

export interface BraveSearchResult {
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

export async function searchSources(query: string): Promise<BraveSearchResult[]> {
  try {
    const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': process.env.BRAVE_API_KEY
      },
      params: {
        q: query + " HuggingFace LLM Llama",
        count: 5,
        format: 'json',
        extra_snippets: true,
        result_filter: 'web'
      }
    });

    return response.data.web.results.map((result: any) => ({
      title: result.title,
      url: result.url,
      description: result.description.slice(0, 50),
      published_date: result.published_date,
      domain: result.domain,
      domain_authority: {
        age_days: result.age_days,
        backlinks: result.backlinks,
        rank: result.rank
      }
    }));
  } catch (error) {
    console.error('Brave Search API error:', error);
    return [];
  }
}
