import axios from "axios";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Defining the schema for search terms
const searchTermSchema = z.object({
  keyword: z.array(z.string()).describe("Search terms"),
});

// Defining the schema for feature extraction
const featureExtractionSchema = z.object({
  features: z.array(z.object({
    capability: z.string().describe("The specific capability or feature"),
    confidence: z.number().min(0).max(1).describe("Confidence score for this feature"),
  })).describe("List of model capabilities with confidence scores"),
  summary: z.string().describe("A brief summary of the model's key features"),
});

const searchJsonSchema = zodToJsonSchema(searchTermSchema, "searchTermSchema");
const featureJsonSchema = zodToJsonSchema(featureExtractionSchema, "featureExtractionSchema");

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
    return Array.isArray(res["keyword"]) ? res["keyword"] : [];
  } catch (error) {
    console.error("Together AI error:", error);
    return [query];
  }
}

export async function summarizeModelFeatures(description: string): Promise<{
  features: Array<{ capability: string; confidence: number }>;
  summary: string;
}> {
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/completions",
      {
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        prompt: `Analyze this AI model description and extract its key capabilities and features. For each feature, provide a confidence score (0-1) based on how clearly it's stated in the description. Also provide a brief summary.

Description: "${description}"

Provide the response in JSON format with features array containing capability and confidence pairs, and a summary field.`,
        max_tokens: 500,
        temperature: 0.3,
        response_format: {
          type: "json_object",
          schema: featureJsonSchema,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
      },
    );

    const result = JSON.parse(response.data.choices[0].text);
    return {
      features: result.features || [],
      summary: result.summary || "No summary available",
    };
  } catch (error) {
    console.error("Together AI feature summarization error:", error);
    return {
      features: [],
      summary: "Failed to analyze features",
    };
  }
}
