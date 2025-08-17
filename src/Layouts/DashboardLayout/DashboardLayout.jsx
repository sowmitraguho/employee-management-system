import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import useAxiosGetData from "../../Hooks/useAxiosGetData";
import Spinner from "../../Components/Spinner/Spinner";
import DashboardSidebar from '../../Pages/Shared/DashboardSidebar/DashboardSidebar'
import UserProfile from "../../Pages/Dashboard/UserProfile";
import { Outlet } from "react-router";
import { set } from "date-fns";

const DashboardLayout = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true); // sidebar toggle state

  const { getUserByEmail } = useAxiosGetData();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (loggedInUser?.email) {
        try {
          const data = await getUserByEmail(loggedInUser.email);
         // console.log(data);
          setRole(data.role);
          setCurrentUser(data);
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

  if (!loggedInUser) return <Navigate to="/login" replace />;

  if (loadingRole)
    return (
      <div className="p-10 text-center">
        Loading dashboard...
        <Spinner/>
      </div>
    );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      
      <DashboardSidebar role={role} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content should expand when sidebar is collapsed */}
      <main
        className={`flex-1 p-4 bg-muted/40 dark:bg-gray-950 transition-all duration-300`}
      >
        {/* Optional: Place a top navbar with hamburger button */}
        <div className="md:hidden mb-4">
          <button
            className="p-2 border rounded-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Close Menu" : "Open Menu"}
          </button>
        </div>

        <UserProfile />
        <Outlet context={{ role, currentUser: currentUser }} />
      </main>
    </div>
  );
};

export default DashboardLayout;
