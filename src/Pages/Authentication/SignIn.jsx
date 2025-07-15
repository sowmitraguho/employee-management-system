import React, { useContext } from 'react';
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Lottie from "lottie-react";
import loginLottie from "@/assets/Lottifiles/login-lottie.json"; // You can get one from lottiefiles.com
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { AuthContext } from '../../Contexts/AuthContext/AuthContext';
import Swal from 'sweetalert2';


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
          console.log('login page user', currentUser);
          if (currentUser) {
            await Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "SignIn Successful!",
                  showConfirmButton: false,
                  timer: 1500
                });
                navigate('/');
          }
        } catch (err) {
          setError("Invalid email or password.");
          console.log('sign in error message:',err.message);
        }
    };
    const handleGoogleSignIn = async () => {
        setError("");
        try {
          const result = await googleSignIn();
          const currentUser = result.user;
          console.log('from register page', currentUser);
          if (currentUser) {
            Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "SignIn Successful!",
                  showConfirmButton: false,
                  timer: 1500
                });
                navigate('/');
          }
        } catch(err){
          setError(err.message)
        }
      }
    return (
        <div className="p-20 h-screen w-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('https://t3.ftcdn.net/jpg/08/68/51/04/360_F_868510427_vsvN67LV1zSmLMyXMOFG05tRCmTAj1xL.jpg')" }}>
            <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
                <div className="max-w-5xl w-full bg-white bg-opacity-10 shadow-md rounded-lg grid md:grid-cols-2 dark:bg-gray-900">
                    {/* Lottie animation */}
                    <div className="hidden md:flex items-center justify-center p-6">
                        <Lottie animationData={loginLottie} loop className="w-80 h-80" />
                    </div>

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-center">Sign In</h2>

                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                required
                                onChange={handleChange}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                required
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>

                        <div className="text-center text-sm">Or continue with</div>

                        <div className="flex flex-col gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                            onClick={handleGoogleSignIn}
                            >
                                <FcGoogle size={20} /> Google
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                            //onClick={signInWithLinkedIn}
                            >
                                <FaLinkedin size={20} className="text-blue-700" /> LinkedIn
                            </Button>
                        </div>

                        <p className="text-xs text-center">
                            Don’t have an account?{" "}
                            <Link to="/register" className="text-blue-500 hover:underline">
                                Register now
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;