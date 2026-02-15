import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import * as cheerio from "cheerio";

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // 1. Fetch page content (metadata)
        let pageTitle = "";
        let pageDescription = "";
        let pageContent = "";

        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            });
            const html = await response.text();
            const $ = cheerio.load(html);

            pageTitle = $("title").text().trim() || "";
            pageDescription = $('meta[name="description"]').attr("content")?.trim() ||
                $('meta[property="og:description"]').attr("content")?.trim() || "";

            // Get some body text for context if description is missing
            if (!pageDescription) {
                pageContent = $("body").text().replace(/\s+/g, " ").substring(0, 1000);
            }

        } catch (fetchError) {
            console.warn("Failed to fetch page metadata:", fetchError);
            // Construct a basic fallback if fetch fails
            pageTitle = "Page";
        }

        // 2. Call Groq for smart suggestions
        const prompt = `
Analyze this webpage info:
URL: ${url}
Title: ${pageTitle}
Description: ${pageDescription}
Content Snippet: ${pageContent}

Task:
1. Generate 3-4 alternative title suggestions (each max 50 chars). Make them concise, descriptive, and varied.
2. Write a 1-2 sentence summary (max 150 chars).
3. Suggest 4-6 relevant tags (single words, lowercase, no spaces).

Return JSON ONLY:
{
  "titleOptions": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "summary": "...",
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4"]
}
    `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates structured JSON for bookmark metadata. Always return valid JSON with diverse, concise title options and relevant single-word tags.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama3-8b-8192",
            temperature: 0.7,
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

        return NextResponse.json(result);

    } catch (error) {
        console.error("AI Enhance Error:", error);
        return NextResponse.json(
            { error: "Failed to enhance bookmark" },
            { status: 500 }
        );
    }
}
