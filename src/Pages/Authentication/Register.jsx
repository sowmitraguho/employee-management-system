import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import Lottie from "lottie-react";
import registerAnimation from "../../assets/Lottifiles/register-lottie.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/useAxios";
import axios from "axios";
import { motion } from "framer-motion";

const Register = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "User",
    email: "",
    password: "",
    role: "Employee",
    designation: "Representative",
    salary: "55000",
    bankAccountNo: "AC25647894566",
    photoURL: "",
  });

  const baseURL = import.meta.env.VITE_API_URL;
  const { createUser, googleSignIn, updateUser } = useContext(AuthContext);
  const { postData } = useAxios(baseURL);
  const navigate = useNavigate();

  // handle text inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // image upload
  const handleImageChange = async (e) => {
    setImageFile(e.target.files[0]);
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_imgbbApiKey
        }`,
        formData
      );
      if (!response) return;
      setImageUrl(response.data.data.display_url);
    } catch (err) {
      Swal.fire({
        title: err.message,
        icon: "error",
        draggable: true,
      });
    }
  };

  // password validation
  const validatePassword = (password) => {
    return (
      /[A-Z]/.test(password) &&
      /[^a-zA-Z0-9]/.test(password) &&
      password.length >= 6
    );
  };

  // register submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!imageFile) {
      setError("Please select an image");
      return;
    }

    if (!validatePassword(form.password)) {
      setError(
        "Password must be 6+ chars, include 1 capital & 1 special char."
      );
      return;
    }

    try {
      const registeredUser = await createUser(form.email, form.password);
      const currentUser = registeredUser.user;

      if (currentUser.uid) {
        const updatedUserData = {
          displayName: form.name,
          photoURL: imageUrl,
        };

        updateUser(updatedUserData).then(async () => {
          const fullForm = { ...form, imageUrl };
          console.log('users info', fullForm);
          const result = await postData("/users", fullForm);
          if (result) console.log("User created:", result);

          await Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Registration Successful!",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/");
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // google sign in
  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const result = await googleSignIn();
      const currentUser = result.user;

      if (currentUser) {
        await postData("/users", {
          name: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          role: "employee",
          designation: "Representative",
          bankAccountNo: "Acc257739767",
          status: "active",
          isVerified: true,
          imageUrl: currentUser.photoURL,
          salary: 25000,
          Salary: 25000
        });

        await Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registration Successful!",
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-2xl overflow-hidden bg-white dark:bg-gray-900"
      >
        {/* Left Section - Register Form */}
        <div className="p-8 sm:p-10 space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <Label className='mb-2'>Your Full Name</Label>
              <Input type="text" name="name" required onChange={handleChange} />
            </div>

            {/* Role */}
            <div>
              <Label className='mb-2'>Select Role</Label>
              <select
                name="role"
                required
                onChange={handleChange}
                className="w-full mt-1 rounded-md border px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">-- Select Role --</option>
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
              </select>
            </div>

            {/* Designation only for Employee */}
            {form.role === "employee" && (
              <div>
                <Label className='mb-2'>Designation</Label>
                <select
                  name="designation"
                  required
                  onChange={handleChange}
                  className="w-full mt-1 rounded-md border px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="">-- Select Designation --</option>
                  <option value="software_engineer">Software Engineer</option>
                  <option value="frontend_developer">
                    Frontend Developer
                  </option>
                  <option value="backend_developer">Backend Developer</option>
                  <option value="fullstack_developer">
                    Full Stack Developer
                  </option>
                  <option value="ui_ux_designer">UI/UX Designer</option>
                  <option value="qa_engineer">QA Engineer</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="product_manager">Product Manager</option>
                  <option value="devops_engineer">DevOps Engineer</option>
                  <option value="team_lead">Team Lead</option>
                </select>
              </div>
            )}

            {/* Bank Account */}
            <div>
              <Label className='mb-2'>Bank Account No</Label>
              <Input
                type="text"
                name="bankAccountNo"
                required
                onChange={handleChange}
              />
            </div>

            {/* Salary */}
            <div>
              <Label className='mb-2'>Salary</Label>
              <Input
                type="text"
                name="salary"
                required
                onChange={handleChange}
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label className='mb-2'>Upload Your Image</Label>
              <input
                className="border border-gray-300 p-2 rounded-md w-full dark:border-gray-700"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label className='mb-2'>Email</Label>
              <Input
                type="email"
                name="email"
                required
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <Label className='mb-2'>Password</Label>
              <Input
                type="password"
                name="password"
                required
                onChange={handleChange}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!imageUrl}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500"
            >
              Register
            </Button>
          </form>

          {/* Social Sign-up */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Or sign up with
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle size={20} /> Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <FaLinkedin size={20} className="text-blue-700" /> LinkedIn
            </Button>
          </div>

          {/* Login Link */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>

        {/* Right Section - Lottie Animation */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-6">
          <Lottie animationData={registerAnimation} loop className="w-72 h-72" />
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
