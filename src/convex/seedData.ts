import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const seedFoodItems = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to seed data");
    }

    const sampleItems = [
      {
        title: "Fresh Organic Apples",
        description: "Crisp red apples from the campus garden. Perfect for snacking or baking.",
        category: "Fruits & Vegetables",
        quantity: 5,
        unit: "kg",
        expiryDate: "2024-12-25",
        location: "Student Center Kitchen",
        allergens: [],
        donorId: user._id,
        status: "available" as const,
      },
      {
        title: "Leftover Pizza Slices",
        description: "Margherita pizza from student event. Still warm and delicious!",
        category: "Prepared Foods",
        quantity: 8,
        unit: "pieces",
        expiryDate: "2024-12-20",
        location: "Library Study Room 3",
        allergens: ["Gluten", "Dairy"],
        donorId: user._id,
        status: "available" as const,
      },
      {
        title: "Whole Grain Bread",
        description: "Freshly baked whole grain bread from campus bakery. Great for sandwiches.",
        category: "Bakery",
        quantity: 2,
        unit: "packages",
        expiryDate: "2024-12-22",
        location: "Dining Hall Main Entrance",
        allergens: ["Gluten"],
        donorId: user._id,
        status: "available" as const,
      },
      {
        title: "Mixed Salad Greens",
        description: "Fresh mixed greens including spinach, arugula, and lettuce. Perfect for healthy meals.",
        category: "Fruits & Vegetables",
        quantity: 1.5,
        unit: "kg",
        expiryDate: "2024-12-21",
        location: "Campus Greenhouse",
        allergens: [],
        donorId: user._id,
        status: "available" as const,
      },
      {
        title: "Yogurt Cups",
        description: "Assorted flavored yogurt cups. Great for breakfast or snacks.",
        category: "Dairy & Eggs",
        quantity: 12,
        unit: "pieces",
        expiryDate: "2024-12-23",
        location: "Residence Hall Common Room",
        allergens: ["Dairy"],
        donorId: user._id,
        status: "available" as const,
      }
    ];

    const results = [];
    for (const item of sampleItems) {
      const id = await ctx.db.insert("foodItems", item);
      results.push(id);
    }

    return { message: "Sample food items created successfully", itemIds: results };
  },
});