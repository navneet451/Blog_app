import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
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
        <Route path="https://blog-app-frontend-ezw3.onrender.com" element={<Home />} />
        <Route path="https://blog-app-frontend-ezw3.onrender.com/about" element={<About />} />
        <Route path="https://blog-app-frontend-ezw3.onrender.com/sign-in" element={<SignIn />} />
        <Route path="https://blog-app-frontend-ezw3.onrender.com/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="https://blog-app-frontend-ezw3.onrender.com/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRote />}>
          <Route path="https://blog-app-frontend-ezw3.onrender.com/create-post" element={<CreatePost />} />
          <Route path="https://blog-app-frontend-ezw3.onrender.com/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="https://blog-app-frontend-ezw3.onrender.com/project" element={<Project />} />
        <Route path="https://blog-app-frontend-ezw3.onrender.com/post/:id" element={<PostPage />} />
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
};

export default App;
