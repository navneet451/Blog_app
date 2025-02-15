import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import {
  HiAnnotation,
  HiArrowRight,
  HiChartPie,
  HiDocumentText,
  HiUser,
  HiUserGroup,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import axios from "axios";
import { signOutSuccess } from "../redux/user/userSlice";
import { useSelector } from "react-redux";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    // console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignOut = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      dispatch(signOutSuccess());
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <Sidebar className="w-full md:-w-56">
      <SidebarItems>
        <SidebarItemGroup className="flex flex-col gap-1">
          <Link to={"/dashboard?tab=profile"}>
            <SidebarItem
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.user.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </SidebarItem>
          </Link>
          {currentUser.user.isAdmin && (
            <>
              <Link to={"/dashboard?tab=dashboard"}>
                <SidebarItem
                  active={tab === "dashboard"}
                  icon={HiChartPie}
                  as="div"
                >
                  Dashboard
                </SidebarItem>
              </Link>
              <Link to={"/dashboard?tab=posts"}>
                <SidebarItem
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  as="div"
                >
                  Posts
                </SidebarItem>
              </Link>
              <Link to={"/dashboard?tab=comments"}>
                <SidebarItem
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </SidebarItem>
              </Link>
              <Link to={"/dashboard?tab=users"}>
                <SidebarItem
                  active={tab === "users"}
                  icon={HiUserGroup}
                  as="div"
                >
                  Users
                </SidebarItem>
              </Link>
            </>
          )}

          <SidebarItem
            onClick={handleSignOut}
            icon={HiArrowRight}
            className="cursor-pointer"
          >
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
};

export default DashSidebar;
