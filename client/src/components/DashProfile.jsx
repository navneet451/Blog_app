import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signOutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const DashProfile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [updateUserName, setUpdateUserName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(currentUser);

    try {
      dispatch(updateStart());
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/${currentUser.user._id}`,
        {
          userName: updateUserName,
          email: updateEmail,
          password: updatePassword,
        },
        { withCredentials: true }
      );
      console.log(res);
      toast.success(res.data.message);
      dispatch(updateSuccess(res.data));
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Something went Wrong! try again"
      );
      dispatch(updateFailure(error.response?.data?.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/${currentUser.user._id}`);
      toast.success(res.data.message);
      dispatch(deleteSuccess(res.data));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong try again"
      );
      dispatch(deleteFailure(error.response?.data?.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user`);
      toast.success(res.data.message);
      dispatch(signOutSuccess());
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="h-32 w-32 self-center cursor-pointer shadow-md rounded-full">
          <img
            src={currentUser.user.profilePicture}
            alt="user image"
            className="rounded-full object-cover h-full w-full border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          placeholder="username"
          defaultValue={currentUser.user.userName}
          onChange={(e) => setUpdateUserName(e.target.value)}
        />
        <TextInput
          type="email"
          placeholder="email"
          defaultValue={currentUser.user.email}
          onChange={(e) => setUpdateEmail(e.target.value)}
        />
        <TextInput
          type="password"
          placeholder="********"
          onChange={(e) => setUpdatePassword(e.target.value)}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
        {currentUser.user.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a Post
            </Button>
          </Link>
        )}
      </form>
      <div className="flex justify-between mt-5 text-red-500">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign Out
        </span>
      </div>
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
              Are you sure you want to delete your account
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
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

export default DashProfile;
