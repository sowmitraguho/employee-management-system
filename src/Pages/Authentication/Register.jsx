import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import Lottie from "lottie-react";
import registerAnimation from "@/assets/Lottifiles/register-lottie.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/useAxios";
import axios from "axios";

const Register = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const { createUser, googleSignIn, updateUser } = useContext(AuthContext);
  const { postData } = useAxios('https://employee-management-system-server-3k7l.onrender.com');
  const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  role: "",
  designation: "",
  salary: "",
  bankAccountNo: "",
  photoURL: ""
});
  const navigate = useNavigate();
  const [error, setError] = useState("");

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleImageChange = async (e) => {
    setImageFile(e.target.files[0]);
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
     
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbbApiKey}`, formData);
      if(!response) return;
      setImageUrl(response.data.data.display_url);
      //console.log('Image uploaded:', response.data.data.display_url);
    } catch (err) {
      //console.error('Image upload error:', error);
      setError(err.message)
    }
  };


const validatePassword = (password) => {
  return /[A-Z]/.test(password) && /[^a-zA-Z0-9]/.test(password) && password.length >= 6;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!imageFile) {
    setError("Please select an image");
    return;
  } 

  if (!validatePassword(form.password)) {
    setError("Password must be 6+ chars, include 1 capital & 1 special char.");
    return;
  }
  //console.log('all form data',form);
  try {
    const registeredUser = await createUser(form.email, form.password);
    const currentUser = registeredUser.user;
    console.log(currentUser);
    if (currentUser.uid) {
      const updatedUserData = { displayName: form.name, photoURL: imageUrl };
      updateUser(updatedUserData)
        .then(async () => {
          //upload user data in mongodb
          const fullForm = {...form, imageUrl}
          const result = await postData('/users', fullForm);
          if (result) {
            console.log('User created:', result);
          }
          // success toast
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
    console.log('from register page', currentUser);
    if (currentUser) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Registration Successful!",
        showConfirmButton: false,
        timer: 1500
      });
    }
  } catch (err) {
    setError(err.message)
  }
}

return (
  <div className="p-20">
    <div className="min-h-screen max-w-7xl flex items-center justify-around bg-gray-50 dark:bg-gray-950 px-4">
      <div className="flex-1 w-full bg-white dark:bg-gray-900 shadow-md rounded-lg border border-green-500">


        {/* Left Side - Register Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center">Create an Account</h2>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input type="text" name="name" required onChange={handleChange} />
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

          {(form.role == 'employee') && <div className="flex flex-col gap-2">
            <Label htmlFor="Designation">Designation</Label>
            <select
              name="Designation"
              required
              onChange={handleChange}
              className="w-full mt-1 rounded border px-3 py-2 dark:bg-gray-800"
            >
              <option value="">-- Select Designation --</option>
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="software_engineer">Software Engineer</option>
              <option value="frontend_developer">Frontend Developer</option>
              <option value="backend_developer">Backend Developer</option>
              <option value="fullstack_developer">Full Stack Developer</option>
              <option value="ui_ux_designer">UI/UX Designer</option>
              <option value="qa_engineer">QA Engineer</option>
              <option value="project_manager">Project Manager</option>
              <option value="product_manager">Product Manager</option>
              <option value="devops_engineer">DevOps Engineer</option>
              <option value="team_lead">Team Lead</option>

              {/* Do NOT allow Admin registration from frontend */}
            </select>
          </div>}

          <div className="flex flex-col gap-2">
            <Label htmlFor="bank_account_no">Bank Account No</Label>
            <Input type="text" name="bank_account_no" required onChange={handleChange} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="Salary">Salary</Label>
            <Input type="text" name="Salary" required onChange={handleChange} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="imageFile">Upload Your Image</Label>
            <input className="border border-gray-200 p-2 rounded-sm dark:border-gray-700" type="file" accept="image/*" onChange={handleImageChange} required />

          </div>



          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" required onChange={handleChange} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input type="password" name="password" required onChange={handleChange} />
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
      {/* Right Side - Lottie Animation */}
      <div className="p-6 hidden md:flex flex-1 items-center justify-center ">
        <Lottie animationData={registerAnimation} loop={true} className="w-80 h-80" />
      </div>
    </div>
  </div>
);
};

export default Register;
