import { Link } from "react-router";
import { FaChartBar, FaUserCheck, FaUsers, FaMoneyCheck, FaUserShield } from "react-icons/fa";

const Sidebar = ({ role }) => {
  const commonLinks = [{ to: "/dashboard", label: "Dashboard", icon: <FaChartBar /> }];

  const hrLinks = [
    { to: "/dashboard/employee-list", label: "Employee List", icon: <FaUsers /> },
    { to: "/dashboard/progress", label: "Progress", icon: <FaChartBar /> },
  ];

  const adminLinks = [
    { to: "/dashboard/all-employee-list", label: "All Employees", icon: <FaUserCheck /> },
    { to: "/dashboard/payroll", label: "Payroll", icon: <FaMoneyCheck /> },
  ];

  const employeeLinks = [
    { to: "/dashboard/work-sheet", label: "Work Sheet", icon: <FaChartBar /> },
    { to: "/dashboard/payment-history", label: "Payment History", icon: <FaMoneyCheck /> },
  ];

  const links = [
    ...commonLinks,
    ...(role === "hr" ? hrLinks : []),
    ...(role === "admin" ? adminLinks : []),
    ...(role === "employee" ? employeeLinks : []),
  ];

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-800 p-4">
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
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
    </aside>
  );
};

export default Sidebar;
