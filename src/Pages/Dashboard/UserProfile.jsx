import React, { useContext, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import useAxiosGetData from "../../Hooks/useAxiosGetData"
import { AuthContext } from "../../Contexts/AuthContext/AuthContext"
import userAnim from "../../assets/Lottifiles/user.json"
import Lottie from "lottie-react"

export default function UserProfile() {
  const { loggedInUser } = useContext(AuthContext)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { getUserByEmail } = useAxiosGetData()

  useEffect(() => {
    if (!loggedInUser?.email) return

    const fetchUserData = async () => {
      try {
        const res = await getUserByEmail(loggedInUser.email)
        setUserData(res)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

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
    <Card className="flex flex-row items-center justify-between gap-6 p-6 shadow-lg dark:bg-gray-900">
      {/* Left Section: Profile Image + Info */}
      <div className="flex flex-row items-center gap-6 flex-1">
        <img
          src={
            userData.imageUrl ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
          }
          alt={userData.name}
          className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
        />

        <div className="text-center md:text-left space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {userData.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 capitalize">
            {userData.Designation?.replace("_", " ")}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{userData.email}</p>

          {/* Extra Info */}
          <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2 text-sm">
            <span className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-800 dark:text-gray-300">
              Role: {userData.role}
            </span>
            <span className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-800 dark:text-gray-300">
              Status: {userData.status}
            </span>
            {userData.isVerified && (
              <span className="px-3 py-1 rounded-md bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">
                ✅ Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section: Lottie Animation */}
      <div className="flex justify-center md:justify-end w-full md:w-auto">
        <div className="bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4">
          <Lottie animationData={userAnim} loop className="w-28 h-28 md:w-36 md:h-36" />
        </div>
      </div>
    </Card>
  )
}
