const mongoose = require("mongoose");

//schema
const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "category title is required"],
    },
    imageUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHZ205Iei5ZhzPusXfR9otZV-CqjmrY6kdyUexGcbtJS8sjVXhgI_VdCqC&s=10",
    },
  },
  { timestamps: true },
);

//export
module.exports = mongoose.model("Category", categorySchema);
