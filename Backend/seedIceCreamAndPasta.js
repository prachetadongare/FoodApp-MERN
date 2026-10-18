require("dotenv").config();

const mongoose = require("mongoose");
const Food = require("./models/foodModel");
const Restaurant = require("./models/restaurantModel");

const newFoods = [
  // ICE CREAM — 5 items
  {
    title: "Classic Vanilla Ice Cream",
    description: "Creamy vanilla ice cream with a smooth, rich flavor.",
    price: 99,
    category: "Ice Cream",
    foodTags: "Vanilla, Ice Cream",
    code: "ICE001",
    restaurantTitle: "McDonald's",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800",
  },
  {
    title: "Chocolate Fudge Ice Cream",
    description: "Chocolate ice cream topped with rich chocolate fudge.",
    price: 149,
    category: "Ice Cream",
    foodTags: "Chocolate, Ice Cream",
    code: "ICE002",
    restaurantTitle: "Sweet Truth",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800",
  },
  {
    title: "Strawberry Ice Cream",
    description: "Sweet strawberry-flavored ice cream.",
    price: 119,
    category: "Ice Cream",
    foodTags: "Strawberry, Ice Cream",
    code: "ICE003",
    restaurantTitle: "Cafe Coffee Day",
    imageUrl:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800",
  },
  {
    title: "Cookies and Cream",
    description: "Creamy ice cream blended with crunchy cookie pieces.",
    price: 159,
    category: "Ice Cream",
    foodTags: "Cookies, Ice Cream",
    code: "ICE004",
    restaurantTitle: "Burger King",
    imageUrl:
      "https://images.unsplash.com/photo-1501446529957-6226bd447c46?w=800",
  },
  {
    title: "Mango Ice Cream",
    description: "Refreshing mango-flavored ice cream.",
    price: 129,
    category: "Ice Cream",
    foodTags: "Mango, Ice Cream",
    code: "ICE005",
    restaurantTitle: "Sweet Truth",
    imageUrl:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800",
  },

  // PASTA — 5 items
  {
    title: "Classic White Sauce Pasta",
    description: "Pasta in a creamy white sauce with herbs.",
    price: 249,
    category: "Pasta",
    foodTags: "White Sauce, Italian",
    code: "PAS001",
    restaurantTitle: "Domino's Pizza",
    imageUrl:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800",
  },
  {
    title: "Spicy Arrabbiata Pasta",
    description: "Pasta tossed in a spicy tomato and garlic sauce.",
    price: 229,
    category: "Pasta",
    foodTags: "Spicy, Tomato Sauce",
    code: "PAS002",
    restaurantTitle: "Pizza Hut",
    imageUrl:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800",
  },
  {
    title: "Creamy Mushroom Pasta",
    description: "Creamy pasta with mushrooms and Italian herbs.",
    price: 279,
    category: "Pasta",
    foodTags: "Mushroom, Creamy",
    code: "PAS003",
    restaurantTitle: "Cafe Coffee Day",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800",
  },
  {
    title: "Penne Alfredo",
    description: "Penne pasta in a rich and creamy Alfredo sauce.",
    price: 269,
    category: "Pasta",
    foodTags: "Penne, Alfredo",
    code: "PAS004",
    restaurantTitle: "Domino's Pizza",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800",
  },
  {
    title: "Cheesy Tomato Pasta",
    description: "Tomato-based pasta finished with melted cheese.",
    price: 239,
    category: "Pasta",
    foodTags: "Cheese, Tomato",
    code: "PAS005",
    restaurantTitle: "Pizza Hut",
    imageUrl:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800",
  },
];

async function seedFoods() {
  try {
    const mongoUri = process.env.MONGO_URL;

    if (!mongoUri) {
      throw new Error("MONGO_URL is missing from .env");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");

    let added = 0;
    let skipped = 0;

    for (const item of newFoods) {
      const restaurant = await Restaurant.findOne({
        title: item.restaurantTitle,
      });

      if (!restaurant) {
        throw new Error(
          `Restaurant "${item.restaurantTitle}" was not found. ` +
            "Check its exact title in MongoDB.",
        );
      }

      // Avoid adding the same seeded item twice.
      const existingFood = await Food.findOne({
        code: item.code,
      });

      if (existingFood) {
        console.log(`Already exists: ${item.title}`);
        skipped++;
        continue;
      }

      await Food.create({
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        foodTags: item.foodTags,
        code: item.code,
        restaurant: restaurant._id,
        imageUrl: item.imageUrl,
        isAvailable: true,
        rating: 4,
        ratingCount: "10",
      });

      console.log(`Added: ${item.title} -> ${restaurant.title}`);

      added++;
    }

    console.log("\nSeeding completed!");
    console.log(`Added: ${added}`);
    console.log(`Skipped existing items: ${skipped}`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedFoods();
