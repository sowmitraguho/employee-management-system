import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import Spinner from "../../../Components/Spinner/Spinner";
import useProtectedAxios from "../../../Hooks/useProtectedAxios";
import { useContext, useState } from "react";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import PaymentModal from "./PaymentModal";

export default function PayrollPage() {
  const role = "admin"; // Can be dynamic later
  const queryClient = useQueryClient();
  const baseURL = import.meta.env.VITE_API_URL;
  const { loggedInUser } = useContext(AuthContext);

 

  // ✅ Fetch payroll data
  const {
    data: payrollData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["payroll"],
    queryFn: async () => {
      const res = await useProtectedAxios.get(`${baseURL}/payroll`);
      return res.data;
    },
  });

  // ✅ Mutation for Admin → Approve/Reject payroll
  const updatePayrollStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const token = await loggedInUser.getIdToken(true);
      const res = await axios.patch(
        `${baseURL}/payroll/${id}`,
        { status },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["payroll"]);
    },
  });

  const [selectedPayroll, setSelectedPayroll] = useState(null);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Spinner />
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading payroll data...
        </p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            💼 Payroll Section ({role.toUpperCase()} View)
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Manage employee salary payments with ease
          </p>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {/* ✅ Mobile friendly table wrapper */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <Table className="min-w-full text-sm sm:text-base">
              <TableHeader>
                <TableRow className="bg-indigo-100 dark:bg-indigo-900">
                  <TableHead className="text-indigo-800 dark:text-indigo-300">
                    Employee
                  </TableHead>
                  <TableHead className="text-indigo-800 dark:text-indigo-300">
                    Month
                  </TableHead>
                  <TableHead className="text-indigo-800 dark:text-indigo-300">
                    Year
                  </TableHead>
                  <TableHead className="text-indigo-800 dark:text-indigo-300">
                    Amount
                  </TableHead>
                  <TableHead className="text-indigo-800 dark:text-indigo-300">
                    Status
                  </TableHead>
                  <TableHead className="text-indigo-800 dark:text-indigo-300">
                    Payment Date
                  </TableHead>
                  <TableHead className="text-indigo-800 dark:text-indigo-300">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {payrollData.map((record) => {
                  // Badge color based on status
                  const statusClasses =
                    record.status === "pending"
                      ? "bg-yellow-500"
                      : record.status === "approved"
                      ? "bg-green-600"
                      : record.status === "rejected"
                      ? "bg-red-500"
                      : "bg-gray-500";

                  return (
                    <TableRow
                      key={record._id}
                      className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-all"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                        {record.employeeName}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {record.month}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {record.year}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100 font-semibold">
                        💲{record.employeeSalary}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-white text-xs sm:text-sm ${statusClasses}`}
                        >
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {record.paymentDate
                          ? new Date(record.paymentDate).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {role === "admin" && record.status === "pending" && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            {/* ✅ Pay Now Button */}
                            <Button
                              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                              onClick={() =>
                                setSelectedPayroll({
                                  ...record,
                                  refetchPayroll: refetch,
                                })
                              }
                            >
                              ✅ Pay Now
                            </Button>

                            {/* ✅ Reject Button */}
                            <Button
                              variant="destructive"
                              className="w-full sm:w-auto"
                              onClick={() =>
                                updatePayrollStatus.mutate({
                                  id: record._id,
                                  status: "rejected",
                                })
                              }
                            >
                              ❌ Reject
                            </Button>
                          </div>
                        )}

                        {role === "employee" && (
                          <span className="text-gray-500 dark:text-gray-400">
                            -
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Payment Modal */}
      <PaymentModal
        open={!!selectedPayroll}
        onClose={() => setSelectedPayroll(null)}
        payroll={selectedPayroll}
      />
    </div>
  );
}
