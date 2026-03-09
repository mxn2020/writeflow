import { action } from "./_generated/server";
import { v } from "convex/values";

const WRITING_MODE_PROMPTS: Record<string, string> = {
    blog: "Write a well-structured blog post with an engaging introduction, clear subheadings, and a compelling conclusion. Use markdown formatting for headers.",
    email: "Write a clear, well-structured email. Include a subject line suggestion at the top. Keep it appropriately concise.",
    essay: "Write a structured essay with a thesis statement, supporting paragraphs, and a thoughtful conclusion.",
    story: "Write a creative short story with vivid imagery, engaging characters, and a satisfying narrative arc.",
    social: "Write engaging social media content. Provide versions for different platforms (Twitter/X, LinkedIn, Instagram). Include suggested hashtags.",
    cover_letter: "Write a professional cover letter that highlights relevant skills and experience. Keep it to one page length.",
    ad_copy: "Write compelling advertising copy with a strong hook, key benefits, and a clear call-to-action. Provide a headline and body copy.",
    speech: "Write an engaging speech with a powerful opening, clear structure, rhetorical devices, and a memorable closing.",
    poem: "Write a poem with careful attention to rhythm, imagery, and emotional resonance. Let the form match the content.",
    script: "Write a script with clear scene descriptions, natural dialogue, and proper formatting (INT/EXT headers, character names, stage directions).",
};

const TONE_INSTRUCTIONS: Record<string, string> = {
    professional: "Use a professional, polished tone. Be authoritative and credible.",
    casual: "Use a relaxed, conversational tone. Be approachable and natural.",
    friendly: "Use a warm, friendly tone. Be encouraging and personable.",
    persuasive: "Use a persuasive, convincing tone. Appeal to logic and emotion.",
    humorous: "Use a witty, humorous tone. Be clever and entertaining without being frivolous.",
    formal: "Use a formal, dignified tone. Be precise and respectful.",
    inspirational: "Use an uplifting, motivational tone. Be empowering and energizing.",
    academic: "Use an academic, scholarly tone. Be analytical, well-cited, and objective.",
};

const STYLE_INSTRUCTIONS: Record<string, string> = {
    concise: "Keep the writing tight and focused. Every sentence should earn its place.",
    detailed: "Provide thorough, in-depth writing with examples and explanations.",
    storytelling: "Use narrative techniques — anecdotes, sensory details, and character-driven moments.",
    listicle: "Structure the content with numbered lists, bullet points, and scannable sections.",
    conversational: "Write as if having a one-on-one conversation with the reader. Use 'you' and 'we'.",
};

export const generate = action({
    args: {
        prompt: v.string(),
        writingMode: v.string(),
        tone: v.string(),
        style: v.optional(v.string()),
        additionalInstructions: v.optional(v.string()),
    },
    handler: async (_ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY is not configured in Convex environment variables.");
        }

        const modeInstruction = WRITING_MODE_PROMPTS[args.writingMode] || WRITING_MODE_PROMPTS.blog;
        const toneInstruction = TONE_INSTRUCTIONS[args.tone] || TONE_INSTRUCTIONS.professional;
        const styleInstruction = args.style ? (STYLE_INSTRUCTIONS[args.style] || "") : "";

        const systemPrompt = `You are WriterIQ, an expert AI writing assistant. You help users craft exceptional content across any format.

Your core principles:
- Produce publication-ready content that requires minimal editing
- Adapt your voice perfectly to the requested tone and style
- Structure content logically with proper formatting (use Markdown)
- Be creative and original — never generic or cookie-cutter

FORMAT INSTRUCTIONS:
${modeInstruction}

TONE INSTRUCTIONS:
${toneInstruction}

${styleInstruction ? `STYLE INSTRUCTIONS:\n${styleInstruction}` : ""}

${args.additionalInstructions ? `ADDITIONAL INSTRUCTIONS FROM USER:\n${args.additionalInstructions}` : ""}

Output the content in Markdown format. Do NOT wrap in code blocks — just output clean Markdown directly.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: args.prompt },
                ],
                temperature: 0.7,
                max_tokens: 4000,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API error: ${errorText}`);
        }

        const data = (await response.json()) as any;
        const content = data.choices?.[0]?.message?.content ?? "";

        if (!content) {
            throw new Error("AI returned empty content");
        }

        const wordCount = content.split(/\s+/).filter((w: string) => w.length > 0).length;

        return {
            content,
            wordCount,
            tokensUsed: data.usage?.total_tokens ?? 0,
        };
    },
});
