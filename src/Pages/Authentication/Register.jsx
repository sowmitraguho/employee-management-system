import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import Lottie from "lottie-react";
import registerAnimation from "@/assets/Lottifiles/register-lottie.json"; // Download from LottieFiles
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//import { useAuth } from "@/context/AuthContext"; // Your custom AuthContext
//import { toast } from "@/components/ui/use-toast";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import Swal from "sweetalert2";

const Register = () => {
  //const { registerWithEmail, signInWithGoogle, signInWithLinkedIn } = useAuth();
  const { createUser, googleSignIn, updateUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  //const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    return /[A-Z]/.test(password) && /[^a-zA-Z0-9]/.test(password) && password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validatePassword(form.password)) {
      setError("Password must be 6+ chars, include 1 capital & 1 special char.");
      return;
    }
    console.log(form);
    try {
      const registeredUser = await createUser(form.email, form.password);
      const currentUser = registeredUser.user;
      console.log(currentUser);
      if (currentUser.uid) {
        const updatedUserData = { displayName: form.name, photoURL: "" };
        updateUser(updatedUserData)
          .then(() => {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Registration Successfull!",
              showConfirmButton: false,
              timer: 1500
            });
          })
          navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const result = await googleSignIn();
      const currentUser = result.user;
      console.log('from register page',currentUser);
      if (currentUser) {
        Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Registration Successful!",
              showConfirmButton: false,
              timer: 1500
            });
      }
    } catch(err){
      setError(err.message)
    }
  }

  return (
    <div className="p-20">
      <div className="min-h-screen max-w-7xl flex items-center justify-around bg-gray-50 dark:bg-gray-950 px-4">
        <div className="flex-1 w-full bg-white dark:bg-gray-900 shadow-md rounded-lg border border-green-500">


          {/* Right Side - Register Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center">Create an Account</h2>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input type="text" name="name" required onChange={handleChange} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" required onChange={handleChange} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" required onChange={handleChange} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Select Role</Label>
              <select
                name="role"
                required
                onChange={handleChange}
                className="w-full mt-1 rounded border px-3 py-2 dark:bg-gray-800"
              >
                <option value="">-- Select Role --</option>
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                {/* Do NOT allow Admin registration from frontend */}
              </select>
            </div>

            <Button type="submit" className="w-full">
              Register
            </Button>

            <div className="text-center text-sm">Or sign up with</div>

            <div className="">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 mb-2"
               onClick={handleGoogleSignIn}
              >
                <FcGoogle size={20} /> Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              // onClick={signInWithLinkedIn}
              >
                <FaLinkedin size={20} className="text-blue-700" /> LinkedIn
              </Button>
            </div>

            <p className="text-xs text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </div>
        {/* Left Side - Lottie Animation */}
        <div className="p-6 hidden md:flex flex-1 items-center justify-center ">
          <Lottie animationData={registerAnimation} loop={true} className="w-80 h-80" />
        </div>
      </div>
    </div>
  );
};

export default Register;
