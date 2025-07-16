import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
//import { toast } from "@/components/ui/use-toast";
import axios from "axios";

export default function PayrollPage() {
    const [role, setRole] = useState("hr"); // ✅ Replace with logged-in user role
    const queryClient = useQueryClient();
    const baseURL = import.meta.env.VITE_API_URL;

    // ✅ Fetch payroll data
    const { data: payrollData = [], isLoading } = useQuery({
        queryKey: ["payroll"],
        queryFn: async () => {
            const res = await axios.get(`${baseURL}/payroll`);
            return res.json();
        },
    });

    // ✅ Mutation for HR → Send payment request
    const sendPayrollRequest = useMutation({
        mutationFn: async (employeeId) => {
            const res = await axios.post(`${baseURL}/payroll/request`, { employeeId }, {
                headers: { "Content-Type": "application/json" },
            });
            return res.json();
        },
        onSuccess: () => {
           // toast({ title: "Payroll request sent ✅" });
            queryClient.invalidateQueries(["payroll"]);
        },
    });

    // ✅ Mutation for Admin → Approve/Reject payroll
    const updatePayrollStatus = useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await axios.patch(`${baseURL}/payroll/${id}`, { status }, {
                headers: { "Content-Type": "application/json" },
            });
            return res.json();
        },
        onSuccess: () => {
           // toast({ title: "Payroll updated ✅" });
            queryClient.invalidateQueries(["payroll"]);
        },
    });

    if (isLoading) return <p>Loading payroll data...</p>;

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Payroll Section ({role} View)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Month</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payrollData.map((record) => (
                                <TableRow key={record._id}>
                                    <TableCell>{record.employeeName}</TableCell>
                                    <TableCell>{record.month}</TableCell>
                                    <TableCell>${record.amount}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded text-white ${record.status === "pending"
                                                ? "bg-yellow-500"
                                                : record.status === "approved"
                                                    ? "bg-green-500"
                                                    : record.status === "rejected"
                                                        ? "bg-red-500"
                                                        : "bg-gray-500"
                                                }`}
                                        >
                                            {record.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {role === "HR" && record.status === "none" && (
                                            <Button
                                                onClick={() => sendPayrollRequest.mutate(record.employeeId)}
                                            >
                                                Send for Payment
                                            </Button>
                                        )}

                                        {role === "Admin" && record.status === "pending" && (
                                            <div className="space-x-2">
                                                <Button
                                                    className="bg-green-600"
                                                    onClick={() =>
                                                        updatePayrollStatus.mutate({ id: record._id, status: "approved" })
                                                    }
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() =>
                                                        updatePayrollStatus.mutate({ id: record._id, status: "rejected" })
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}

                                        {role === "Employee" && <span>-</span>}
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
