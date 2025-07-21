import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Spinner from "../../../Components/Spinner/Spinner";
import { useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import useProtectedAxios from "../../../Hooks/useProtectedAxios";

const fetchEmployees = async () => {
  const res = await useProtectedAxios.get(`${import.meta.env.VITE_API_URL}/users?role=employee`, { withCredentials: true });
  console.log('employees',res.data);
  return res.data;
};

const toggleVerified = async (userId, newStatus) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isVerified: newStatus }),
  });
  const data = await res.json();
  return data;
};


const createPayrollRequest = async (requestData) => {
  console.log('createPayRollRequest', requestData);
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/payroll/request`,
      requestData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // ✅ axios automatically parses JSON → return res.data
    return res.data;

  } catch (error) {
    console.error("❌ Error creating payroll request:", error);

    // ✅ Show useful error message
    if (error.response) {
      // Server responded with an error status
      console.error("Server Error:", error.response.data);
      throw new Error(error.response.data.message || "Server error");
    } else if (error.request) {
      // No response from server
      throw new Error("No response from server. Check your network.");
    } else {
      // Something else
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

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const verifyMutation = useMutation({
    mutationFn: ({ userId, newStatus }) => toggleVerified(userId, newStatus),
    onSuccess: () => queryClient.invalidateQueries(["employees"]),
  });

  const payrollMutation = useMutation({
    mutationFn: createPayrollRequest,
    onSuccess: () => {
      setOpen(false);
      setMonth("");
      setYear("");
    },
  });

  const handleVerifyToggle = (emp) => {
    const newStatus = !emp.isVerified;
    verifyMutation.mutate({ userId: emp._id, newStatus });
  };

  const handlePayClick = (emp) => {
    setSelectedEmployee(emp);
    setOpen(true);
  };

  const handleSubmitPay = () => {
    if (!month || !year || !selectedEmployee) {
      console.log('month - year - selectedEmployee', month, year, selectedEmployee);
      return;
    }
    console.log('month - year - selectedEmployee', month, year, selectedEmployee);

    const requestData = {
      employeeId: selectedEmployee._id,
      employeeName: selectedEmployee.name,
      employeeEmail: selectedEmployee.email,
      employeeSalary: selectedEmployee.Salary,
      employeeBankAcc: selectedEmployee.bankAccountNo || selectedEmployee.bank_account_no,
      employeeRole: selectedEmployee.role,
      month,
      year,
      status: "pending",
      requestedBy: loggedInUser.email,
    };
    payrollMutation.mutate(requestData);
  };

  const navigate = useNavigate();

  const handleViewDetails = (email) => {
    navigate(`/dashboard/employeedetails/${email}`);
  };
  //console.log('employees from employee list: ', employees);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>

      {isLoading ? <div>
        <p>Loading...</p>
        <Spinner />
      </div> : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-700">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-800 text-gray-300 uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Bank Account</th>
                <th className="px-4 py-3">Salary</th>
                <th className="px-4 py-3">Pay</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {employees?.map((emp, idx) => (
                <tr key={emp._id + idx} className="hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {emp.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{emp.email}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleVerifyToggle(emp)}
                      className="text-xl"
                    >
                      {emp.isVerified ? "✅" : "❌"}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.bank_account_no || emp.bankAccountNo || "-"}
                  </td>
                  <td className="px-4 py-3">{emp.Salary}৳</td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      disabled={!emp.isVerified}
                      className={`${!emp.isVerified ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      onClick={() => handlePayClick(emp)}
                    >
                      Pay
                    </Button>
                  </td>
                  <td className="px-4 py-3">
                    <Button onClick={() => handleViewDetails(emp.email)} size="sm" variant="outline">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Salary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="number"
              value={selectedEmployee?.Salary || ""}
              disabled
            />
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="border rounded p-2 w-full dark:bg-[#0a0a0a]"
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>

            <Input
              placeholder="Year (e.g. 2025)"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
            <Button onClick={handleSubmitPay}>Submit Payment Request</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
