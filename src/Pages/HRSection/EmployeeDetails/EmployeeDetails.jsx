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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "../../../Components/Spinner/Spinner";

const EmployeeDetails = () => {
  const { email } = useParams();
  const [employee, setEmployee] = useState(null);
  const [employeeSalaryHistory, setEmployeeSalaryHistory] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.log(data);
        setEmployeeSalaryHistory(data);
        console.log('salary data',data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setLoading(false);
      }
    };

    fetchEmployee();
    fetchEmployeeHistory();
  }, [email]);

  if (loading) return <div className="text-center mt-10">
    Loading...
    <Spinner/>
    </div>;

  if (!employee) return <div className="text-center mt-10">Employee not found!</div>;

  // Prepare salary data for recharts
  const chartData = employeeSalaryHistory.payments?.map((item) => ({
    month: `${item.month}-${item.year}`,
    salary: item.salaryAmount,
  }));
  console.log('chart data', chartData);
  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      {/* Employee Info Card */}
      <Card className="flex flex-col md:flex-row items-center gap-4 p-4 shadow-lg">
        <img
          src={employee.photoURL || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"}
          alt={employee.name}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">{employee.name}</h2>
          <p className="text-gray-500">{employee.Designation}</p>
        </div>
      </Card>

      {/* Salary Chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Salary History</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="salary" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">No salary data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDetails;
