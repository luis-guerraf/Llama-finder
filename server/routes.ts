import type { Express } from "express";
import { generateSearchTerms } from "./services/together";
import { searchModels } from "./services/huggingface";
import { checkAvailability } from "./services/featherless";

export function registerRoutes(app: Express) {
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      // Generate search terms using Together AI
      const searchTerms = await generateSearchTerms(query);
      console.log("Returned search keywords:", searchTerms);

      // Search for models using HuggingFace
      const models = await searchModels(searchTerms);
      console.log("Number of returned models:", models.length);

      // Check Featherless availability
      const modelsWithAvailability = await Promise.all(
        models.map(async (model) => ({
          ...model,
          featherlessAvailable: await checkAvailability(model.name),
        })),
      );

      // Separate Llama 3 models from alternatives
      const llama3Models = modelsWithAvailability.filter((m) =>
        m.name.toLowerCase().includes("llama-3"),
      );
      const alternatives = modelsWithAvailability.filter(
        (m) => !m.name.toLowerCase().includes("llama-3"),
      );

      res.json({
        llama3Models,
        alternatives,
        searchTerms,
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Failed to search models" });
    }
  });
}
