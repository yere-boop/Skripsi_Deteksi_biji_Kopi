import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  inspections: defineTable({
    sampleName: v.string(),
    species: v.string(),
    roastLevel: v.string(),
    status: v.string(),
    score: v.number(),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
    defectLevel: v.optional(v.string()),
    aiSummary: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }),
});