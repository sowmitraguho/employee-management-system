import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import {
  FaChartBar,
  FaUserCheck,
  FaUsers,
  FaMoneyCheck,
  FaTimes,
  FaHome,
  FaChartLine, 
  FaTasks, 
  FaCogs, 
  FaBell, 
  FaClipboardList, 
  FaDatabase,
  FaChartPie,
  FaUserTie,
  FaSitemap,
  FaCheckCircle
} from "react-icons/fa";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import ThemeToggle from "../../../Components/ui/ThemeToggle";
import dashboardAnim from "../../../assets/Lottifiles/services.json";
import Lottie from "lottie-react";

const DashboardSidebar = ({ role, sidebarOpen, setSidebarOpen }) => {
  const { loggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const hrLinks = [
    { to: "/dashboard/employeelist", label: "Employee List", icon: <FaUsers /> },
    { to: "/dashboard/progress", label: "Progress", icon: <FaChartBar /> },
    { to: "/dashboard/userdetails", label: "Your Profile", icon: <FaUserCheck /> },
  ];

  const adminLinks = [
  // Main
  { to: "/dashboard", label: "Dashboard Overview", icon: <FaChartPie /> },
  // { to: "/dashboard/analytics", label: "Analytics & Reports", icon: <FaChartLine /> },
  // { to: "/dashboard/notifications", label: "Notifications", icon: <FaBell /> },

  // Employees
  { to: "/dashboard/adminemployeelist", label: "All Employees", icon: <FaUsers /> },
  // { to: "/dashboard/hrmanagement", label: "HR Management", icon: <FaUserTie /> },
  // { to: "/dashboard/departments", label: "Departments", icon: <FaSitemap /> },
  // { to: "/dashboard/tasks", label: "Task Management", icon: <FaTasks /> },
  { to: "/dashboard/payroll", label: "Payroll", icon: <FaMoneyCheck /> },

  // System
  // { to: "/dashboard/approvals", label: "Approvals Center", icon: <FaCheckCircle /> },
  // { to: "/dashboard/logs", label: "Activity Logs", icon: <FaClipboardList /> },
  // { to: "/dashboard/data", label: "Data Management", icon: <FaDatabase /> },
  // { to: "/dashboard/settings", label: "Admin Settings", icon: <FaCogs /> },

  // Personal
  { to: "/dashboard/userdetails", label: "Your Profile", icon: <FaUserCheck /> },
  // { to: "/dashboard/hpagedata", label: "Homepage Data", icon: <FaHome /> },
];


  const employeeLinks = [
    { to: "/dashboard/employeeprofile", label: "Your Profile", icon: <FaUsers /> },
    {
      to: `/dashboard/worksheet/${loggedInUser?.email}`,
      label: "Work Sheet",
      icon: <FaChartBar />,
    },
    {
      to: `/dashboard/paymenthistory/${loggedInUser?.email}`,
      label: "Payment History",
      icon: <FaMoneyCheck />,
    },
    { to: "/dashboard/userdetails", label: "Your Information", icon: <FaUserCheck /> },
  ];

  const links = [
    ...(role === "hr" ? hrLinks : []),
    ...(role === "admin" ? adminLinks : []),
    ...(role === "employee" ? employeeLinks : []),
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 h-view w-64 bg-white dark:bg-gray-900 
          border-r dark:border-gray-800 shadow-lg transform transition-transform duration-300 
          z-50 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/*  Sidebar Header */}

        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-800">
          <Link to='/dashboard'>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Dashboard
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2">
            <ThemeToggle />
            {/*  Hide close button on md+ screens */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-600 dark:text-gray-300 text-xl md:hidden"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)} // auto close on mobile
              className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 
                         dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 
                         transition-colors duration-200"
            >
              <span className="text-lg">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Section: Lottie Animation (shows on md+ screens) */}
        <div className="hidden md:flex flex-col items-center justify-center mt-auto mb-6 px-4">
          <div className="bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4">
            <Lottie
              animationData={dashboardAnim}
              loop
              className="w-40 h-40 lg:w-48 lg:h-48"
            />
          </div>
          <Button
          variant="outline"
          className="flex items-center gap-2 w-full justify-center text-sm mt-4 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-md transition-all duration-300"
          onClick={() => navigate("/")} 
        >
          <Home size={18} />
          Back to Home
        </Button>
        </div>

      </div>

      {/* Overlay on small screens */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        ></div>
      )}
    </>
  );
};

export default DashboardSidebar;
