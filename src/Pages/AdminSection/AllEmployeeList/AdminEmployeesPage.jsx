import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const baseURL = import.meta.env.VITE_API_URL;

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fireModalOpen, setFireModalOpen] = useState(false);
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newSalary, setNewSalary] = useState("");

  // ✅ Fetch all verified users
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${baseURL}/vfusers/verified`, { withCredentials: true });
      console.log('fetched employee for admin', res.data);
      setEmployees(res.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ Fire an employee
  const fireEmployee = async (userId) => {
    try {
      await axios.patch(`${baseURL}/vfusers/${userId}/fire`, {}, { withCredentials: true });
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === userId ? { ...emp, status: "fired" } : emp
        )
      );
    } catch (err) {
      console.error("Error firing employee:", err);
    }
  };

  // ✅ Make Employee HR
  const makeHR = async (userId) => {
    try {
      await axios.patch(`${baseURL}/vfusers/${userId}/makeHR`, {}, { withCredentials: true });
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === userId ? { ...emp, role: "HR" } : emp
        )
      );
    } catch (err) {
      console.error("Error making HR:", err);
    }
  };

  // ✅ Update Salary
  const updateSalary = async (userId) => {
    if (!newSalary || isNaN(newSalary)) return alert("Enter a valid salary");
    console.log('newsalary before update', newSalary);
    try {
      await axios.patch(
        `${baseURL}/vfusers/${userId}/salary`,
        { Salary: Number(newSalary) },  // ✅ Always send as string
        { withCredentials: true }
      );

      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === userId ? { ...emp, Salary: Number(newSalary) } : emp
        )
      );

      setSalaryModalOpen(false);
      setNewSalary("");
    } catch (err) {
      console.error("Error updating salary:", err.response?.data || err);
    }
  };

  //console.log('employees', employees);
  if (loading) return <p className="text-center mt-6">Loading employees...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Verified Employees</h1>

      {/* ✅ Responsive table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead className="text-gray-800 dark:text-gray-200">Name</TableHead>
              <TableHead className="text-gray-800 dark:text-gray-200">Designation</TableHead>
              <TableHead className="text-gray-800 dark:text-gray-200">Salary</TableHead>
              <TableHead className="text-gray-800 dark:text-gray-200">Make HR</TableHead>
              <TableHead className="text-gray-800 dark:text-gray-200">Adjust Salary</TableHead>
              <TableHead className="text-gray-800 dark:text-gray-200">Fire</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableCell className="dark:text-gray-300">{emp.name || "No Name"}</TableCell>
                <TableCell className="capitalize dark:text-gray-300">
                  {emp.role === "HR" ? "HR" : "Employee"}
                </TableCell>
                <TableCell className="dark:text-gray-300">{emp.Salary || "Not set"}</TableCell>

                {/* ✅ Make HR Button */}
                <TableCell>
                  {emp.role === "employee" && emp.status !== "fired" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => makeHR(emp._id)}
                    >
                      Make HR
                    </Button>
                  ) : emp.role === "hr" ? (
                    <span className="text-green-600 font-medium">Already HR</span>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* ✅ Adjust Salary Button */}
                <TableCell>
                  {emp.status !== "fired" ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedUser(emp);
                        setSalaryModalOpen(true);
                      }}
                    >
                      Adjust
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* ✅ Fire Button */}
                <TableCell>
                  {emp.status === "fired" ? (
                    <span className="text-red-500 font-semibold">Fired</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedUser(emp);
                        setFireModalOpen(true);
                      }}
                    >
                      Fire
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ✅ Fire Confirmation Modal */}
      <Dialog open={fireModalOpen} onOpenChange={setFireModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Firing</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to <span className="font-bold text-red-500">fire {selectedUser?.name}</span>?
            They won’t be able to log in anymore.
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setFireModalOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                fireEmployee(selectedUser._id);
                setFireModalOpen(false);
              }}
            >
              Yes, Fire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Salary Adjust Modal */}
      <Dialog open={salaryModalOpen} onOpenChange={setSalaryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Salary for {selectedUser?.email}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="text-sm font-medium">
              Enter new salary:
              <Input
                type="text"
                placeholder="Enter salary"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                className="mt-1"
              />
            </label>
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setSalaryModalOpen(false)}>Cancel</Button>
            <Button
              variant="default"
              onClick={() => updateSalary(selectedUser._id)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
