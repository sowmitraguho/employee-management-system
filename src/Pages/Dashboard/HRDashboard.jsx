import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import Lottie from "lottie-react";
import adminLottie from "../../assets/Lottifiles/admin.json";
import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

const HRDashboard = ({allEmployees, payrollData}) => {
    const verifiedCount = allEmployees.filter((e) => e.isVerified).length;
        const unverifiedCount = allEmployees.length - verifiedCount;
        // Pie chart data
        const hrEmployeeStats = [
            { name: "Verified", value: verifiedCount },
            { name: "Not Verified", value: unverifiedCount },
        ];

        const COLORS = ["#34d399", "#f87171"]; // green for verified, red for not verified

        // Pending payroll requests (example: all verified employees)
        
        const Payroll = payrollData.reduce(
            (acc, item) => {
                if (item.status === "approved") acc.approved++;
                if (item.status === "pending") acc.pending++;
                return acc;
            },
            { approved: 0, pending: 0 }
        );
        const pendingPayroll = Payroll.pending;
        const approvedPayroll = Payroll.approved; 
        //console.log('payroll data', payrollData, pendingPayroll);
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">
                    HR Dashboard Overview
                </h1>

                <div className="flex flex-col-reverse gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Employee Verification Status Pie Chart */}
                        <motion.div whileHover={{ scale: 1.05 }} className="flex-1">
                            <Card className="flex-1 bg-gradient-to-r from-sky-400 to-blue-800 text-gray-50 shadow-lg">
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

                        <div className="flex-1">
                            {/* Pending Payroll Requests */}
                        <motion.div whileHover={{ scale: 1.05 }} className="flex-1">
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
                        {/* ✅ Approved Payroll Requests */}
                        <motion.div whileHover={{ scale: 1.05 }} className="flex-1">
                            <Card className="bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg">
                                <CardHeader>
                                    <CardTitle>Approved Payroll Requests</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-extrabold">{approvedPayroll}</p>
                                    <p className="text-sm opacity-90 mt-2">
                                        Approved By Admin
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                        </div>
                    </div>

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
    };

export default HRDashboard;