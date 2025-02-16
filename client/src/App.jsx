import React from "react";
import { Route, Routes, BrowserRouter,Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import Header from "./components/Header";
import FooterComponent from "./components/FooterComponent";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRote from "./components/OnlyAdminPrivateRote";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRote />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/project" element={<Project />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
};

export default App;
