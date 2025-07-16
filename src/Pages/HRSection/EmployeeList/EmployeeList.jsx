import { useState } from "react";
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

const fetchEmployees = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/users?role=Employee`);
  return res.json();
};

const toggleVerified = async (userId, newStatus) => {
    //console.log("Toggling user:", userId, "to", newStatus);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isVerified: newStatus }),
  });
  const data = await res.json();
  //console.log("Server response:", data);
  return data;
};

const createPayrollRequest = async (requestData) => {
  const res = await fetch("https://your-server.com/payroll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  });
  return res.json();
};

export default function EmployeeList() {
  const queryClient = useQueryClient();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [open, setOpen] = useState(false);

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
    if (!month || !year || !selectedEmployee) return;

    const requestData = {
      employeeEmail: selectedEmployee.email,
      salaryAmount: selectedEmployee.salary,
      month,
      year,
      status: "pending", // for admin approval
    };
    payrollMutation.mutate(requestData);
  };

  const navigate = useNavigate();

  const handleViewDetails = (email) => {
    navigate(`/dashboard/employeedetails/${email}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>

      {isLoading ? <div>
        <p>Loading...</p>
        <Spinner/>
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
            {employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-gray-800/50">
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
                  {emp.bank_account_no || "-"}
                </td>
                <td className="px-4 py-3">{emp.Salary}৳</td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    disabled={!emp.isVerified}
                    className={`${
                      !emp.isVerified ? "opacity-50 cursor-not-allowed" : ""
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
            <Input
              placeholder="Month (e.g. July)"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
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
