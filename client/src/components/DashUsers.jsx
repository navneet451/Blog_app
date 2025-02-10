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
const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`/api/getusers`);
        setUsers(res.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.user.isAdmin) {
      fetchUsers();
    }
  }, [currentUser.user._id]);

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(
        `/api/user/${userIdToDelete}`
      );
      toast.success(res.data.message);
      setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-auto md:mx-auto px-8 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.user.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>Date Created</TableHeadCell>
              <TableHeadCell>User Image</TableHeadCell>
              <TableHeadCell>User Name</TableHeadCell>
              <TableHeadCell>User Email</TableHeadCell>
              <TableHeadCell>Admin</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            {users.map((user) => (
              <TableBody className="divide-y">
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-700">
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <img
                      src={user.profilePicture}
                      alt={user.userName}
                      className="w-12 h-12 rounded-full object-cover bg-gray-500"
                    />
                  </TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
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
        <p>You have no users yet!</p>
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
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
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
  );
};

export default DashUsers;
