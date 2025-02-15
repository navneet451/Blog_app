import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "flowbite-react";
import CommentSection from "../components/CommentSection";

const PostPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchPost = async () => {
      try {
        const post = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getposts/${id}`, {
        withCredentials: true,
      });
        // console.log(post);
        setPost(post.data.posts[0]);
        setLoading(false);
        // toast.success("Post fetched successfully!");
      } catch (error) {
        console.log(error);
        setLoading(false);
        // toast.error("Something went wrong! try again");
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <main className="flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl ">
        {post && post.title}
      </h1>
      <p className="mx-auto max-w-2xl text-teal-500 mt-5">{post && post.category}</p>
      <img
        src={post && post.imageURL}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <span className="p-3 mx-auto text-xs max-w-2xl border-b border-slate-500 ">
        {post && new Date(post.createdAt).toLocaleDateString()}
      </span>
      <div className="p-3 max-w-2xl mx-auto w-full post-description" dangerouslySetInnerHTML={{ __html: post && post.description }}></div>
      <CommentSection postId={post._id}/>
    </main>
  );
};

export default PostPage;
