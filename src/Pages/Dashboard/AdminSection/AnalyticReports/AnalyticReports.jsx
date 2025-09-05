import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer } from "recharts";

const employeesData = [
  { name: "Verified", value: 80 },
  { name: "Non-Verified", value: 20 },
];

const payrollData = [
  { month: "Jan", payroll: 25000 },
  { month: "Feb", payroll: 30000 },
  { month: "Mar", payroll: 28000 },
];

const departmentData = [
  { name: "HR", count: 10 },
  { name: "IT", count: 40 },
  { name: "Finance", count: 15 },
  { name: "Sales", count: 25 },
];

const COLORS = ["#0088FE", "#FF8042"];

export default function AnalyticsReports() {
  return (
    <div className="p-6 grid gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Employees</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">120</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Monthly Payroll</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">$28,000</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Tasks</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">56</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Turnover Rate</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">5%</CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader><CardTitle>Employee Verification Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={employeesData} cx="50%" cy="50%" outerRadius={80} label>
                  {employeesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader><CardTitle>Employees Per Department</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Payroll Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={payrollData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="payroll" stroke="#FF8042" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Export Reports */}
      <div className="flex justify-end">
        <Button>Export Report (PDF)</Button>
      </div>
    </div>
  );
}
