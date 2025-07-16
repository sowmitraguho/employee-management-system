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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "../../../Components/Spinner/Spinner";

const EmployeeDetails = () => {
  const { email } = useParams();
  const [employee, setEmployee] = useState(null);
  const [employeeSalaryHistory, setEmployeeSalaryHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Predefined bar colors (loops if more data)
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setLoading(false);
      }
    };

    const fetchEmployeeHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/${email}`);
        const data = await res.json();
        setEmployeeSalaryHistory(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching salary history:", error);
        setLoading(false);
      }
    };

    fetchEmployee();
    fetchEmployeeHistory();
  }, [email]);

  if (loading)
    return (
      <div className="text-center mt-10">
        Loading...
        <Spinner />
      </div>
    );

  if (!employee) return <div className="text-center mt-10">Employee not found!</div>;

  // Prepare salary data for recharts
  const chartData = employeeSalaryHistory?.payments?.map((item) => ({
    month: `${item.month}-${item.year}`,
    salary: item.salaryAmount,
  }));

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4">
      {/* Employee Info Card */}
      <Card className="flex flex-col md:flex-row items-center gap-4 p-4 shadow-lg dark:bg-gray-900">
        <img
          src={
            employee.imageUrl ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
          }
          alt={employee.name}
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
        />
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {employee.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {employee.Designation}
          </p>
        </div>
      </Card>

      {/* Salary Chart */}
      <Card className="mt-6 dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-50">
            Salary History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData?.length > 0 ? (
            <div className="w-full h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--tw-prose-invert)"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "currentColor" }}
                    stroke="currentColor"
                  />
                  <YAxis tick={{ fill: "currentColor" }} stroke="currentColor" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg, #fff)",
                      color: "var(--tooltip-text, #000)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="salary">
                    {chartData.map((entry, index) => (
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
            <p className="text-center text-gray-500 dark:text-gray-300">
              No salary data available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDetails;
