import React, { useMemo } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { Users, CheckCircle, AlertCircle, TrendingUp, TrendingDown, Calendar, DollarSign, Award } from 'lucide-react';

const HRDashboard = ({ allEmployees, payrollData }) => {
    const verifiedCount = allEmployees.filter((e) => e.isVerified).length;
    const unverifiedCount = allEmployees.length - verifiedCount;

    // Pie chart data
    const hrEmployeeStats = [
        { name: "Verified", value: verifiedCount },
        { name: "Not Verified", value: unverifiedCount },
    ];

    const COLORS = ["#10b981", "#ef4444"];

    // Payroll statistics
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
    const totalPayroll = pendingPayroll + approvedPayroll;

    // Department breakdown
    const departmentStats = useMemo(() => {
        const depts = {};
        allEmployees.forEach((emp) => {
            const dept = emp.Designation?.replace(/_/g, " ") || "Other";
            if (!depts[dept]) {
                depts[dept] = { name: dept, count: 0, verified: 0 };
            }
            depts[dept].count++;
            if (emp.isVerified) depts[dept].verified++;
        });
        return Object.values(depts).sort((a, b) => b.count - a.count);
    }, [allEmployees]);

    // Status breakdown
    const statusStats = useMemo(() => {
        const statuses = {};
        allEmployees.forEach((emp) => {
            const status = emp.status || "Unknown";
            if (!statuses[status]) {
                statuses[status] = { name: status, count: 0 };
            }
            statuses[status].count++;
        });
        return Object.values(statuses);
    }, [allEmployees]);

    // Monthly payroll trend (simulated data)
    const payrollTrend = [
        { month: "Jan", pending: 12, approved: 28, total: 40 },
        { month: "Feb", pending: 10, approved: 30, total: 40 },
        { month: "Mar", pending: 8, approved: 32, total: 40 },
        { month: "Apr", pending: 15, approved: 35, total: 50 },
        { month: "May", pending: 20, approved: 30, total: 50 },
        { month: "Jun", pending: pendingPayroll, approved: approvedPayroll, total: totalPayroll },
    ];

    // Employee distribution by role
    const roleDistribution = useMemo(() => {
        const roles = {};
        allEmployees.forEach((emp) => {
            const role = emp.role || "Unknown";
            if (!roles[role]) {
                roles[role] = 0;
            }
            roles[role]++;
        });
        return Object.entries(roles).map(([role, count]) => ({
            name: role,
            value: count
        }));
    }, [allEmployees]);

    // Top performing departments
    const topDepartments = departmentStats.slice(0, 5).map(dept => ({
        name: dept.name,
        verification: (dept.verified / dept.count) * 100
    }));

    // Recent payroll data (last 5 entries)
    const recentPayroll = payrollData.slice(-5).reverse();

    // Calculate average metrics
    const verificationRate = ((verifiedCount / allEmployees.length) * 100).toFixed(1);
    const payrollCompletionRate = ((approvedPayroll / totalPayroll) * 100).toFixed(1);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const cardHoverVariants = {
        hover: {
            y: -8,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        },
    };

    const ROLE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-6 md:p-8">
            <motion.div
                className="max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                        HR Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Manage employees, payroll, and verify accounts • Updated: Today
                    </p>
                </motion.div>

                {/* Key Metrics Section */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {/* Total Employees */}
                    <motion.div
                        variants={cardHoverVariants}
                        whileHover="hover"
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Total Employees
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                                    {allEmployees.length}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                    Active in system
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Verified Employees */}
                    <motion.div
                        variants={cardHoverVariants}
                        whileHover="hover"
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Verification Rate
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                                    {verificationRate}%
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                    {verifiedCount} verified
                                </p>
                            </div>
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Pending Payroll */}
                    <motion.div
                        variants={cardHoverVariants}
                        whileHover="hover"
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Pending Payroll
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                                    {pendingPayroll}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                    {((pendingPayroll / totalPayroll) * 100).toFixed(0)}% of total
                                </p>
                            </div>
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Approved Payroll */}
                    <motion.div
                        variants={cardHoverVariants}
                        whileHover="hover"
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    Payroll Completion
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                                    {payrollCompletionRate}%
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                    {approvedPayroll} approved
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Charts Section - Row 1 */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                >
                    {/* Employee Verification Status Pie Chart */}
                    <motion.div
                        variants={cardHoverVariants}
                        whileHover="hover"
                    >
                        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm h-full">
                            <CardHeader>
                                <CardTitle className="text-gray-900 dark:text-gray-50">
                                    Verification Status
                                </CardTitle>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Employee verification overview
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={hrEmployeeStats}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value, percent }) =>
                                                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                                            }
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {hrEmployeeStats.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#fff",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "8px",
                                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            }}
                                            formatter={(value) => [`${value} employees`, "Count"]}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Role Distribution */}
                    <motion.div
                        variants={cardHoverVariants}
                        whileHover="hover"
                    >
                        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm h-full">
                            <CardHeader>
                                <CardTitle className="text-gray-900 dark:text-gray-50">
                                    Role Distribution
                                </CardTitle>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Employees by role
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={roleDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {roleDistribution.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#fff",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "8px",
                                            }}
                                            formatter={(value) => [`${value} employees`, "Count"]}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Charts Section - Row 2 */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                >
                    {/* Payroll Trend Chart */}
                    <motion.div
                        variants={cardHoverVariants}
                        whileHover="hover"
                    >
                        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm h-full">
                            <CardHeader>
                                <CardTitle className="text-gray-900 dark:text-gray-50">
                                    Payroll Trend
                                </CardTitle>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    6-month payroll status trend
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={payrollTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#fff",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="approved"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            dot={{ fill: "#10b981" }}
                                            name="Approved"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="pending"
                                            stroke="#f59e0b"
                                            strokeWidth={2}
                                            dot={{ fill: "#f59e0b" }}
                                            name="Pending"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Department Verification Rate */}
                    <motion.div
                        variants={cardHoverVariants}
                        whileHover="hover"
                    >
                        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm h-full">
                            <CardHeader>
                                <CardTitle className="text-gray-900 dark:text-gray-50">
                                    Department Performance
                                </CardTitle>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Verification rate by department
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={topDepartments}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#fff",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "8px",
                                            }}
                                            formatter={(value) => [`${value.toFixed(1)}%`, "Verification"]}
                                        />
                                        <Bar dataKey="verification" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Status and Payroll Cards */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                    {/* Pending Payroll Card */}
                    <motion.div
                        variants={cardHoverVariants}
                        whileHover="hover"
                    >
                        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 shadow-lg text-white overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                            <CardHeader className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white">
                                        Pending Payroll
                                    </CardTitle>
                                    <AlertCircle className="w-6 h-6 text-white/80" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <p className="text-5xl font-bold text-white mb-2">
                                    {pendingPayroll}
                                </p>
                                <p className="text-white/90 text-sm font-medium">
                                    Awaiting admin approval
                                </p>
                                <div className="mt-4 pt-4 border-t border-white/20">
                                    <p className="text-xs text-white/80">
                                        {((pendingPayroll / totalPayroll) * 100).toFixed(0)}% of total payroll
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Approved Payroll Card */}
                    <motion.div
                        variants={cardHoverVariants}
                        whileHover="hover"
                    >
                        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 shadow-lg text-white overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                            <CardHeader className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white">
                                        Approved Payroll
                                    </CardTitle>
                                    <CheckCircle className="w-6 h-6 text-white/80" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <p className="text-5xl font-bold text-white mb-2">
                                    {approvedPayroll}
                                </p>
                                <p className="text-white/90 text-sm font-medium">
                                    Successfully approved by admin
                                </p>
                                <div className="mt-4 pt-4 border-t border-white/20">
                                    <p className="text-xs text-white/80">
                                        {((approvedPayroll / totalPayroll) * 100).toFixed(0)}% of total payroll
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Department Breakdown Table */}
                <motion.div
                    variants={itemVariants}
                    className="mb-8"
                >
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-50">
                                Department Breakdown
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Employee count and verification status by department
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-800">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                                Department
                                            </th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                                Total
                                            </th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                                Verified
                                            </th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                                Rate
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departmentStats.map((dept, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                                                    {dept.name}
                                                </td>
                                                <td className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">
                                                    {dept.count}
                                                </td>
                                                <td className="text-center py-3 px-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                        {dept.verified}
                                                    </span>
                                                </td>
                                                <td className="text-center py-3 px-4">
                                                    <div className="flex items-center justify-center">
                                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {((dept.verified / dept.count) * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Payroll Requests */}
                <motion.div
                    variants={itemVariants}
                >
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-50">
                                Recent Payroll Requests
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Latest payroll entries
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-800">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                                ID
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                                Employee
                                            </th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                                Amount
                                            </th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                                Status
                                            </th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentPayroll.map((record, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400 font-mono text-xs">
                                                    {record._id?.slice(-6) || "N/A"}
                                                </td>
                                                <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                                                    {record.employeeName || "Unknown"}
                                                </td>
                                                <td className="text-center py-3 px-4 text-gray-900 dark:text-gray-100 font-semibold">
                                                    ${record.amount || "0"}
                                                </td>
                                                <td className="text-center py-3 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        record.status === "approved"
                                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                                    }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">
                                                    {new Date(record.date).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HRDashboard;