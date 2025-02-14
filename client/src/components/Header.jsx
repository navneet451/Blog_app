import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { toast } from "react-toastify";
import { signOutSuccess } from "../redux/user/userSlice";
import axios from "axios";
const Header = () => {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  // console.log(path);
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
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
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Navneet's
        </span>
        Blog
      </Link>
      
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.user.profilePicture}
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">
                @{currentUser.user.userName}
              </span>
              <span className="block text-sm">{currentUser.user.email}</span>
            </DropdownHeader>
            <Link to={"/dashboard?tab=profile"}>
              <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"}>
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink active={path === "/"} as={"div"}>
          <Link to={"/"}>Home</Link>
        </NavbarLink>
        <NavbarLink active={path === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </NavbarLink>
        <NavbarLink active={path === "/project"} as={"div"}>
          <Link to={"/project"}>Projects</Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
};

export default Header;
