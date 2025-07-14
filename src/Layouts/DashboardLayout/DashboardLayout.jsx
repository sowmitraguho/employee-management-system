import { Outlet, Navigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import DashboardSidebar from "../../Pages/Shared/DashboardSidebar/DashboardSidebar";

const DashboardLayout = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (loggedInUser?.email) {
      // Fetch user role from backend/Firestore here
      const fakeRole = "employee"; // change dynamically
      setTimeout(() => setRole(fakeRole), 500);
    }
  }, [loggedInUser]);

  if (!loggedInUser) return <Navigate to="/login" replace />;
  if (!role) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar/>
      <main className="flex-1 p-4 bg-muted/40 dark:bg-gray-950">
        <Outlet context={{ role }} />
      </main>
    </div>
  );
};

export default DashboardLayout;
