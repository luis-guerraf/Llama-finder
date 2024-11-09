import axios from "axios";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Defining the schema we want our data in
const searchTermSchema = z.object({
  terms: z.array(z.string()).describe("Search terms"),
});
const jsonSchema = zodToJsonSchema(searchTermSchema, "searchTermSchema");

export async function generateSearchTerms(query: string): Promise<string[]> {
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/completions",
      {
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        prompt: `Given this use case: "${query}", generate 3-5 relevant search terms for finding AI language models`,
        max_tokens: 100,
        temperature: 0.7,
        response_format: {
          type: "json_object",
          schema: jsonSchema,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
      },
    );

    const terms = JSON.parse(response.data.choices[0].text);
    return Array.isArray(terms) ? terms : [];
  } catch (error) {
    console.error("Together AI error:", error);
    return [query];
  }
}
