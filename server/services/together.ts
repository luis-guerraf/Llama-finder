import axios from "axios";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Defining the schema for search terms
const searchTermSchema = z.object({
  keyword: z.array(z.string()).describe("Search terms"),
});

// Defining the schema for feature extraction
const featureExtractionSchema = z.object({
  summary: z.array(z.string()).describe("A brief summary of the model's key features"),
});

const searchJsonSchema = zodToJsonSchema(searchTermSchema, "searchTermSchema");
const summaryJsonSchema = zodToJsonSchema(featureExtractionSchema,"featureExtractionSchema");

export async function generateSearchTerms(query: string): Promise<string[]> {
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/completions",
      {
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        prompt: `In a single word, what is the field of application of this query: "${query}". Provide 3 options.`,
        max_tokens: 100,
        temperature: 0.7,
        response_format: {
          type: "json_object",
          schema: searchJsonSchema,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
      },
    );

    const res = JSON.parse(response.data.choices[0].text);
    return res["keyword"];
  } catch (error) {
    console.error("Together AI error:", error);
    return [query];
  }
}

export async function summarizeModel(readMe: string, application: string): Promise<{
  summary: string;
}> {
  try {
    // Call the Together AI API to summarize all descriptions
        const response = await axios.post(
      "https://api.together.xyz/v1/completions",
      {
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        prompt: `Parse the following ReadMe.md page of a HuggingFace AI ${application} model description. Analyze the described model comparing it to other ${application} models. Output only a short one-sentence summary of your conclusion.

ReadMe.md: \n\n "${readMe}"`,
        max_tokens: 500,
        temperature: 0.9,
        response_format: {
          type: "json_object",
          schema: summaryJsonSchema,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
      },
    );

    const res = JSON.parse(response.data.choices[0].text);
    return {summary: res["summary"]};
  } catch (error) {
    console.error("Together AI feature summarization error:", error);
    return {
      summary: "Failed to analyze features",
    };
  }
}
