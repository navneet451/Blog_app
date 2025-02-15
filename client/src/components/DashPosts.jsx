import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle, HiPencil, HiTrash } from "react-icons/hi";
import { toast } from "react-toastify";
const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getPosts/${currentUser.user._id}`, {
        withCredentials: true,
      });
        setUserPosts(res.data.posts);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.user.isAdmin) {
      fetchPosts();
    }
  }, [currentUser.user._id]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/deletepost/${currentUser.user._id}/${postIdToDelete}`
      , {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setUserPosts((prev) =>
        prev.filter((post) => post._id !== postIdToDelete)
      );
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-auto md:mx-auto p-6 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.user.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>Date Updated</TableHeadCell>
              <TableHeadCell>Post image</TableHeadCell>
              <TableHeadCell>Post title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
              <TableHeadCell>
                <span>edit</span>
              </TableHeadCell>
            </TableHead>
            {userPosts.map((post) => (
              <TableBody key={post._id} className="divide-y">
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-700">
                  <TableCell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post._id}`}>
                      <img
                        src={post.imageURL}
                        alt={post.title}
                        className="w-20 h-12 object-cover bg-gray-500"
                      />
                    </Link>
                  </TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <div
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="cursor-pointer group relative w-7 h-7 flex items-center justify-center dark:hover:text-white"
                    >
                      <HiTrash className="w-7 h-7 " />
                      <span className=" absolute left-full ml-2 bg-red-500 text-white text-md px-2 py-1 rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        Delete
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link to={`/update-post/${post._id}`}>
                      <div className="cursor-pointer group relative w-7 h-7 flex items-center justify-center  dark:hover:text-white">
                        <HiPencil className="w-7 h-7" />
                        <span className="absolute left-full ml-2 bg-teal-500 text-white text-md px-2 py-1 rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          Edit
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </>
      ) : (
        <p>You have no posts yet!</p>
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
              <Button color="failure" onClick={handleDeletePost}>
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

export default DashPosts;
