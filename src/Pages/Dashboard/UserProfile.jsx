import React, { useContext, useEffect, useState } from "react"
//import { AuthContext } from "@/context/AuthProvider" // adjust path
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
//import axios from "axios"
import useAxiosGetData from "../../Hooks/useAxiosGetData"
import { AuthContext } from "../../Contexts/AuthContext/AuthContext"
import userAnim from '../../assets/Lottifiles/user.json'
import Lottie from "lottie-react"

export default function UserProfile() {
  const { loggedInUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const {getUserByEmail} = useAxiosGetData();

  useEffect(() => {
    console.log('loggedInUser from profile',loggedInUser);
    if (!loggedInUser?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await getUserByEmail(loggedInUser.email);
        console.log('data after get user by email', res)
        setUserData(res);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <Card className="flex items-center gap-4 p-4">
        <Skeleton className="w-32 h-32 rounded-full" />
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
      <Card className="p-4 text-center text-gray-500 dark:text-gray-400">
        No user data found.
      </Card>
    )
  }

  return (
    <Card className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 shadow-lg dark:bg-gray-900">
      <div className="flex flex-col md:flex-row items-center gap-4 p-4">
        <img
        src={
          userData.imageUrl ||
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
        }
        alt={userData.name}
        className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
      />
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          {userData.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 capitalize">
          {userData.Designation?.replace("_", " ")}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {userData.email}
        </p>

        {/* Extra Info */}
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">
            Role: {userData.role}
          </span>
          <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">
            Status: {userData.status}
          </span>
          {userData.isVerified && (
            <span className="px-2 py-1 rounded bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">
              ✅ Verified
            </span>
          )}
        </div>
      </div>
      </div>
      <div className="hidden md:flex items-center justify-center bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-6">
                <Lottie animationData={userAnim} loop className="w-24 h-24" />
        </div>
    </Card>
  )
}
