import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import useProtectedAxios from "../../../Hooks/useProtectedAxios";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import Spinner from "../../../Components/Spinner/Spinner";

const baseURL = import.meta.env.VITE_API_URL;

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fireModalOpen, setFireModalOpen] = useState(false);
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newSalary, setNewSalary] = useState("");
  const { loggedInUser } = useContext(AuthContext);

  // ✅ Fetch all verified users
  const fetchEmployees = async () => {
    try {
      const res = await useProtectedAxios.get(`${baseURL}/vfusers/verified`, {
        withCredentials: true,
      });
      console.log("fetched employee for admin", res.data);
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
    const token = await loggedInUser.getIdToken(true);
    try {
      await axios.patch(
        `${baseURL}/vfusers/${userId}/fire`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    const token = await loggedInUser.getIdToken(true);
    try {
      await axios.patch(
        `${baseURL}/vfusers/${userId}/makeHR`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    console.log("newsalary before update", newSalary);

    const token = await loggedInUser.getIdToken(true);
    try {
      await axios.patch(
        `${baseURL}/vfusers/${userId}/salary`,
        { Salary: Number(newSalary) },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  if (loading)
    return (
      <div className="flex flex-col items-center mt-10">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Loading employees...
        </p>
        <Spinner />
      </div>
    );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-teal-500 text-transparent bg-clip-text">
        ✅ Verified Employees
      </h1>

      {/* ✅ Responsive table container */}
      <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <Table className="min-w-full text-left">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-100 to-teal-100 dark:from-gray-800 dark:to-gray-700">
              <TableHead className="text-gray-900 dark:text-gray-200 p-4">
                Name
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-200 p-4">
                Role
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-200 p-4">
                Salary
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-200 p-4 text-center">
                Make HR
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-200 p-4 text-center">
                Adjust Salary
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-200 p-4 text-center">
                Fire
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employees.map((emp) => (
              <TableRow
                key={emp._id}
                className="hover:bg-blue-50 dark:hover:bg-gray-800 transition"
              >
                <TableCell className="p-4 font-medium text-gray-800 dark:text-gray-300">
                  {emp.name || "No Name"}
                </TableCell>

                <TableCell className="capitalize p-4 dark:text-gray-300">
                  {emp.role === "HR" ? (
                    <span className="px-2 py-1 rounded-md text-white bg-green-500 text-sm font-semibold">
                      HR
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-md text-white bg-blue-500 text-sm font-semibold">
                      Employee
                    </span>
                  )}
                </TableCell>

                <TableCell className="p-4 dark:text-gray-300">
                  {emp.Salary ? (
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      ${emp.Salary.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-400">Not set</span>
                  )}
                </TableCell>

                {/* ✅ Make HR Button */}
                <TableCell className="text-center">
                  {emp.role === "employee" && emp.status !== "fired" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      onClick={() => makeHR(emp._id)}
                    >
                      Make HR
                    </Button>
                  ) : emp.role === "hr" && emp.status !== "fired" ? (
                    <span className="text-green-600 font-medium">Already HR</span>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* ✅ Adjust Salary Button */}
                <TableCell className="text-center">
                  {emp.status !== "fired" ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-teal-500 hover:bg-teal-600 text-white"
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
                <TableCell className="text-center">
                  {emp.status === "fired" ? (
                    <span className="text-red-500 font-semibold">Fired</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-red-500 hover:bg-red-600 text-white"
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
        <DialogContent className="rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">
              Confirm Firing
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to{" "}
            <span className="font-bold text-red-500">{selectedUser?.name}</span>?
            They won’t be able to log in anymore.
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
              onClick={() => setFireModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
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
        <DialogContent className="rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-teal-600">
              Adjust Salary for {selectedUser?.email}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter new salary:
              <Input
                type="text"
                placeholder="Enter salary"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                className="mt-2"
              />
            </label>
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
              onClick={() => setSalaryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-teal-600 hover:bg-teal-700 text-white"
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
