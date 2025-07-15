import axios from 'axios';
import React from 'react';

const useAxiosRole = () => {
    const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

  // ✅ Fetch user data by email
  const getUserByEmail = async (email) => {
    if (!email) return null;
    try {
      const result = await axiosInstance.get(`/users/${email}`);
      console.log('data by email from hook', result.data.role);
      return result.data.role; // returns {role, name, ...}
    } catch (error) {
      console.error("Failed to fetch user by email:", error.response?.data || error.message);
      return null;
    }
  };
    return { getUserByEmail };
};

export default useAxiosRole;