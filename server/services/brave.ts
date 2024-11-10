import axios from "axios";

export interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  published_date?: string;
  domain: string;
}

export async function searchSources(query: string): Promise<BraveSearchResult[]> {
  try {
    const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': process.env.BRAVE_API_KEY
      },
      params: {
        q: query,
        count: 5,
        format: 'json'
      }
    });

    return response.data.web.results.map((result: any) => ({
      title: result.title,
      url: result.url,
      description: result.description,
      published_date: result.published_date,
      domain: result.domain
    }));
  } catch (error) {
    console.error('Brave Search API error:', error);
    return [];
  }
}
