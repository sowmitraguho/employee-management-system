import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Check } from "lucide-react";

const initialTasks = [
  { id: 1, name: "Update Employee Records", assignedTo: "Sarah Johnson", department: "HR", priority: "High", status: "Pending" },
  { id: 2, name: "Prepare Payroll", assignedTo: "Michael Smith", department: "Finance", priority: "Medium", status: "In Progress" },
  { id: 3, name: "Website Maintenance", assignedTo: "Alice Johnson", department: "IT", priority: "Low", status: "Completed" },
];

export default function TaskManagement() {
  const [tasks, setTasks] = useState(initialTasks);

  const markComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: "Completed" } : task));
  };

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen space-y-6 dark:text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Task Management</h2>
        <Button className="flex items-center gap-2"><Plus size={16} /> Add New Task</Button>
      </div>

      {/* Task Table */}
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="dark:bg-gray-800">
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-gray-700">
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.assignedTo}</TableCell>
                  <TableCell>{task.department}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell className={`${task.status === "Completed" ? "text-green-400" : "text-yellow-300"}`}>{task.status}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="outline"><Edit size={14} /></Button>
                    <Button size="sm" variant="destructive"><Trash size={14} /></Button>
                    {task.status !== "Completed" && (
                      <Button size="sm" variant="secondary" onClick={() => markComplete(task.id)}>
                        <Check size={14} /> Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
