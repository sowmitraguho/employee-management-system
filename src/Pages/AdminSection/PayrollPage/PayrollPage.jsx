//import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
//import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import Spinner from "../../../Components/Spinner/Spinner";

export default function PayrollPage() {
    //const [role, setRole] = useState("hr"); // ✅ Replace with logged-in user role
    const role = 'admin';
    const queryClient = useQueryClient();
    const baseURL = import.meta.env.VITE_API_URL;

    // ✅ Fetch payroll data
    const { data: payrollData = [], isLoading } = useQuery({
        queryKey: ["payroll"],
        queryFn: async () => {
            const res = await axios.get(`${baseURL}/payroll`);
            console.log('result from payroll', res.data);
            return res.data;
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
            console.log('update payrollstatus mutation: ', res);
            return res.json();
        },
        onSuccess: () => {
            // toast({ title: "Payroll updated ✅" });
            queryClient.invalidateQueries(["payroll"]);
        },
    });

    if (isLoading) return <div>
        <p>Loading payroll data...</p>
        <Spinner />
    </div>;

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <Card className="bg-white dark:bg-gray-900 shadow-md rounded-lg">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Payroll Section ({role} View)
                    </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table className="w-full text-sm sm:text-base">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-gray-700 dark:text-gray-300">Employee</TableHead>
                                <TableHead className="text-gray-700 dark:text-gray-300">Month</TableHead>
                                <TableHead className="text-gray-700 dark:text-gray-300">Year</TableHead>
                                <TableHead className="text-gray-700 dark:text-gray-300">Amount</TableHead>
                                <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                                <TableHead className="text-gray-700 dark:text-gray-300">Payment Date</TableHead>
                                <TableHead className="text-gray-700 dark:text-gray-300">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payrollData.map((record) => (
                                <TableRow
                                    key={record._id}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <TableCell className="text-gray-800 dark:text-gray-200">{record.employeeName}</TableCell>
                                    <TableCell className="text-gray-800 dark:text-gray-200">{record.month}</TableCell>
                                    <TableCell className="text-gray-800 dark:text-gray-200">{record.year}</TableCell>
                                    <TableCell className="text-gray-800 dark:text-gray-200">${record.employeeSalary}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded text-white text-xs sm:text-sm ${record.status === "pending"
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
                                    <TableCell className="text-gray-800 dark:text-gray-200">
                                        {record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {/* ✅ HR View */}
                                        {role === "hr" && record.status === "none" && (
                                            <Button
                                                className="w-full sm:w-auto"
                                                onClick={() => sendPayrollRequest.mutate(record.employeeId)}
                                            >
                                                Send for Payment
                                            </Button>
                                        )}

                                        {/* ✅ Admin View */}
                                        {role === "admin" && record.status === "pending" && (
                                            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                                                <Button
                                                    className="bg-green-600 hover:bg-green-700" disabled={record.status === "approved" || record.status === "rejected"}
                                                    onClick={() =>
                                                        updatePayrollStatus.mutate({ id: record._id, status: "approved" })
                                                    }
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="destructive" disabled={record.status === "approved" || record.status === "rejected"}
                                                    onClick={() =>
                                                        updatePayrollStatus.mutate({ id: record._id, status: "rejected" })
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}

                                        {/* ✅ Employee View */}
                                        {role === "employee" && <span className="text-gray-500 dark:text-gray-400">-</span>}
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
