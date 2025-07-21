import axios from "axios";
import React from "react";
import { getAuth } from "firebase/auth"; // ✅ Import Firebase auth

const useAxiosGetData = () => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  });

  // ✅ Attach Firebase token automatically to every request
  axiosInstance.interceptors.request.use(
    async (config) => {
      const auth = getAuth(); // Get Firebase auth instance
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Get a fresh token
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // ✅ Fetch user data by email
  const getUserByEmail = async (email) => {
    if (!email) return null;
    try {
      const result = await axiosInstance.get(`/users/${email}`);
      //console.log("data by email from hook", result.data.role);
      return result.data;
    } catch (error) {
      console.error(
        "Failed to fetch user by email:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  // ✅ Fetch works by email
  const getWorksByEmail = async (email) => {
    if (!email) return null;
    try {
      const result = await axiosInstance.get(`works?email=${email}`);
     // console.log("data by email from hook", result.data);
      return result.data;
    } catch (error) {
      console.error(
        "Failed to fetch works by email:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  // ✅ Fetch ALL works (no email filter)
const getAllWorks = async () => {
  try {
    const result = await axiosInstance.get("works"); // just hit the works endpoint
    //console.log("all works from hook", result.data);
    return result.data;
  } catch (error) {
    console.error(
      "Failed to fetch all works:",
      error.response?.data || error.message
    );
    return null;
  }
};


  // ✅ Fetch payment history
  const getPaymentHistory = async (email) => {
    if (!email) return null;
    try {
      const result = await axiosInstance.get(`/payments/${email}`);
      //console.log("data by email from hook", result);
      return result.data;
    } catch (error) {
      console.error(
        "Failed to fetch payment history:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  return { getUserByEmail, getWorksByEmail, getPaymentHistory, getAllWorks };
};

export default useAxiosGetData;
