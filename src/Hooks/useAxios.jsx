// hooks/useAxios.js
import { useState } from 'react';
import axios from 'axios';

const useAxios = (baseURL) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const postData = async (url, data, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${baseURL}${url}`, data, config);
      setResponse(res.data);
      return res.data;
    } catch (err) {
      setError(err);
      console.error('POST error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error, response };
};

export default useAxios;
