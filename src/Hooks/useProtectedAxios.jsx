// api.js
import axios from "axios";
import { auth } from "../../firebase.init";


const useProtectedAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Interceptor to attach token automatically
useProtectedAxios.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(); // always fresh token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default useProtectedAxios;
