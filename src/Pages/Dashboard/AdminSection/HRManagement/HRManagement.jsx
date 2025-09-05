import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash } from "lucide-react";

export default function HRManagement() {
  const [hrs, setHrs] = useState([
    { id: 1, name: "Sarah Johnson", email: "sarah@company.com", department: "Recruitment", status: "Active" },
    { id: 2, name: "Michael Smith", email: "michael@company.com", department: "Employee Relations", status: "Active" },
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">HR Management</h2>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Add New HR
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Total HRs</p><p className="text-2xl font-bold">{hrs.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Active HRs</p><p className="text-2xl font-bold">{hrs.filter(h => h.status==="Active").length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Pending Requests</p><p className="text-2xl font-bold">3</p></CardContent></Card>
      </div>

      {/* HR Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hrs.map(hr => (
                <TableRow key={hr.id}>
                  <TableCell>{hr.name}</TableCell>
                  <TableCell>{hr.email}</TableCell>
                  <TableCell>{hr.department}</TableCell>
                  <TableCell>{hr.status}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="outline"><Edit size={14} /></Button>
                    <Button size="sm" variant="destructive"><Trash size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* HR Activity Logs (Future Section) */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">HR Activity Logs</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Sarah Johnson approved leave request for Employee #123</li>
            <li>Michael Smith processed salary for 5 employees</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}