import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Simple hash function for password (for demo/skripsi purposes)
// In production, use bcrypt or similar
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Add salt-like prefix to make it look more like a hash
  return "h$" + Math.abs(hash).toString(36) + "$" + str.length;
}

export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      return { success: false, message: "Email sudah terdaftar" };
    }

    // Validate inputs
    if (!args.name.trim()) {
      return { success: false, message: "Nama wajib diisi" };
    }
    if (!args.email.trim() || !args.email.includes("@")) {
      return { success: false, message: "Email tidak valid" };
    }
    if (args.password.length < 6) {
      return { success: false, message: "Password minimal 6 karakter" };
    }

    // Create user
    const userId = await ctx.db.insert("users", {
      name: args.name.trim(),
      email: args.email.toLowerCase().trim(),
      password: simpleHash(args.password),
      createdAt: Date.now(),
    });

    return {
      success: true,
      message: "Registrasi berhasil!",
      userId: userId,
      user: { name: args.name.trim(), email: args.email.toLowerCase().trim() },
    };
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .first();

    if (!user) {
      return { success: false, message: "Email atau password salah" };
    }

    const hashedInput = simpleHash(args.password);
    if (user.password !== hashedInput) {
      return { success: false, message: "Email atau password salah" };
    }

    return {
      success: true,
      message: "Login berhasil!",
      user: { id: user._id, name: user.name, email: user.email },
    };
  },
});

export const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) return null;
    return { id: user._id, name: user.name, email: user.email };
  },
});
