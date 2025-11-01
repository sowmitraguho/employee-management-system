import React from 'react';
import { AuthContext } from './AuthContext';
import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../../../firebase.init';
import axios from 'axios';

const AuthProvider = ({ children }) => {

    const provider = new GoogleAuthProvider();

    const [loading, setLoading] = useState(true);

    const [loggedInUser, setLoggedInUser] = useState(auth.currentUser);

    const sendTokenToBackend = async (firebaseUser) => {
  try {
    const userToken = await firebaseUser.getIdToken();
    console.log("userToken", userToken);

    // Local storage
    localStorage.setItem("authToken", userToken);

    // Cookie (remove Secure for local dev)
    document.cookie = `authToken=${userToken}; path=/; max-age=604800; SameSite=Strict`;

    // Send token to backend
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    //console.log("Backend response:", res.data);
  } catch (err) {
    console.error("Error sending token to backend:", err);
  }
};


    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }
    const updateUser = (updatedUserData) => {
        console.log('inside update user', updatedUserData);
        setLoading(true);
        return updateProfile(auth.currentUser, updatedUserData);
    }
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }
    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, provider);
    }



    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    useEffect(() => {
        const UnSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            //console.log('inside useeffect after auth state changed', currentUser);
            setLoggedInUser(currentUser);
            //setLoading(false);
            // const userToken = currentUser?.accessToken;
            if (currentUser) {
                await sendTokenToBackend(currentUser);
            } else {
                localStorage.removeItem("authToken"); // remove token on logout
            }
            setLoading(false);
        });
        return () => {
            UnSubscribe();
        }
    }, [])

    const userInfo = {
        createUser,
        signIn,
        googleSignIn,
        updateUser,
        logOut,
        setLoggedInUser,
        setLoading,
        loggedInUser,
        loading
    }
    return (
        <AuthContext.Provider value={userInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;