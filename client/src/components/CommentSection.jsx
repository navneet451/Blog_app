import { Button, Textarea } from "flowbite-react";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";

const CommentSection = ({ postId }) => {
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      toast.success("Comment shouldn't exceed 200 words");
      return;
    }

    try {
      const res = await axios.post("/api/comment/create", {
        content: comment,
        userId: currentUser.user._id,
        postId,
      });
      console.log(res);

      toast.success("Comment added!");
      setComment("");
      setComments([res.data, ...comments]);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Comment couldn't added! try again"
      );
      setComment("");
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get(`/api/comment/getcomments/${postId}`);
        setComments([...res.data, comment]);
      } catch (error) {
        console.log(error);
      }
    };
    getComments();
  }, [postId]);

  const handleEdit = async (comment, editedComment) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedComment } : c
      )
    );
  };
  const handleDelete = async () => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await axios.delete(`/api/comment/deletecomment/${commentToDelete}`);
      if (res.status === 200) {
        setComments(comments.filter((comment) => comment._id !== commentToDelete));
        toast.success(res.data?.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as: </p>&nbsp;&nbsp;
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.user.profilePicture}
            alt={currentUser.user.userName}
          />
          <Link to={"/dashboard?tab=profile"}>
            <p className="text-cyan-600 hover:underline">
              {currentUser.user.email}
            </p>
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be login to comment&nbsp;&nbsp;
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Login
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-sm text-gray-400">
              {" "}
              {200 - comment.length} words remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comment yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClick={() => setShowModal(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes i'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                no, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default CommentSection;
