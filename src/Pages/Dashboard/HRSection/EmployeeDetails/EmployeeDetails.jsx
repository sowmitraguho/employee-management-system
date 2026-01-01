import { useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import Spinner from "../../../../Components/Spinner/Spinner";
import { motion } from "framer-motion";
import useProtectedAxios from "../../../../Hooks/useProtectedAxios";
import {
  Mail,
  Building2,
  DollarSign,
  Calendar,
  Briefcase,
  TrendingUp,
  User,
  Phone,
  MapPin,
  Award,
} from "lucide-react";

const EmployeeDetails = () => {
  const { email } = useParams();
  const [employee, setEmployee] = useState(null);
  const [employeeSalaryHistory, setEmployeeSalaryHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Multi-color bar colors
  const COLORS = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#06b6d4", // cyan
    "#f43f5e", // rose
    "#14b8a6", // teal
  ];

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await useProtectedAxios.get(
          `${import.meta.env.VITE_API_URL}/users/${email}`
        );
        setEmployee(res.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployeeHistory = async () => {
      try {
        const res = await useProtectedAxios.get(
          `${import.meta.env.VITE_API_URL}/payments/${email}`
        );
        setEmployeeSalaryHistory(res.data);
      } catch (error) {
        console.error("Error fetching salary history:", error);
      }
    };

    fetchEmployee();
    fetchEmployeeHistory();
  }, [email]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Spinner />
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
            Loading employee details...
          </p>
        </div>
      </div>
    );

  if (!employee)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400 font-medium text-center">
              Employee not found!
            </p>
          </CardContent>
        </Card>
      </div>
    );

  // Prepare salary data for recharts
  const chartData = employeeSalaryHistory?.payments?.map((item) => ({
    month: `${item.month.substring(0, 3)}-${item.year}`,
    salary: item.salaryAmount,
    fullMonth: item.month,
  })) || [];

  // Calculate statistics
  const totalSalaryPaid = chartData.reduce((sum, item) => sum + (item.salary || 0), 0);
  const averageSalary =
    chartData.length > 0 ? (totalSalaryPaid / chartData.length).toFixed(0) : 0;
  const maxSalary = chartData.length > 0 ? Math.max(...chartData.map((item) => item.salary)) : 0;
  const minSalary =
    chartData.length > 0 ? Math.min(...chartData.map((item) => item.salary)) : 0;

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

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4 md:p-8 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            Employee Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            View comprehensive employee information and salary history
          </p>
        </motion.div>

        {/* Employee Info Card */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* Background Header */}
            <div className="relative h-32 md:h-40 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-800">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/5 rounded-full -mr-20 -mt-20"></div>
            </div>

            <CardContent className="px-6 md:px-8 pb-8 pt-6">
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center -mt-20 relative z-10">
                {/* Profile Image */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0"
                >
                  <div className="relative w-40 h-40 rounded-2xl border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
                    <img
                      src={
                        employee.imageUrl ||
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
                      }
                      alt={employee.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                      {employee.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-medium">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {employee.Designation || "Employee"}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-sm font-medium">
                        <Building2 className="w-4 h-4 mr-2" />
                        {employee.department || "Department"}
                      </span>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {employee.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Bank Account</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 font-mono">
                          {employee.bankAccountNo || employee.bank_account_no || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Current Salary</p>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          ৳{employee.Salary?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Joining Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {employee.joiningDate || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics Cards */}
        {chartData.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <motion.div
              variants={cardHoverVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Total Paid
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    ৳{totalSalaryPaid.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardHoverVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Average
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    ৳{parseInt(averageSalary).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardHoverVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Highest
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    ৳{maxSalary.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardHoverVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Records
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    {chartData.length}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Salary History Chart */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                Salary History
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {chartData.length} payment records found
              </p>
            </CardHeader>
            <CardContent className="p-6">
              {chartData?.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full"
                >
                  <div className="h-[320px] md:h-[400px] lg:h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                      >
                        <defs>
                          <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                        {/* X & Y Axes */}
                        <XAxis
                          dataKey="month"
                          stroke="#9ca3af"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis stroke="#9ca3af" />

                        {/* Chart Tooltip */}
                        <Tooltip
                          cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                          formatter={(value) => [
                            `৳${value.toLocaleString()}`,
                            "Salary",
                          ]}
                        />
                        <Legend
                          wrapperStyle={{
                            paddingTop: "20px",
                          }}
                        />

                        {/* Multi-color bars with animation */}
                        <Bar
                          dataKey="salary"
                          radius={[8, 8, 0, 0]}
                          animationDuration={800}
                          fill="url(#colorSalary)"
                        >
                          {chartData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Chart Info */}
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                      💡 Salary history shows all approved payments. Each bar represents monthly salary
                      payment.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    No salary data available
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Payment records will appear here once salaries are processed
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmployeeDetails;