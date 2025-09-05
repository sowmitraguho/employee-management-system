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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import Spinner from "../../../../Components/Spinner/Spinner";
import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { MdAccountBalance } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";




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
  ];

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${email}`);
        const data = await res.json();
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployeeHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/${email}`);
        const data = await res.json();
        setEmployeeSalaryHistory(data);
      } catch (error) {
        console.error("Error fetching salary history:", error);
      }
    };

    fetchEmployee();
    fetchEmployeeHistory();
  }, [email]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <Spinner />
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading employee details...</p>
      </div>
    );

  if (!employee)
    return (
      <div className="text-center mt-10 text-gray-700 dark:text-gray-300">
        Employee not found!
      </div>
    );

  // Prepare salary data for recharts
  const chartData = employeeSalaryHistory?.payments?.map((item) => ({
    month: `${item.month}-${item.year}`,
    salary: item.salaryAmount,
  }));

  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Employee Info Card with animation */}
      <h2 className="text-2xl mb-4 font-bold text-gray-800 dark:text-gray-100">
          Employee Details
        </h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="flex flex-col md:flex-row items-center gap-6 p-6 shadow-xl rounded-xl bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            src={
              employee.imageUrl ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
            }
            alt={employee.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 dark:border-blue-500 shadow-md"
          />
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {employee.name}
            </h2>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {employee.Designation || "Employee"}
            </p>
            <p className="flex gap-2 items-center text-sm text-gray-600 dark:text-gray-400">
              <MdEmail className="text-purple-200" /> {employee.email}
            </p>
            <p className="flex gap-2 items-center text-sm text-gray-600 dark:text-gray-400">
              <MdAccountBalance className="text-purple-200" /> Bank: {employee.bankAccountNo || employee.bank_account_no || "Not Available"}
            </p>
            <p className="flex gap-2 items-center text-sm text-gray-600 dark:text-gray-400">
              <FaMoneyBillWave className="text-purple-200" /> Salary:{" "}
              <span className="text-green-600 dark:text-green-400 font-semibold">
                {employee.Salary}৳
              </span>
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Salary History Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="mt-8 shadow-lg rounded-xl bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Salary History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData?.length > 0 ? (
              <div className="w-full h-[320px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    {/* Grid lines */}
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />

                    {/* X & Y Axes */}
                    <XAxis dataKey="month" tick={{ fill: "currentColor" }} />
                    <YAxis tick={{ fill: "currentColor" }} />

                    {/* Chart Tooltip */}
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.05)" }}
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />

                    {/* Multi-color bars with animation */}
                    <Bar dataKey="salary" radius={[8, 8, 0, 0]} animationDuration={800}>
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
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-300 py-6">
                No salary data available
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmployeeDetails;
