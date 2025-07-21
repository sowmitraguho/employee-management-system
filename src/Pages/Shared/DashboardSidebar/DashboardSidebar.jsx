import { useContext } from "react";
import { Link } from "react-router";
import {
  FaChartBar,
  FaUserCheck,
  FaUsers,
  FaMoneyCheck,
  FaTimes,
} from "react-icons/fa";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import ThemeToggle from "../../../Components/ui/ThemeToggle";
import dashboardAnim from "../../../assets/Lottifiles/services.json";
import Lottie from "lottie-react";

const DashboardSidebar = ({ role, sidebarOpen, setSidebarOpen }) => {
  const { loggedInUser } = useContext(AuthContext);

  const hrLinks = [
    { to: "/dashboard/employeelist", label: "Employee List", icon: <FaUsers /> },
    { to: "/dashboard/progress", label: "Progress", icon: <FaChartBar /> },
  ];

  const adminLinks = [
    { to: "/dashboard/adminemployeelist", label: "All Employees", icon: <FaUserCheck /> },
    { to: "/dashboard/payroll", label: "Payroll", icon: <FaMoneyCheck /> },
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
  ];

  const links = [
    ...(role === "hr" ? hrLinks : []),
    ...(role === "admin" ? adminLinks : []),
    ...(role === "employee" ? employeeLinks : []),
  ];

  return (
    <>
      {/* ✅ Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 h-view w-64 bg-white dark:bg-gray-900 
          border-r dark:border-gray-800 shadow-lg transform transition-transform duration-300 
          z-50 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* ✅ Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-800">
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Dashboard
          </span>
          <div className="flex items-center justify-center gap-2">
            <ThemeToggle />
            {/* ❌ Hide close button on md+ screens */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-600 dark:text-gray-300 text-xl md:hidden"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* ✅ Navigation Links */}
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

        {/* ✅ Bottom Section: Lottie Animation (shows on md+ screens) */}
        <div className="hidden md:flex items-center justify-center mt-auto mb-6 px-4">
          <div className="bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4">
            <Lottie
              animationData={dashboardAnim}
              loop
              className="w-40 h-40 lg:w-48 lg:h-48"
            />
          </div>
        </div>
      </div>

      {/* ✅ Overlay on small screens */}
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
