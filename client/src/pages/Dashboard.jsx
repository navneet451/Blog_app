import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashComponents from "../components/DashComponents";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    // console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* SideBar */}
      <div>
        <DashSidebar />
      </div>
      {/* Profile and other things */}
      <div className="flex-1 flex items-center">
        {tab === "profile" && <DashProfile />}
        {/* Posts */}
        {tab === "posts" && <DashPosts />}
        {/* users */}
        {tab === "users" && <DashUsers />}
        {/* Comments */}
        {tab === "comments" && <DashComments />}
        {/* DAshboard Component */}
        { tab === "dashboard" && <DashComponents />}
      </div>
    </div>
  );
};

export default Dashboard;
