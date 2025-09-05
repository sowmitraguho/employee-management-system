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
import Spinner from "../../../../Components/Spinner/Spinner";
import useProtectedAxios from "../../../../Hooks/useProtectedAxios";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthContext/AuthContext";
import PaymentModal from "./PaymentModal";
import Loader from "../../../../Components/Loader/Loader";

export default function PayrollPage() {
  const role = "admin";
  const queryClient = useQueryClient();
  const baseURL = import.meta.env.VITE_API_URL;
  const { loggedInUser } = useContext(AuthContext);

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

  const uniquePayrollData = payrollData.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.employeeEmail === item.employeeEmail &&
          t.month === item.month &&
          t.year === item.year
      )
  );

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
      refetch();
    },
  });

  const [selectedPayroll, setSelectedPayroll] = useState(null);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // configurable

  const totalPages = Math.ceil(uniquePayrollData.length / rowsPerPage);
  const paginatedData = uniquePayrollData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Loader />
      </div>
    );

  return (
    <div className="mx-auto">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            💼 Payroll Section ({role.toUpperCase()} View)
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Manage employee salary payments with ease
          </p>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <Table className="min-w-full text-sm sm:text-base">
              <TableHeader>
                <TableRow className="bg-indigo-100 dark:bg-indigo-900">
                  <TableHead>Employee</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.map((record) => {
                  console.log("Rendering payroll record:", record);
                  const statusClasses =
                    record.employeeStatus === "fired"
                      ? "bg-red-500"
                      : record.status === "pending"
                        ? "bg-yellow-500"
                        : record.status === "approved"
                          ? "bg-green-600"
                          : record.status === "rejected"
                            ? "bg-red-500"
                            : "bg-gray-500";

                  return (
                    <TableRow key={record._id}>
                      <TableCell>{record.employeeName}</TableCell>
                      <TableCell>{record.month}</TableCell>
                      <TableCell>{record.year}</TableCell>
                      <TableCell className="font-semibold">
                        💲{record.employeeSalary}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`capitalize px-2 py-1 rounded-full text-white text-xs sm:text-sm ${statusClasses}`}
                        >
                          {record.employeeStatus === "fired"
                            ? record.employeeStatus
                            : record.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {record.paymentDate
                          ? new Date(record.paymentDate).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {role === "admin" && record.status === "pending" && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                setSelectedPayroll({
                                  ...record,
                                  refetchPayroll: refetch,
                                })
                              }
                            >
                              Pay Now
                            </Button>
                            <Button
                              variant="destructive"
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* --- Pagination Controls --- */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </Button>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PaymentModal
        open={!!selectedPayroll}
        onClose={() => setSelectedPayroll(null)}
        payroll={selectedPayroll}
      />
    </div>
  );
}
