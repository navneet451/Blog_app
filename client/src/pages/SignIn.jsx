import axios from "axios";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
// import Oauth from "../components/Oauth";

const SignIn = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const {loading, error}  = useSelector((state)=>state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    dispatch(signInStart());
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/signin`, {
        email:email,
        password:password,
      },{withCredentials: true,});
      console.log(res);
      toast.success(res.data.message);
      dispatch(signInSuccess(res.data));
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      dispatch(signInFailure(error.response?.data?.message));
    } finally {
      // Clear fields regardless of success or failure
      setEmail("");
      setPassword("");
      // setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left section */}
        <div className="flex-1">
          <Link to={"/"} className="text-4xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Navneet's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-3">
            This is blogingly You can signin with email and pasword or with
            Google
          </p>
        </div>
        {/*Right section*/}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-2">
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="ex@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
             // disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
           
          </form>
          <div>
            <span>
              Don't have an account?&nbsp;&nbsp;
              <Link to={"/sign-up"} className="text-blue-500">
                Sign Up
              </Link>
            </span>
          </div>
          {/* {error && <Alert className="mt-4" color="failure">{error}</Alert>} */}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
