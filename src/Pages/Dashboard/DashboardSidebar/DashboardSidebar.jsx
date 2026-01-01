import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/Components/ui/button";
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
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        {/* Fixed Sidebar */}
        <div
          className={`
      fixed left-0 top-0 h-screen w-64 
      bg-white dark:bg-gray-900 
      border-r dark:border-gray-800 
      shadow-xl
      z-40
      transition-transform duration-300
      md:translate-x-0
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-800">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Dashboard
              </span>
            </Link>
            <div className="flex items-center justify-center gap-2">
              <ThemeToggle />
              {/* Hide close button on md+ screens */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-600 dark:text-gray-300 text-xl md:hidden hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {links.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 
                     dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 
                     transition-all duration-200 font-medium text-sm
                     active:bg-blue-100 dark:active:bg-gray-700"
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Bottom Section: Lottie Animation (shows on md+ screens) */}
          <div className="hidden md:flex flex-col items-center justify-center absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-800 bg-gradient-to-t from-blue-50 to-transparent dark:from-gray-800/50 dark:to-transparent">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-3 shadow-md">
              <Lottie
                animationData={dashboardAnim}
                loop
                className="w-32 h-32"
              />
            </div>
            <Button
              variant="outline"
              className="w-full text-sm font-medium px-3 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md transition-all duration-300 border-0"
              onClick={() => navigate("/")}
            >
              <Home size={16} className="mr-2" />
              Home
            </Button>
          </div>
        </div>

        {/* Main Content Area - Pushed to the right */}
        <div className="flex-1 ml-0 md:ml-64 overflow-auto">
          {/* Your page content goes here */}
        </div>

        {/* Mobile Overlay - Click to close sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 md:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
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
