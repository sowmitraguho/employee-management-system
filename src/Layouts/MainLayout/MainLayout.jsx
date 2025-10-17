import React, { useContext } from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../Pages/Shared/Navbar/Navbar';
import Footer from '../../Pages/Shared/Footer/Footer';
import { AuthContext } from '../../Contexts/AuthContext/AuthContext';
import Spinner from '../../Components/Spinner/Spinner';
import ScrollToTop from '../../Components/common/ScrollToTop';

const MainLayout = () => {
    const { loading } = useContext(AuthContext);
    if (loading) return <Spinner />;
    return (
        <div>
            <ScrollToTop />
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayout;