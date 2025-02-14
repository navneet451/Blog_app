import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { userName, email, password } = req.body;

  if (
    !userName ||
    !email ||
    !password ||
    userName === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // Check for duplicate email or username
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUser) {
      // If a user with the same email or username exists
      const duplicateField =
        existingUser.email === email ? "Email" : "Username";
      return next(errorHandler(409, `${duplicateField} already exists`));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(200).json({ message: "SignUp Success" });
  } catch (error) {
    return next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "Invalid email or password"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(400, "Invalid email or password"));
    }
    const token = jwt.sign(
      {
        id: validUser._id,
        isAdmin: validUser.isAdmin,
      },
      process.env.JWT_SECRET_KEY
    );
    // console.log("valid user ", validUser);
    const { password: pass, ...rest } = validUser._doc;
    return res
      .status(200)
      .cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
    sameSite: "none", // Allow cross-site cookies
  })
      .json({ user: rest, message: "Sign in success" });
  } catch (error) {
    return next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET_KEY
      );
      // console.log("valid user ", validUser);
      const { password: pass, ...rest } = user._doc;
      return res
        .status(200)
        .cookie("token", token, { httpOnly: true })
        .json({ user: rest, message: "Sign in success" });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-4) +
        Math.random().toString(36).slice(-4);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        userName:
          name.toLowerCase().split(" ").join("") +
          Math.floor(Math.random() * 10000).toString(),
        password: hashedPassword,
        email,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        {
          id: user._id,
          isAdmin: newUser.isAdmin,
        },
        process.env.JWT_SECRET_KEY
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("token", token)
        .json({ user: rest, message: "signIn success" });
    }
  } catch (error) {
    next(error);
  }
};
