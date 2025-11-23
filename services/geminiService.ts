import { GoogleGenAI } from "@google/genai";
import { Paper } from "../types";

const generateId = () => Math.random().toString(36).substr(2, 9);

export const searchPapersWithGemini = async (
  query: string,
  yearStart: number,
  yearEnd: number,
  minCitations: number,
  maxResults: number
): Promise<Paper[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prompt Strategy:
    // 1. Enforce a "Web Scraper" persona.
    // 2. Use Google Search operators specific to files and repositories.
    // 3. Explicitly ask for NO summaries, just metadata and links.
    
    const prompt = `
      TASK: You are a Research Paper Link Extractor.
      OBJECTIVE: Search for and list directly downloadable academic papers for the topic: "${query}".
      
      SEARCH CONSTRAINTS:
      - Date Range: ${yearStart} to ${yearEnd}.
      - Target Format: PDF files preferred (use 'filetype:pdf').
      - Sources: Google Scholar, PubMed, arXiv, ResearchGate, University Repositories.
      - Quantity: Find as many DISTINCT papers as possible (Aim for 20-40 high quality matches).
      
      SEARCH QUERIES TO EXECUTE INTERNALLY:
      1. "${query}" filetype:pdf ${yearStart}..${yearEnd}
      2. "${query}" site:nih.gov ${yearStart}..${yearEnd}
      3. "${query}" site:arxiv.org ${yearStart}..${yearEnd}
      
      OUTPUT REQUIREMENTS:
      - Return a raw JSON array.
      - DO NOT generate fake papers. Only return papers found in the search grounding.
      - For the URL: Prioritize the direct PDF link. If not found, use the landing page.
      - Citations: Estimate if not strictly visible, or set to 0.
      
      JSON STRUCTURE:
      [
        {
          "title": "Paper Title",
          "authors": ["Author Name"],
          "year": 2023,
          "citations": 12,
          "publisher": "Source/Journal",
          "url": "https://example.com/paper.pdf"
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Extract JSON from markdown code blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    
    let rawData = [];

    if (jsonMatch && jsonMatch[1]) {
      try {
        rawData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse JSON block", e);
      }
    } else {
        // Fallback: search for [ ... ]
        const start = text.indexOf('[');
        const end = text.lastIndexOf(']');
        if (start !== -1 && end !== -1) {
            try {
                rawData = JSON.parse(text.substring(start, end + 1));
            } catch (e) { console.error("Failed to parse raw array", e); }
        }
    }

    if (!Array.isArray(rawData)) return [];

    const papers = rawData.map((item: any) => ({
      id: generateId(),
      title: item.title || "Unknown Title",
      authors: Array.isArray(item.authors) ? item.authors : ["Unknown"],
      year: typeof item.year === 'number' ? item.year : parseInt(item.year) || yearEnd,
      citations: typeof item.citations === 'number' ? item.citations : 0,
      summary: "", // Removed summary to save tokens/space
      url: item.url || "#",
      publisher: item.publisher || "Web",
      selected: true,
    }))
    // We filter loosely to allow the user to see what was found, even if slightly outside range
    // But ideally we respect the range
    .filter(p => p.year >= yearStart && p.year <= yearEnd);
    
    return papers.sort((a, b) => b.year - a.year);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};