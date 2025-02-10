import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  console.log(req.body.title, req.body.description);

  if (!req.body.title || !req.body.description) {
    return next(errorHandler(400, "All fields are required"));
  }
  const slug = req.body.title
    .split(" ")
    .join("_")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res
      .status(201)
      .json({ savedPost: savedPost, message: "Post Published successfully!" });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  let { id } = req.params;
  console.log(id);

  try {
    const posts = await Post.find({
      $or: [{ userId: id }, { _id: id }],
    });

    const totalPosts = await Post.countDocuments();
    res.status(200).json({ posts, totalPosts });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
 
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "you are not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "post deleted!" });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  // console.log(req.user);

  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "you are not allowed to delete this post"));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          category: req.body.category,
          imageURL: req.body.imageURL,
          description: req.body.description,
        },
      },
      { new: true }
    );
    res.status(200).json({ updatedPost, message: "Post updated!" });
  } catch (error) {
    next(error);
  }
};
