import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import Spinner from "../../../../Components/Spinner/Spinner";
import { useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../../../../Contexts/AuthContext/AuthContext";
import useProtectedAxios from "../../../../Hooks/useProtectedAxios";
import Swal from "sweetalert2";

const fetchEmployees = async () => {
  const res = await useProtectedAxios.get(
    `${import.meta.env.VITE_API_URL}/users?role=employee`,
    { withCredentials: true }
  );
  return res.data;
};

const toggleVerified = async (userId, newStatus) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/users/${userId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVerified: newStatus }),
    }
  );
  return res.json();
};

const createPayrollRequest = async (requestData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/payroll/request`,
      requestData,
      { headers: { "Content-Type": "application/json" } }
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
      const res = await useProtectedAxios.get(`${baseURL}/payroll`);
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
    setOpen(true);
  };

  const handleSubmitPay = async () => {
    if (!month || !year || !selectedEmployee) return;
    const hasMonth = payrollData.some(
      item => item.employeeEmail === selectedEmployee.email && item.month === month && item.year === year
    );
    if (hasMonth) {
      
      Swal.fire({
        title: "Oops... ",
        text: "This Month's Salary is already paid!",
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

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Employee Management
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage employee verification & salary requests
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-2">
          <Spinner />
          <p className="text-gray-600 dark:text-gray-400">Loading employees...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-center">Verified</th>
                <th className="px-4 py-3 text-left">Bank Account</th>
                <th className="px-4 py-3 text-center">Salary</th>
                <th className="px-4 py-3 text-center">Pay</th>
                <th className="px-4 py-3 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {employees?.map((emp) => (
                <tr
                  key={emp._id}
                  className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                    {emp.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {emp.email}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleVerifyToggle(emp)}
                      disabled={emp.status === "fired"}
                      className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${emp.isVerified
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        } ${emp.status === "fired"
                          ? "cursor-not-allowed" // show 'not-allowed' cursor if fired
                          : "cursor-pointer" // normal clickable cursor
                        }`}
                      title={emp.status === "fired" ? "Employee Fired" : "Employee Active"} // Tooltip on hover
                    >
                      {emp.isVerified ? "Verified ✅" : "Not Verified ❌"}
                    </button>

                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {emp.bank_account_no || emp.bankAccountNo || "-"}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-600 dark:text-blue-400">
                    {emp.Salary}৳
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      size="sm"
                      disabled={!emp.isVerified || emp.status === "fired"}
                      className={`${!emp.isVerified
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                        }`}
                      onClick={() => handlePayClick(emp)}
                      title={emp.status === "fired" ? "Employee Fired" : "Employee Active"}
                    >
                      Pay
                    </Button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      onClick={() => handleViewDetails(emp.email)}
                      size="sm"
                      variant="outline"
                      className="border-blue-400 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pay Salary Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white dark:bg-gray-900 rounded-xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Pay Salary to{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {selectedEmployee?.name}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              type="number"
              value={selectedEmployee?.Salary || ""}
              disabled
              className="bg-gray-50 dark:bg-gray-800"
            />

            {/* Month Dropdown */}
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">Select Month</option>
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

            {/* Year Input */}
            <Input
              placeholder="Year (e.g. 2025)"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              className="bg-gray-50 dark:bg-gray-800"
            />

            {/* Submit Button */}
            <Button
              onClick={handleSubmitPay}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              Submit Payment Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
