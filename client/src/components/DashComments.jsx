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
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { toast } from "react-toastify";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashComments = () => {

    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState();
  
    useEffect(() => {
      const fetchComments = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comment/getallcomments`);
          console.log(res.data);
          
          setComments(res.data.comments);
        } catch (error) {
          console.log(error);
        }
      };
      if (currentUser.user.isAdmin) {
        fetchComments();
      }
    }, []);
  
    const handleDeleteComment = async () => {
      setShowModal(false);
      try {
        const res = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/comment/deletecomment/${commentIdToDelete}`
        );
        toast.success(res.data.message);
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
      } catch (error) {
        toast.error(error.response?.data?.message);
        console.log(error);
      }
    };
  return (
   <div className="table-auto overflow-auto md:mx-auto px-8 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
         {currentUser.user.isAdmin && comments.length > 0 ? (
           <>
             <Table hoverable className="shadow-md">
               <TableHead>
                 <TableHeadCell>Date Created</TableHeadCell>
                 <TableHeadCell>Comment Content</TableHeadCell>
                 <TableHeadCell>UserId</TableHeadCell>
                 <TableHeadCell>PostId</TableHeadCell>
                 <TableHeadCell>Admin</TableHeadCell>
                 <TableHeadCell>Delete</TableHeadCell>
               </TableHead>
               {comments.map((comment) => (
                 <TableBody className="divide-y">
                   <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-700">
                     <TableCell>
                       {new Date(comment.createdAt).toLocaleDateString()}
                     </TableCell>
                     
                     <TableCell>{comment.content}</TableCell>
                     <TableCell>{comment.userId}</TableCell>
                     <TableCell>{comment.postId}</TableCell>
                     <TableCell>
                       {comment.isAdmin ? (
                         <FaCheck className="text-green-500" />
                       ) : (
                         <FaTimes className="text-red-500" />
                       )}
                     </TableCell>
                     <TableCell>
                       <div
                         onClick={() => {
                           setShowModal(true);
                           setCommentIdToDelete(comment._id);
                         }}
                         className="cursor-pointer group relative w-7 h-7 flex items-center justify-center dark:hover:text-white"
                       >
                         <HiTrash className="w-7 h-7" />
                         <span className=" absolute left-full ml-2 bg-red-500 text-white text-md px-2 py-1 rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                           Delete
                         </span>
                       </div>
                     </TableCell>
                   </TableRow>
                 </TableBody>
               ))}
             </Table>
           </>
         ) : (
           <p>You have no comments yet!</p>
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
                 Are you sure you want to delete this comment?
               </h3>
               <div className="flex justify-center gap-4">
                 <Button color="failure" onClick={handleDeleteComment}>
                   Yes! i'm sure
                 </Button>
                 <Button color="gray" onClick={() => setShowModal(false)}>
                   no!, cancel
                 </Button>
               </div>
             </div>
           </ModalBody>
         </Modal>
       </div>
  )
}

export default DashComments
