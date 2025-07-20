import { Link } from "react-router";
import { FaChartBar, FaUserCheck, FaUsers, FaMoneyCheck, FaUserShield } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import ThemeToggle from "../../../Components/ui/ThemeToggle";
import dashboardAnim from '../../../assets/Lottifiles/services.json'
import Lottie from "lottie-react";

const DashboardSidebar = ({ role }) => {

  const { loggedInUser } = useContext(AuthContext);
  //const commonLinks = [{ to: "/dashboard", label: "Dashboard", icon: <FaChartBar /> }];
  //console.log(role);
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
      icon: <FaChartBar />
    },
    {
      to: `/dashboard/paymenthistory/${loggedInUser?.email}`, // will be added later
      label: "Payment History",
      icon: <FaMoneyCheck />
    }
  ];

  const links = [
    //...commonLinks,
    ...(role === "hr" ? hrLinks : []),
    ...(role === "admin" ? adminLinks : []),
    ...(role === "employee" ? employeeLinks : []),
  ];

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-800 p-4">
      <div className="flex gap-4">
        <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
        <ThemeToggle />
      </div>
      <nav className="space-y-3">
        {links.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted dark:hover:bg-gray-800"
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="hidden md:flex items-center justify-center bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-6">
        <Lottie animationData={dashboardAnim} loop className="w-72 h-72" />
      </div>
    </aside>
  );
};

export default DashboardSidebar;
