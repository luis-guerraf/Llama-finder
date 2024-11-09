import axios from "axios";

export async function checkAvailability(modelName: string): Promise<boolean> {
  try {
    const response = await axios.get(
      `https://api.featherless.ai/v1/models/${encodeURIComponent(modelName)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BRAVE_API_KEY}`,
        },
      }
    );
    return response.data.available || false;
  } catch (error) {
    console.error("Featherless API error:", error);
    return false;
  }
}
