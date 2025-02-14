import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

const Comment = ({ comment, onEdit, onDelete }) => {
  console.log(comment);
  
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!comment?.userId) return;
    const getUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${comment.userId}`);
        console.log(res);
        setUser(res.data);
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/comment/editcomment/${comment._id}`, {
        content: editedComment,
      });
      setIsEditing(false);
      onEdit(comment, editedComment);
      toast.success("Comment edited!");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Comment couldn't edited");
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.email}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `${user.userName}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedComment}
              rows={3}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                outline
                gradientDuoTone="purpleToPink"
                onClick={() => setIsEditing(false)}
              >
                cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-2">{comment.content}</p>
            {currentUser &&
              (currentUser.user._id === comment.userId ||
                currentUser.user.isAdmin) && (
                <div className="flex flex-row gap-2 ">
                  <button
                    onClick={handleEdit}
                    type="button"
                    className="text-gray-400 hover:text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(comment._id)}
                    type="button"
                    className="text-gray-400 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
          </>
        )}
        
      </div>
    </div>
  );
};

export default Comment;
