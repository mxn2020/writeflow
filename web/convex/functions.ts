import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveDocument = mutation({
    args: {
        title: v.string(),
        writingMode: v.string(),
        tone: v.string(),
        style: v.optional(v.string()),
        prompt: v.string(),
        generatedContent: v.string(),
        wordCount: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("documents", {
            title: args.title,
            writingMode: args.writingMode,
            tone: args.tone,
            style: args.style,
            prompt: args.prompt,
            generatedContent: args.generatedContent,
            wordCount: args.wordCount,
            isFavorite: false,
            createdAt: Date.now(),
        });
    },
});

export const getRecentDocuments = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("documents")
            .order("desc")
            .take(50);
    },
});

export const toggleFavorite = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const doc = await ctx.db.get(args.id);
        if (!doc) throw new Error("Document not found");
        await ctx.db.patch(args.id, { isFavorite: !doc.isFavorite });
    },
});

export const deleteDocument = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const getStatus = query({
    args: {},
    handler: async () => {
        return { status: "Online", timestamp: Date.now() };
    },
});
