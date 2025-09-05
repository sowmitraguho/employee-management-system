import React, { useContext, useEffect, useState } from "react"
import { Card } from "@/Components/ui/card"
import { Skeleton } from "@/Components/ui/skeleton"
import useAxiosGetData from "../../Hooks/useAxiosGetData"
import { AuthContext } from "../../Contexts/AuthContext/AuthContext"
import userAnim from "../../assets/Lottifiles/user.json"
import Lottie from "lottie-react"
import { Button } from "@/Components/ui/button"
import { HiOutlineLogout } from "react-icons/hi"
import { FiCheckSquare } from "react-icons/fi"
import { FaBell } from "react-icons/fa"

export default function UserProfile() {
  const { loggedInUser, logOut } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Payroll approval pending" },
    { id: 2, text: "New leave request from John" },
    { id: 3, text: "Project deadline approaching" }
  ]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { getUserByEmail } = useAxiosGetData();

  useEffect(() => {
    if (!loggedInUser?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await getUserByEmail(loggedInUser.email);
        setUserData(res);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Card className="flex items-center gap-4 p-4 dark:bg-gray-900">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-32" />
        </div>
      </Card>
    )
  }

  if (!userData) {
    return (
      <Card className="p-6 text-center text-gray-500 dark:text-gray-400 dark:bg-gray-900">
        No user data found.
      </Card>
    )
  }

  return (
    <Card className="relative rounded-[0px] flex flex-col md:flex-row items-center justify-between gap-6 px-6 shadow-sm dark:bg-gray-900">

      {/* Left Section: Profile Info */}
      <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
        <img
          src={
            userData.imageUrl ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
          }
          alt={userData.name}
          className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
        />

        <div className="text-left space-y-2">
          <div className="flex gap-4 items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {userData.name}
          </h2> 
          {/* Notifications */}
            <div className="relative">
              <FaBell
                className="w-6 h-6 text-gray-600 dark:text-gray-200 cursor-pointer hover:text-blue-600"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-20">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Notifications
                  </h3>
                  {notifications.map((note) => (
                    <div
                      key={note.id}
                      className="text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      {note.text}
                    </div>
                  ))}
                  <button
                    className="w-full mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setNotifications([])}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 capitalize">
            {userData.Designation?.replace("_", " ") || "Employee"}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {userData.email}
          </p>

          {/* Extra Info */}
          <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2 text-sm">
            <span className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-800 dark:text-gray-300">
              Role: {userData.role}
            </span>
            <span className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-800 dark:text-gray-300">
              Status: {userData.status}
            </span>
            {userData.isVerified && (
              <span className="px-3 flex items-center gap-1 py-1 rounded-md bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">
                <FiCheckSquare /> Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Logout */}
            <Button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-md transition-all duration-300"
              onClick={() => logOut()}
            >
              <HiOutlineLogout className="text-lg" />
              Logout
            </Button>
          </div>
        </div>

      </div>

      {/* Right Section: Animation + Actions */}
      <div className="flex flex-col items-center gap-3">
        {/* Lottie Animation */}
        <div className="bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4">
          <Lottie
            animationData={userAnim}
            loop
            className="w-28 h-28 md:w-36 md:h-36"
          />
        </div>
      </div>
    </Card>
  )
}
