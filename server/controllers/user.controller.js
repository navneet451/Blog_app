import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.status(200).json({ message: "api is working" });
};

export const updateUser = async (req, res, next) => {
  // console.log(req.user);
  // console.log(req.params);
  // console.log(req.body);

  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You are not allowed to update it"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.userName) {
    if (req.body.userName.length < 7 || req.body.userName.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters")
      );
    }
    if (req.body.userName.includes(" ")) {
      return next(errorHandler(400, "Username can't contain spaces"));
    }
    if (!req.body.userName.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letter and numbers")
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    return res
      .status(200)
      .json({ user: rest, message: "User updated successfully!" });
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.id) {
    return next(errorHandler(403, "You are not allowed to delete it"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User Deleted Successfully!" });
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "You are Logged Out!" });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {

  if(!req.user.isAdmin){
   return next(errorHandler(403, "You are not admin"));
  }

  try {
    const users = await User.find();
    const usersWithoutPass = users.map((user) => {
      const {password, ...rest} = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    res.status(200).json({users:usersWithoutPass, totalUsers});
  } catch (error) {
    
  }
}

export const getUser = async (req, res, next) => {
  console.log(req.params);
  
  try {
    const user = await User.findById({_id:req.params.userId});
    if(!user){
      return next(errorHandler(404, "User not found!"));
    }
    const {password, ...rest} = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}