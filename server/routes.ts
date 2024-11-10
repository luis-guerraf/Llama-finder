import type { Express } from "express";
import { generateSearchTerms, summarizeModel } from "./services/together";
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

      // Process all models summaries
      await Promise.all(
        models.map(async (model) => {
          const { summary } = await summarizeModel(model.readMe, searchTerms[0]);
          model.summary = summary;
        }),
      );

      // Check Featherless availability in parallel
      await Promise.all(
        models.map(async (model) => {
          const featherlessAvailable = await checkAvailability(model.name);
          model.featherlessAvailable = featherlessAvailable;
        }),
      );

      // Separate Llama 3 models from alternatives
      const llama3Models = models.filter((m) =>
        m.name.toLowerCase().includes("llama-3"),
      );
      const alternatives = models.filter(
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
