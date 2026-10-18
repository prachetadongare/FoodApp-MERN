require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Restaurant = require("./models/restaurantModel");
const Food = require("./models/foodModel");

const foods = JSON.parse(
  fs.readFileSync(path.join(__dirname, "foods-data.json"), "utf8"),
);

function normalizeTitle(title) {
  return title.trim().toLowerCase();
}

async function seedFoods() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!mongoUri) {
    throw new Error(
      "MongoDB connection string not found. Check your .env file.",
    );
  }

  await mongoose.connect(mongoUri);

  // Load all restaurants and match them by title.
  const restaurants = await Restaurant.find({});
  const restaurantMap = new Map();

  for (const restaurant of restaurants) {
    const key = normalizeTitle(restaurant.title);

    if (restaurantMap.has(key)) {
      throw new Error(`Duplicate restaurant title found: ${restaurant.title}`);
    }

    restaurantMap.set(key, restaurant);
  }

  let processed = 0;
  const missingRestaurants = new Set();

  for (const item of foods) {
    const restaurant = restaurantMap.get(normalizeTitle(item.restaurantTitle));

    if (!restaurant) {
      missingRestaurants.add(item.restaurantTitle);
      continue;
    }

    const foodDocument = {
      title: item.title,
      description: item.description,
      price: item.price,
      ...(item.imageUrl ? { imageUrl: item.imageUrl } : {}),
      foodTags: item.foodTags,
      category: item.category,
      code: item.code,
      isAvailable: item.isAvailable,
      restaurant: restaurant._id,
      rating: item.rating,
      ratingCount: item.ratingCount,
    };

    // Update an existing record with the same food code,
    // or insert it if it does not exist.
    await Food.findOneAndUpdate(
      { code: item.code },
      { $set: foodDocument },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    processed++;
  }

  console.log(`Food seeding completed. Added/updated ${processed} food items.`);

  if (missingRestaurants.size > 0) {
    console.warn("These restaurant titles were not found:");

    for (const title of missingRestaurants) {
      console.warn(`- ${title}`);
    }
  }

  await mongoose.disconnect();
}

seedFoods().catch(async (error) => {
  console.error("Food seeding failed:", error.message);

  try {
    await mongoose.disconnect();
  } catch {}

  process.exitCode = 1;
});
