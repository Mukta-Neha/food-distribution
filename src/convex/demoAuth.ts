import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

export const demoLogin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to perform demo login");
    }

    const email = args.email.trim();
    const password = args.password; // Do not store password
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Update user email for display
    await ctx.db.patch(user._id, { email });

    // Record demo login (no password stored)
    await ctx.db.insert("demoLogins", {
      userId: user._id,
      email,
      lastLoginAt: Date.now(),
    });

    return { success: true };
  },
});
