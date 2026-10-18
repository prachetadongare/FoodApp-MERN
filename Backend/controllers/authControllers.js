const userModel = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

//REGISTER

const registerController = async (req, res) => {
  try {
    const { userName, email, password, phone, address, usertype, answer } =
      req.body;

    // 1. Validate required fields
    if (
      !userName ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !usertype ||
      !answer
    ) {
      return res.status(400).send({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const allowedRoles = ["client", "vendor", "driver"];

    if (!allowedRoles.includes(usertype)) {
      return res.status(400).send({
        success: false,
        message: "Please select a valid account type",
      });
    }

    // 2. Check whether the user already exists
    const existing = await userModel.findOne({ email });

    if (existing) {
      return res.status(409).send({
        success: false,
        message: "User already exists",
      });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and save the user in MongoDB
    const user = await userModel.create({
      userName,
      email,
      password: hashedPassword,
      phone,
      address,
      usertype,
      answer,
    });

    // 5. Remove sensitive fields from the response
    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.answer;

    // 6. Send the successful response
    return res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user: safeUser,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Error in Register API",
    });
  }
};

//Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please fill all the fields",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User Not Found",
      });
    }

    //check user password | compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    //token
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //user.password = undefined; //to hide password in response
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login API",
      error,
    });
  }
};

module.exports = { registerController, loginController };
