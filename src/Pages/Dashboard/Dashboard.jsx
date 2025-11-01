import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import useProtectedAxios from "../../Hooks/useProtectedAxios";
import { useQuery } from "@tanstack/react-query";
import HRDashboard from "./HRDashboard";
import AdminDashboard from "./AdminDashboard";
import Loader from "../../Components/Loader/Loader";
import EmployeeProfile from "./EmployeeSection/EmployeeProfile/EmployeeProfile";


// helper function to prepare stats for admin dashboard
const prepareAdminStats = (employees) => {
    const totalEmployees = employees.length;
    const verifiedCount = employees.filter(e => e.isVerified).length;
    const unverifiedCount = totalEmployees - verifiedCount;
    const activeCount = employees.filter(e => e.status === "active").length;
    const firedCount = employees.filter(e => e.status === "fired").length;
    const totalPayroll = employees.reduce((sum, e) => sum + Number(e.Salary || 0), 0);
    const roleCount = employees.reduce((acc, e) => {
        acc[e.role] = (acc[e.role] || 0) + 1;
        return acc;
    }, {}); 

    return {
        totalEmployees,
        verifiedCount,
        unverifiedCount,
        activeCount,
        firedCount,
        totalPayroll,
        roleCount
    };
};

const formatNumberShort = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString(); 
};

const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa"];
const baseURL = import.meta.env.VITE_API_URL;

const Dashboard = () => {

    const [allEmployees, setAllEmployees] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState(null);
    const { role } = useOutletContext();

    const {
        data: payrollData = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["payroll"],
        queryFn: async () => {
            const res = await useProtectedAxios.get(`${baseURL}/payments`);
            return res.data;
        },
    });
    const fetchEmployees = async () => {
        try {
            const res = await useProtectedAxios.get(`${baseURL}/users/verified`, { withCredentials: true });
            const res2 = await useProtectedAxios.get(`${baseURL}/users?role=employee`, { withCredentials: true });
            setEmployees(res.data || []);
            setAllEmployees(res2.data || []);
            const aggregated = prepareAdminStats(res.data);
           // console.log('aggregated', aggregated);
            setStats(aggregated);
        } catch (err) {
            console.error("Error fetching employees:", err);
        }
    };
    //console.log(employees);
    useEffect(() => {
        fetchEmployees();
    }, []);


    if (isLoading) return <Loader />;
    return (
        <div className="p-6 space-y-6">
            {role === "employee" && <EmployeeProfile />}
            {role === "hr" && <HRDashboard allEmployees={allEmployees} payrollData={payrollData} />}
            {role === "admin" && <AdminDashboard stats={stats} formatNumberShort={formatNumberShort} COLORS={COLORS} />}
        </div>
    );
};

export default Dashboard;
