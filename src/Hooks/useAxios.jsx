// hooks/useAxios.js
import { useState } from 'react';
import axios from 'axios';

const useAxios = (baseURL) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  

  // 
  
  const postData = async (url, data, config = {}) => {
  setLoading(true);
  setError(null);

  try {
    const res = await axios.post(
      `${baseURL}${url}`,
      data,
      {
        headers: { 'Content-Type': 'application/json', ...config.headers },
        withCredentials: true, // if you use cookies/auth
        ...config
      }
    );

    setResponse(res.data);
    console.log('inside hook', res.data);
    return res.data;

  } catch (err) {
    console.error('POST error:', err);

    // If it's an Axios error, extract details
    if (err.response) {
      console.error('Server responded with:', err.response.data);
    } else if (err.request) {
      console.error('No response received:', err.request);
    } else {
      console.error('Axios setup error:', err.message);
    }

    setError(err);
    return null;

  } finally {
    setLoading(false);
  }
};


  const putData = async (url, data, config = {}) => {
    setLoading(true);
    setError(null);
    try {
        const res = await axios.put(`${baseURL}${url}`, data, config);
        setResponse(res.data);
        console.log('data putting result', res);
        return res.data;
    } catch (err) {
        setError(err);
        console.error('PUT error:', err);
        return null;
    } finally {
        setLoading(false);
    }
};

const deleteData = async (url, config = {}) => {
  setLoading(true);
  setError(null);
  try {
    const res = await axios.delete(`${baseURL}${url}`, config);
    setResponse(res.data);
    console.log('data deleting result', res);
    return res.data;
  } catch (err) {
    setError(err);
    console.error('DELETE error:', err);
    return null;
  } finally {
    setLoading(false);
  }
};


  return { postData, putData, deleteData, loading, error, response };
};

export default useAxios;
