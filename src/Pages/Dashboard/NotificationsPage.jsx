import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Bell } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

const data = [
  { name: "Admin", value: 10 },
  { name: "HR", value: 7 },
  { name: "Employee", value: 14 },
];

export default function NotificationsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-500" />
          Notifications
        </h1>
        <Badge variant="outline">Total: {data.reduce((a, b) => a + b.value, 0)}</Badge>
      </div>

      {/* Chart Overview */}
      <Card className="shadow-md dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="dark:bg-gray-900">Notification Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-64 dark:bg-gray-900">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Notifications Tabs */}
      <Tabs defaultValue="admin" className="w-full dark:bg-gray-900">
        <TabsList className="grid w-full grid-cols-3 dark:bg-gray-900">
          <TabsTrigger value="admin">Admin Actions</TabsTrigger>
          <TabsTrigger value="hr">HR Actions/Requests</TabsTrigger>
          <TabsTrigger value="employee">Employee Actions</TabsTrigger>
        </TabsList>

        {/* Admin Actions */}
        <TabsContent value="admin">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <Card className="dark:bg-gray-900">
              <CardContent className="dark:bg-gray-900">
                ✅ Admin approved payroll for July
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-900">
              <CardContent className="dark:bg-gray-900">
                ⚙️ Admin updated system settings
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-900">
              <CardContent className="dark:bg-gray-900">
                📊 Admin published performance report
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* HR Actions */}
        <TabsContent value="hr">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <Card>
              <CardContent className="p-4">
                📌 HR requested leave approval
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                📥 HR added new job posting
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                📑 HR updated employee contract
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Employee Actions */}
        <TabsContent value="employee">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <Card>
              <CardContent className="p-4">
                📝 Employee submitted timesheet
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                💬 Employee sent a query to HR
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                📤 Employee uploaded project files
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
