import React, { useEffect, useState } from "react";
import { AuthContext } from "@/Contexts/AuthContext/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import employeeLottie from "../../assets/Lottifiles/user.json";
import hrLottie from "../../assets/Lottifiles/user.json";
import adminLottie from "../../assets/Lottifiles/admin.json";
//import hrLottie from "../../assets/Lottifiles/admin.json"; // Replace with your Lottie JSON
import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import { useOutletContext } from "react-router";
import useProtectedAxios from "../../Hooks/useProtectedAxios";

// Dummy chart data (you can fetch from API)

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
    }, {}); // e.g. { admin: 2, hr: 5, employee: 20 }

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
    return num.toString(); // less than 1000, just return original
};

const normalize = (emp) => ({
    id: emp._id,
    name: emp.name,
    email: emp.email,
    role: emp.role,
    designation: emp.designation || emp.Designation || "Not Assigned",
    salary: emp.salary || emp.Salary || "0",
    bankAccount: emp.bankAccountNo || emp.bank_account_no || "N/A",
    isVerified: emp.isVerified,
    photo: emp.photoURL || emp.imageUrl || "https://via.placeholder.com/40",
});



const employeeProgress = [
    { name: "Completed", value: 70 },
    { name: "Pending", value: 30 }
];



const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa"];
const baseURL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
    //const { loggedInUser } = useContext(AuthContext); 
    //const role = user?.role || "employee"; // employee | hr | admin
    const [allEmployees, setAllEmployees] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    
    const { role } = useOutletContext();
    const fetchEmployees = async () => {
        try {
            const res = await useProtectedAxios.get(`${baseURL}/vfusers/verified`, { withCredentials: true });
            const res2 = await useProtectedAxios.get(`${baseURL}/users?role=employee`, { withCredentials: true });
            console.log('fetched employee for admin', res.data);
            console.log('fetched employee for hr', res2.data);
            setEmployees(res.data || []);
            setAllEmployees(res2.data || []);
            
            const aggregated = await prepareAdminStats(res.data);
            console.log('aggregated', aggregated);
            await setStats(aggregated);
        } catch (err) {
            console.error("Error fetching employees:", err);
        } finally {
            setLoading(false);
        }
    };
    console.log(employees);
    useEffect(() => {
        fetchEmployees();
    }, []);



    const renderEmployeeDashboard = () => (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl">
                    <CardHeader>
                        <CardTitle>Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={employeeProgress} dataKey="value" outerRadius={80}>
                                    {employeeProgress.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
                    <CardHeader>
                        <CardTitle>Upcoming Salary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">$3,200</p>
                        <p className="text-sm">Next payment: 25 July 2025</p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="bg-white">
                    <CardContent className="flex justify-center">
                        <Lottie animationData={employeeLottie} loop />
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );

    const renderHRDashboard = () => {
        const verifiedCount = allEmployees.filter((e) => e.isVerified).length;
        const unverifiedCount = allEmployees.length - verifiedCount;
        // ✅ Pie chart data
        const hrEmployeeStats = [
            { name: "Verified", value: verifiedCount },
            { name: "Not Verified", value: unverifiedCount },
        ];

        const COLORS = ["#34d399", "#f87171"]; // green for verified, red for not verified

        // ✅ Pending payroll requests (example: all verified employees)
        const pendingPayroll = verifiedCount; // you can adjust based on logic

        return (
            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">
                    HR Dashboard Overview
                </h1>

                <div className="flex flex-col-reverse gap-4">
                    {/* ✅ Employee Verification Status Pie Chart */}
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Card className="bg-gradient-to-r from-sky-400 to-blue-800 text-gray-50 shadow-lg">
                            <CardHeader>
                                <CardTitle>Employee Verification Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={hrEmployeeStats}
                                            dataKey="value"
                                            outerRadius={80}
                                            label={({ name, value }) => `${name}: ${value}`}
                                        >
                                            {hrEmployeeStats.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                background: "#fff",
                                                border: "1px solid #ddd",
                                                color: "#333",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="flex justify-between text-sm mt-4">
                                    <span>✅ Verified: {verifiedCount}</span>
                                    <span>❌ Not Verified: {unverifiedCount}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* ✅ Pending Payroll Requests */}
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Card className="bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg">
                            <CardHeader>
                                <CardTitle>Pending Payroll Requests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-extrabold">{pendingPayroll}</p>
                                <p className="text-sm opacity-90 mt-2">
                                    Need approval from Admin
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* ✅ Lottie Animation Fun Card */}
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Card className="bg-white dark:bg-gray-900 shadow-lg">
                            <CardContent className="flex justify-center items-center p-4">
                                <Lottie animationData={adminLottie} loop style={{ height: 180 }} />
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        );
    }

    const renderAdminDashboard = () => {
        if (!stats) return <p className="text-center">Loading Dashboard...</p>;
        // Prepare data for charts
        const verificationData = [
            { name: "Verified", value: stats.verifiedCount },
            { name: "Unverified", value: stats.unverifiedCount },
        ];

        const statusData = [
            { name: "Active", value: stats.activeCount },
            { name: "Fired", value: stats.firedCount },
        ];

        const roleData = Object.entries(stats.roleCount).map(([role, count]) => ({
            name: role,
            count,
        }));
        return (
            // <div className="flex flex-col gap-4">
            //     <motion.div whileHover={{ scale: 1.05 }}>
            //         <Card className="bg-white">
            //             <CardContent className="flex justify-center">
            //                 <Lottie animationData={adminLottie} loop />
            //             </CardContent>
            //         </Card>
            //     </motion.div>
            //     <motion.div whileHover={{ scale: 1.05 }}>
            //         <Card className="dark:bg-gray-900 dark:text-white">
            //             <CardHeader>
            //                 <CardTitle>Monthly Payroll Expenses</CardTitle>
            //             </CardHeader>
            //             <CardContent>
            //                 <ResponsiveContainer width="100%" height={200}>
            //                     <BarChart data={adminPayrollStats}>
            //                         <CartesianGrid strokeDasharray="3 3" />
            //                         <XAxis dataKey="month" />
            //                         <YAxis />
            //                         <Tooltip />
            //                         <Bar dataKey="expense" fill="#facc15" />
            //                     </BarChart>
            //                 </ResponsiveContainer>
            //             </CardContent>
            //         </Card>
            //     </motion.div>

            //     <motion.div whileHover={{ scale: 1.05 }}>
            //         <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            //             <CardHeader>
            //                 <CardTitle>Total Employees</CardTitle>
            //             </CardHeader>
            //             <CardContent>
            //                 <p className="text-3xl font-bold">{stats.totalEmployees}</p>
            //                 <p className="text-sm">Active: {stats.activeCount}, Fired: {stats.firedCount}</p>
            //             </CardContent>
            //         </Card>
            //     </motion.div>


            // </div>
            <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
                <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">
                    Admin Dashboard Overview
                </h1>
                {/* Total Employees Card */}
                <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl">
                    <CardHeader>
                        <CardTitle>Total Employees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{stats.totalEmployees}</p>
                        <p className="text-sm">Active: {stats.activeCount}, Fired: {stats.firedCount}</p>
                    </CardContent>
                </Card>

                {/* Payroll Summary */}
                <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-xl">
                    <CardHeader>
                        <CardTitle>Total Payroll</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">${formatNumberShort(stats.totalPayroll)}</p>
                    </CardContent>
                </Card>

                {/* Roles Distribution */}
                <Card className="bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-xl">
                    <CardHeader>
                        <CardTitle>Roles Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            {roleData.map((r) => (
                                <li key={r.name} className="capitalize">
                                    {r.name}: <span className="font-bold">{r.count}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Verification Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Verification Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={verificationData} dataKey="value" outerRadius={80}>
                                    {verificationData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Employee Status Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employee Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={statusData} dataKey="value" outerRadius={80}>
                                    {statusData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Roles Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Roles Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={roleData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#facc15" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>

        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* <motion.h1
                className="text-3xl font-bold text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {role === "employee" && "Employee Dashboard"}
                {role === "hr" && "HR Dashboard"}
                {role === "admin" && "Admin Dashboard"}
            </motion.h1> */}

            {role === "employee" && renderEmployeeDashboard()}
            {role === "hr" && renderHRDashboard()}
            {role === "admin" && renderAdminDashboard()}
        </div>
    );
};

export default Dashboard;
