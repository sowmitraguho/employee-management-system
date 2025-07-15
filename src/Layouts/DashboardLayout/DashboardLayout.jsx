import { Outlet, Navigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import DashboardSidebar from "../../Pages/Shared/DashboardSidebar/DashboardSidebar";
import useAxiosGetData from "../../Hooks/useAxiosGetData";
import Spinner from "../../Components/Spinner/Spinner"

const DashboardLayout = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const {getUserByEmail} = useAxiosGetData();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (loggedInUser?.email) {
        try {
          const data = await getUserByEmail(loggedInUser.email);
          console.log(data);
          setRole(data); // role should be "employee", "hr", or "admin"
        } catch (error) {
          console.error("Error fetching role:", error);
          setRole(null);
        } finally {
          setLoadingRole(false);
        }
      }
    };

    fetchUserRole();
  }, [loggedInUser]);

  // Not logged in? Redirect to login
  if (!loggedInUser) return <Navigate to="/login" replace />;

  // Still fetching role
  if (loadingRole) return <div className="p-10 text-center">
  
  Loading dashboard...
  <Spinner/>
  </div>;

  // If no valid role found, deny access
  //if (!role) return <Navigate to="/unauthorized" replace />;
  return (
    <div className="min-h-screen flex">
      <DashboardSidebar role={role} />
      <main className="flex-1 p-4 bg-muted/40 dark:bg-gray-950">
        <Outlet context={{ role }} />
      </main>
    </div>
  );
};

export default DashboardLayout;
