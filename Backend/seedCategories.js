require("dotenv").config();

const mongoose = require("mongoose");
const Category = require("./models/categoryModel");

const categories = [
  { title: "Pizza" },
  { title: "Burgers" },
  { title: "Biryani" },
  { title: "Chinese" },
  { title: "South Indian" },
  { title: "North Indian" },
  { title: "Thali" },
  { title: "Sandwiches" },
  { title: "Pasta" },
  { title: "Rolls & Wraps" },
  { title: "Desserts" },
  { title: "Cakes & Pastries" },
  { title: "Ice Cream" },
  { title: "Healthy Food" },
  { title: "Beverages" },
];

async function seedCategories() {
  try {
    const mongoUri = process.env.MONGO_URL;

    if (!mongoUri) {
      throw new Error("MONGO_URL is missing from your .env file");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");

    let added = 0;
    let skipped = 0;

    for (const item of categories) {
      const existingCategory = await Category.findOne({
        title: item.title,
      });

      if (existingCategory) {
        skipped++;
        continue;
      }

      await Category.create(item);
      added++;
    }

    console.log(`Categories added: ${added}`);
    console.log(`Categories already present: ${skipped}`);
  } catch (error) {
    console.error("Category seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCategories();
