import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import Lottie from "lottie-react";
import loginLottie from "../../assets/Lottifiles/Login.json";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn, googleSignIn } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn(form.email, form.password);
      const currentUser = result.user;
      if (currentUser) {
        await Swal.fire({
          position: "top-end",
          icon: "success",
          title: "SignIn Successful!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password.");
      console.log("sign in error message:", err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const result = await googleSignIn();
      const currentUser = result.user;
      if (currentUser) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "SignIn Successful!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Left - Lottie Animation */}
        <div className="hidden md:flex items-center justify-center bg-blue-100 dark:bg-blue-400 p-8">
          <Lottie animationData={loginLottie} loop className="w-72 h-72" />
        </div>

        {/* Right - Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 flex flex-col justify-center space-y-6"
          noValidate
        >
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100">
            Sign In
          </h2>

          {error && (
            <p className="text-center text-red-500 text-sm font-medium">{error}</p>
          )}

          <div className="flex flex-col space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              required
              onChange={handleChange}
              placeholder="you@example.com"
              className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <Input
              type="password"
              name="password"
              id="password"
              required
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Sign In
          </Button>

          <p className="text-center text-gray-600 dark:text-gray-400 font-medium">
            Or continue with
          </p>

          <div className="flex flex-col space-y-3 gap-2 sm:space-y-0 sm:space-x-4">
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-2 w-full"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle size={24} /> Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-2 w-full"
              // onClick={signInWithLinkedIn}
            >
              <FaLinkedin size={24} className="text-blue-700" /> LinkedIn
            </Button>
          </div>

          <p className="text-center text-sm text-gray-700 dark:text-gray-300">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Register now
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default SignIn;
