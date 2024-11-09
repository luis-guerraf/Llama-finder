import axios from "axios";

export async function generateSearchTerms(query: string): Promise<string[]> {
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/completions",
      {
        model: "togethercomputer/llama-2-70b",
        prompt: `Given this use case: "${query}", generate 3-5 relevant search terms for finding AI language models. Format as JSON array.`,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
      }
    );

    const terms = JSON.parse(response.data.choices[0].text);
    return Array.isArray(terms) ? terms : [];
  } catch (error) {
    console.error("Together AI error:", error);
    return [query];
  }
}
