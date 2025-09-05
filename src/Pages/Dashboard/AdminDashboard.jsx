import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Users, DollarSign, TrendingUp, RotateCcw, Download, ShoppingBag } from "lucide-react";

import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import Loader from "../../Components/Loader/Loader";


const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 2500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 7000 },
    { month: "Jul", sales: 8000 },
    { month: "Aug", sales: 5500 },
    { month: "Sep", sales: 6500 },
    { month: "Oct", sales: 7200 },
    { month: "Nov", sales: 4000 },
    { month: "Dec", sales: 9000 },
];

const reviewData = [
    { name: "Poor", value: 120 },
    { name: "Satisfied", value: 300 },
    { name: "Very Satisfied", value: 450 },
    { name: "Excellent", value: 200 },
];

const AdminDashboard = ({ stats, formatNumberShort, COLORS }) => {
    if (!stats) return <Loader />;
    // Prepare data for charts
    const verificationData = [
        { name: "Verified", value: stats.verifiedCount },
        { name: "Unverified", value: stats.unverifiedCount },
    ];

    const statusData = [
        { name: "Active", value: stats.activeCount },
        { name: "Fired", value: stats.firedCount },
        { name: "On Leave", value: stats.onLeaveCount || 0 },
    ];

    const roleData = Object.entries(stats.roleCount).map(([role, count]) => ({
        name: role,
        count,
    }));

    const cardStats = [
        { title: "Customers", value: Math.floor(Math.random() * 1000), icon: Users },
        { title: "Revenue", value: `$${(Math.random() * 50000).toFixed(0)}`, icon: DollarSign },
        { title: "Growth", value: `${(Math.random() * 100).toFixed(1)}%`, icon: TrendingUp },
        { title: "Returns", value: Math.floor(Math.random() * 200), icon: RotateCcw },
        { title: "Downloads", value: Math.floor(Math.random() * 5000), icon: Download },
        { title: "Orders", value: Math.floor(Math.random() * 800), icon: ShoppingBag },
    ];



    return (

        <div className="flex flex-col gap-4">
            {/* <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">
                Admin Dashboard Overview
            </h1> */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Total Employees Card */}
                <Card className="bg-indigo-500 text-white shadow-xl text-center">
                    <CardHeader>
                        <CardTitle className='text-2xl font-bold -mb-5'>Total Employees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold mb-2">{stats.totalEmployees}</p>
                        <p className="text-sm">Active: {stats.activeCount}, Fired: {stats.firedCount}</p>
                    </CardContent>
                </Card>

                {/* Payroll Summary */}
                <Card className="bg-green-400 text-white shadow-xl justify-center text-center">
                    <CardHeader>
                        <CardTitle className='text-3xl font-bold -mb-5'>Total Payroll</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">${formatNumberShort(stats.totalPayroll)}</p>
                    </CardContent>
                </Card>

                {/* Roles Distribution */}
                <Card className="bg-red-500 text-white shadow-xl justify-center text-center">
                    <CardHeader>
                        <CardTitle className='text-3xl font-bold -mb-5'>Roles Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            {roleData.map((r) => (
                                <li key={r.name} className="capitalize text-lg font-semibold -my-1">
                                    {r.name}: <span className="font-bold">{r.count}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

            </div>
            <div className="mt-2">
                <h2 className="text-xl font-semibold text-white dark:text-gray-50 my-2 bg-blue-500 p-2">Monthly Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
                
                {cardStats.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <Card key={i} className="p-4 flex flex-row items-center gap-4 bg-white dark:bg-gray-900 ">
                            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
                                <Icon size={24} />
                            </div>
                            <CardContent className="p-0 flex-1">
                                <p className="text-sm text-gray-900 dark:text-white">{item.title}</p>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</h3>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Verification Pie Chart */}
                <Card className='bg-white dark:bg-gray-900 '>
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

                        {/* Data list under chart */}
                        <div className="mt-4 space-y-1">
                            {verificationData.map((item, i) => (
                                <p key={i} className="text-sm text-gray-900 dark:text-white flex justify-between">
                                    <span>{item.name}</span>
                                    <span className="font-semibold">{item.value}</span>
                                </p>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Employee Status Chart */}
                <Card className='bg-white dark:bg-gray-900 '>
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

                        {/* Data list under chart */}
                        <div className="mt-4 space-y-1">
                            {statusData.map((item, i) => (
                                <p key={i} className="text-sm text-gray-900 dark:text-white flex justify-between">
                                    <span>{item.name}</span>
                                    <span className="font-semibold">{item.value}</span>
                                </p>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Roles Bar Chart */}
                <Card className='bg-white dark:bg-gray-900 '>
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

                        {/* Data list under chart */}
                        <div className="mt-4 space-y-1">
                            {roleData.map((item, i) => (
                                <p key={i} className="text-sm text-gray-900 dark:text-white flex justify-between">
                                    <span>{item.name}</span>
                                    <span className="font-semibold">{item.count}</span>
                                </p>
                            ))}
                        </div>
                    </CardContent>
                </Card>


            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sales Bar Chart */}
                <Card className="dark:bg-gray-900 justify-between">
                    <CardHeader>
                        <CardTitle className="dark:text-gray-100">Monthly Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="currentColor" />
                                <YAxis stroke="currentColor" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(31,41,55,0.9)",
                                        borderRadius: "8px",
                                        border: "none",
                                        color: "#fff",
                                    }}
                                />
                                <Bar dataKey="sales" fill="#4f46e5" />
                            </BarChart>
                        </ResponsiveContainer>
                        
                    </CardContent>
                </Card>

                {/* Customer Review Pie Chart */}
                <Card className="dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="dark:text-gray-100">Customer Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={reviewData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    label
                                >
                                    {reviewData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        borderRadius: "8px",
                                        border: "none",
                                        color: "black",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Data list under chart */}
                        <div className="mt-4 space-y-1">
                            {reviewData.map((item, i) => (
                                <p key={i} className="text-sm text-gray-900 dark:text-white flex justify-between">
                                    <span>{item.name}</span>
                                    <span className="font-semibold">{item.value}</span>
                                </p>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>



        </div>

    )
};

export default AdminDashboard;