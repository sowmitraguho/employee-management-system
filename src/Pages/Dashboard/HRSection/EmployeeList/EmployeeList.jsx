import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Spinner from "../../../../Components/Spinner/Spinner";
import { useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../../../../Contexts/AuthContext/AuthContext";
import useProtectedAxios from "../../../../Hooks/useProtectedAxios";
import Swal from "sweetalert2";
import { 
  User, Mail, Check, X, DollarSign, Eye, Send, 
  Calendar, Building2, FileText, BadgeCheck 
} from "lucide-react";

const fetchEmployees = async () => {
  const res = await useProtectedAxios.get(
    `${import.meta.env.VITE_API_URL}/users?role=employee`,
    { withCredentials: true }
  );
  return res.data;
};

const toggleVerified = async (userId, newStatus) => {
  const res = await useProtectedAxios.patch(
    `${import.meta.env.VITE_API_URL}/users/${userId}`,
    { isVerified: newStatus }
  );
  return res.json();
};

const createPayrollRequest = async (requestData) => {
  try {
    const res = await useProtectedAxios.post(
      `${import.meta.env.VITE_API_URL}/payments/request`,
      requestData
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error creating payroll request:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "Server error");
    } else if (error.request) {
      throw new Error("No response from server. Check your network.");
    } else {
      throw new Error(error.message || "Unexpected error");
    }
  }
};

export default function EmployeeList() {
  const queryClient = useQueryClient();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [open, setOpen] = useState(false);
  const { loggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const {
    data: payrollData = [],
    isPayLoading,
    refetch,
  } = useQuery({
    queryKey: ["payroll"],
    queryFn: async () => {
      const res = await useProtectedAxios.get(`${baseURL}/payments`);
      return res.data;
    },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ userId, newStatus }) =>
      toggleVerified(userId, newStatus),
    onSuccess: () => queryClient.invalidateQueries(["employees"]),
  });

  const payrollMutation = useMutation({
    mutationFn: createPayrollRequest,
    onSuccess: () => {
      setMonth("");
      setYear("");
      refetch();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Added for approval of Admin!",
        showConfirmButton: false,
        timer: 1500
      });
      setOpen(false);
    },
  });

  const handleVerifyToggle = (emp) => {
    verifyMutation.mutate({
      userId: emp._id,
      newStatus: !emp.isVerified,
    });
  };

  const handlePayClick = (emp) => {
    setSelectedEmployee(emp);
    setMonth("");
    setYear("");
    setOpen(true);
  };

  const handleSubmitPay = async () => {
    if (!month || !year || !selectedEmployee) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all fields",
      });
      return;
    }
    
    const hasMonth = payrollData.some(
      item => item.employeeEmail === selectedEmployee.email && item.month === month && item.year === year
    );
    
    if (hasMonth) {
      Swal.fire({
        title: "Already Paid",
        text: "This month's salary is already paid!",
        icon: "error",
        draggable: true
      });
      setOpen(false);
    } else {
      const requestData = {
        employeeId: selectedEmployee._id,
        employeeName: selectedEmployee.name,
        employeeEmail: selectedEmployee.email,
        employeeSalary: selectedEmployee.Salary,
        employeeBankAcc:
          selectedEmployee.bankAccountNo || selectedEmployee.bank_account_no,
        employeeRole: selectedEmployee.role,
        month,
        year,
        status: "pending",
        requestedBy: loggedInUser.email,
      };
      payrollMutation.mutate(requestData);
    }
  };

  const handleViewDetails = (email) => {
    navigate(`/dashboard/employeedetails/${email}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4 md:p-8 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            Employee Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage employee verification, salary requests, and view details
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Employees
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                  {employees.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Verified
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                  {employees.filter(e => e.isVerified).length}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <BadgeCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Unverified
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                  {employees.filter(e => !e.isVerified).length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table Section */}
        <motion.div variants={itemVariants}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <Spinner />
              <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">
                Loading employees...
              </p>
            </div>
          ) : employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <User className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                No employees found
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <User className="w-4 h-4 inline mr-2" />
                        Name
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </th>
                      <th className="px-4 md:px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <BadgeCheck className="w-4 h-4 inline mr-2" />
                        Status
                      </th>
                      <th className="px-4 md:px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                        <Building2 className="w-4 h-4 inline mr-2" />
                        Bank Account
                      </th>
                      <th className="px-4 md:px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        Salary
                      </th>
                      <th className="px-4 md:px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {employees?.map((emp, idx) => (
                      <motion.tr
                        key={emp._id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-blue-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        {/* Name */}
                        <td className="px-4 md:px-6 py-4 font-semibold text-gray-900 dark:text-gray-50">
                          {emp.name}
                        </td>

                        {/* Email */}
                        <td className="px-4 md:px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                          {emp.email}
                        </td>

                        {/* Verification Status */}
                        <td className="px-4 md:px-6 py-4 text-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleVerifyToggle(emp)}
                            disabled={emp.status === "fired"}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                              emp.isVerified
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            } ${
                              emp.status === "fired"
                                ? "opacity-60 cursor-not-allowed"
                                : "cursor-pointer hover:shadow-md"
                            }`}
                            title={emp.status === "fired" ? "Employee Fired" : "Click to toggle"}
                          >
                            {emp.isVerified ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span className="hidden sm:inline">Verified</span>
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4" />
                                <span className="hidden sm:inline">Pending</span>
                              </>
                            )}
                          </motion.button>
                        </td>

                        {/* Bank Account */}
                        <td className="px-4 md:px-6 py-4 text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell font-mono">
                          {emp.bank_account_no || emp.bankAccountNo || "-"}
                        </td>

                        {/* Salary */}
                        <td className="px-4 md:px-6 py-4 text-center font-semibold text-blue-600 dark:text-blue-400 hidden lg:table-cell">
                          ৳{emp.Salary?.toLocaleString()}
                        </td>

                        {/* Actions */}
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                size="sm"
                                disabled={!emp.isVerified || emp.status === "fired"}
                                onClick={() => handlePayClick(emp)}
                                className={`inline-flex items-center gap-2 ${
                                  !emp.isVerified || emp.status === "fired"
                                    ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-700"
                                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-sm hover:shadow-md"
                                }`}
                                title={emp.status === "fired" ? "Employee Fired" : "Pay salary"}
                              >
                                <Send className="w-4 h-4" />
                                <span className="hidden sm:inline">Pay</span>
                              </Button>
                            </motion.div>

                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                onClick={() => handleViewDetails(emp.email)}
                                size="sm"
                                variant="outline"
                                className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 inline-flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                            </motion.div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {/* Pay Salary Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-lg max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                Process Salary Payment
              </DialogTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Submit salary request for{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {selectedEmployee?.name}
                </span>
              </p>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* Salary Display */}
              <div>
                <Label className="text-sm font-semibold mb-2">Salary Amount</Label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="text"
                    value={`৳ ${selectedEmployee?.Salary?.toLocaleString() || ""}`}
                    disabled
                    className="pl-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Month Dropdown */}
              <div>
                <Label className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Month
                </Label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 bg-white dark:bg-gray-800 dark:text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a month</option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Input */}
              <div>
                <Label className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Year
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 2025"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="2020"
                  max={new Date().getFullYear()}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleSubmitPay}
                  disabled={payrollMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {payrollMutation.isPending ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 inline mr-2" />
                      Submit for Admin Approval
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                  💡 Employee must be verified to process payment
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}