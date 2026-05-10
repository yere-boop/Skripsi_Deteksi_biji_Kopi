import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("inspections").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("inspections") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const inspections = await ctx.db.query("inspections").collect();

    const total = inspections.length;
    const completed = inspections.filter(
      (item) => item.status === "Selesai"
    ).length;

    const scoredItems = inspections.filter((item) => item.score > 0);
    const averageScore =
      scoredItems.length > 0
        ? Math.round(
            scoredItems.reduce((sum, item) => sum + item.score, 0) /
              scoredItems.length
          )
        : 0;

    return {
      total,
      completed,
      averageScore,
    };
  },
});

export const create = mutation({
  args: {
    sampleName: v.string(),
    species: v.string(),
    roastLevel: v.string(),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
    defectLevel: v.optional(v.string()),
    aiSummary: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("inspections", {
      sampleName: args.sampleName,
      species: args.species,
      roastLevel: args.roastLevel,
      status: "Selesai",
      score: args.score,
      location: args.location,
      notes: args.notes,
      defectLevel: args.defectLevel,
      aiSummary: args.aiSummary,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });

    return "Data inspeksi berhasil disimpan";
  },
});

export const remove = mutation({
  args: {
    id: v.id("inspections"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return "Data inspeksi berhasil dihapus";
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("inspections").collect();

    if (existing.length > 0) {
      return "Data sudah ada";
    }

    await ctx.db.insert("inspections", {
      sampleName: "Arabika Toraja 01",
      species: "Arabika",
      roastLevel: "Medium Roast",
      status: "Selesai",
      score: 89,
      location: "Toraja",
      notes: "Sampel dengan kualitas baik",
      defectLevel: "Rendah",
      aiSummary: "Model mendeteksi kualitas baik dengan cacat fisik minimal.",
      imageUrl: "",
      createdAt: Date.now(),
    });

    await ctx.db.insert("inspections", {
      sampleName: "Robusta Minahasa 02",
      species: "Robusta",
      roastLevel: "Dark Roast",
      status: "Tersimpan",
      score: 84,
      location: "Minahasa",
      notes: "Aroma kuat dan body tebal",
      defectLevel: "Sedang",
      aiSummary:
        "Model mendeteksi kualitas cukup baik dengan beberapa cacat ringan.",
      imageUrl: "",
      createdAt: Date.now(),
    });

    await ctx.db.insert("inspections", {
      sampleName: "Arabika Gayo 03",
      species: "Arabika",
      roastLevel: "Light Roast",
      status: "Diproses",
      score: 0,
      location: "Gayo",
      notes: "Masih dalam proses evaluasi",
      defectLevel: "Belum dianalisis",
      aiSummary: "Data masih menunggu analisis.",
      imageUrl: "",
      createdAt: Date.now(),
    });

    return "Seed berhasil";
  },
});