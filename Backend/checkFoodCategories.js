require("dotenv").config();

const mongoose = require("mongoose");
const Food = require("./models/foodModel");

async function checkCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const result = await Food.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          examples: { $push: "$title" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkCategories();
