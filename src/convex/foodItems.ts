import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    quantity: v.number(),
    unit: v.string(),
    expiryDate: v.string(),
    location: v.string(),
    imageUrl: v.optional(v.string()),
    allergens: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to create food items");
    }

    return await ctx.db.insert("foodItems", {
      ...args,
      donorId: user._id,
      status: "available" as const,
    });
  },
});

export const list = query({
  args: {
    status: v.optional(v.union(v.literal("available"), v.literal("claimed"), v.literal("expired"))),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let items;

    // Narrow status to exclude undefined for the index equality
    const status = args.status;
    if (status !== undefined) {
      items = await ctx.db
        .query("foodItems")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    } else {
      items = await ctx.db.query("foodItems").collect();
    }
    
    if (args.category && args.category !== "all") {
      return items.filter(item => item.category === args.category);
    }
    
    return items;
  },
});

export const claim = mutation({
  args: {
    itemId: v.id("foodItems"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to claim items");
    }

    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    if (item.status !== "available") {
      throw new Error("Item is no longer available");
    }

    await ctx.db.patch(args.itemId, {
      status: "claimed" as const,
      claimedBy: user._id,
      claimedAt: Date.now(),
    });

    return { success: true };
  },
});

export const getUserDonations = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("foodItems")
      .withIndex("by_donor", (q) => q.eq("donorId", user._id))
      .collect();
  },
});

export const getUserClaims = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("foodItems")
      .withIndex("by_claimed_by", (q) => q.eq("claimedBy", user._id))
      .collect();
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allItems = await ctx.db.query("foodItems").collect();
    
    const totalDonated = allItems.length;
    const totalClaimed = allItems.filter(item => item.status === "claimed").length;
    const totalAvailable = allItems.filter(item => item.status === "available").length;
    
    // Calculate estimated waste prevented (assuming average item weight of 0.5kg)
    const wastePreventedKg = totalClaimed * 0.5;
    
    return {
      totalDonated,
      totalClaimed,
      totalAvailable,
      wastePreventedKg,
    };
  },
});