import React from 'react';
import { AuthContext } from './AuthContext';
import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../../../firebase.init';

const AuthProvider = ({children}) => {

    const provider = new GoogleAuthProvider();

    const [loading, setLoading] = useState(true);

    const [loggedInUser, setLoggedInUser] = useState(auth.currentUser);

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
        signInWithPopup(auth, provider);
    }

    

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    useEffect(()=>{
        const UnSubscribe = onAuthStateChanged(auth, currentUser => {
            console.log('inside useeffect after auth state changed', currentUser);
            setLoggedInUser(currentUser);
            setLoading(false);
        });
        return ()=> {
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