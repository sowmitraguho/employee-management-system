import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const departments = [
  { id: 1, name: "Engineering", head: "Alice Johnson", employees: 35, projects: 8 },
  { id: 2, name: "Marketing", head: "David Smith", employees: 20, projects: 5 },
  { id: 3, name: "HR", head: "Sophia Lee", employees: 10, projects: 2 },
];

const employeeDistribution = [
  { name: "Engineering", value: 35 },
  { name: "Marketing", value: 20 },
  { name: "HR", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function DepartmentPage() {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Department List */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Head</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{dept.head}</TableCell>
                  <TableCell>{dept.employees}</TableCell>
                  <TableCell>{dept.projects}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="destructive" className="ml-2">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button className="mt-4">+ Add Department</Button>
        </CardContent>
      </Card>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={employeeDistribution} dataKey="value" nameKey="name" outerRadius={100}>
                {employeeDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}