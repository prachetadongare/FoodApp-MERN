require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDb = require("./config/db");
const User = require("./models/userModel");

async function createAdmin() {
  try {
    await connectDb();

    const email = "admin@foodapp.com";
    const password = "123456789";

    // Check whether this email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("An account with this email already exists.");
      console.log("Existing account type:", existingUser.usertype);
      return;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin account
    const admin = await User.create({
      userName: "FoodApp Admin",
      email: email,
      password: hashedPassword,
      phone: "9725368288",
      address: [],
      usertype: "admin",
      answer: "I Like to watch Sunsets",
    });

    console.log("Admin account created successfully!");
    console.log("Email:", admin.email);
    console.log("Account type:", admin.usertype);
    console.log("Now log in through your FoodApp Login page.");
  } catch (error) {
    console.error("Error creating admin:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
