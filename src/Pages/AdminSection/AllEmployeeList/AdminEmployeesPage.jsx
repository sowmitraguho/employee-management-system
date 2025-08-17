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
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Grid, List } from "lucide-react"; // icons for toggle

const baseURL = import.meta.env.VITE_API_URL;

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fireModalOpen, setFireModalOpen] = useState(false);
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newSalary, setNewSalary] = useState("");
  const { loggedInUser } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState("");

  const [viewMode, setViewMode] = useState("table"); //  toggle between table and card

  // Fetch all verified users
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

  const updateEmployeeStatus = useMutation({
    mutationFn: async (email) => {
      const token = await loggedInUser.getIdToken(true);
      const res = await axios.patch(
        `${baseURL}/payroll/${email}`,
        { employeeStatus: "fired" },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      QueryClient.invalidateQueries(["payroll"]);
    },
  });

  // Fire an employee
  const fireEmployee = async (user) => {
    const token = await loggedInUser.getIdToken(true);
    try {
      await axios.patch(
        `${baseURL}/vfusers/${user._id}/fire`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await updateEmployeeStatus.mutate(user.email);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === user._id ? { ...emp, status: "fired" } : emp
        )
      );
    } catch (err) {
      console.error("Error firing employee:", err);
    }
  };

  // Make Employee HR
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

  // Update Salary
  const updateSalary = async (user) => {
    const userId = user._id;
    const presentSalary = user.Salary;
    if (!newSalary || isNaN(newSalary) || presentSalary == newSalary) {
      setErrorMsg("Enter a valid salary.");
      return;
    }
    if (newSalary < presentSalary) {
      setErrorMsg("Salary cannot be decreased!");
      return;
    }

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
      setErrorMsg("");
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 text-transparent bg-clip-text">
          Verified Employees
        </h1>

        {/*  View Toggle Button */}
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() =>
            setViewMode((prev) => (prev === "table" ? "card" : "table"))
          }
        >
          {viewMode === "table" ? <Grid size={18} /> : <List size={18} />}
          {viewMode === "table" ? "Card View" : "Table View"}
        </Button>
      </div>

      {/*  TABLE VIEW */}
      {viewMode === "table" && (
        <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <Table className="min-w-full text-left">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-100 to-teal-100 dark:from-gray-800 dark:to-gray-700">
                <TableHead className="p-4">Name</TableHead>
                <TableHead className="p-4">Role</TableHead>
                <TableHead className="p-4">Salary</TableHead>
                <TableHead className="p-4 text-center">Make HR</TableHead>
                <TableHead className="p-4 text-center">Adjust Salary</TableHead>
                <TableHead className="p-4 text-center">Fire</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp._id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                  <TableCell className="p-4 font-medium">{emp.name || "No Name"}</TableCell>
                  <TableCell className="capitalize p-4">
                    {emp.role === "hr" ? (
                      <span className="px-2 py-1 rounded-md text-white bg-green-500 text-sm font-semibold">HR</span>
                    ) : (
                      <span className="px-2 py-1 rounded-md text-white bg-blue-500 text-sm font-semibold">{emp.role}</span>
                    )}
                  </TableCell>
                  <TableCell className="p-4">
                    {emp.Salary ? (
                      <span className="font-semibold text-teal-600 dark:text-teal-400">
                        ${emp.Salary.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not set</span>
                    )}
                  </TableCell>

                  {/*  Make HR */}
                  <TableCell className="text-center">
                    {emp.role === "employee" && emp.status !== "fired" ? (
                      <Button size="sm" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50" onClick={() => makeHR(emp._id)}>
                        Make HR
                      </Button>
                    ) : emp.role === "hr" && emp.status !== "fired" ? (
                      <span className="text-green-600 font-medium">Already HR</span>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  {/*  Adjust Salary */}
                  <TableCell className="text-center">
                    {emp.status !== "fired" ? (
                      <Button size="sm" variant="secondary" className="bg-teal-500 hover:bg-teal-600 text-white" onClick={() => {
                        setSelectedUser(emp);
                        setSalaryModalOpen(true);
                      }}>
                        Adjust Salary
                      </Button>
                    ) : "-"}
                  </TableCell>

                  {/*  Fire */}
                  <TableCell className="text-center">
                    {emp.status === "fired" ? (
                      <span className="text-red-500 font-semibold">Fired</span>
                    ) : (
                      <Button size="sm" variant="destructive" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => {
                        setSelectedUser(emp);
                        setFireModalOpen(true);
                      }}>
                        Fire
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/*  CARD GRID VIEW */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <Card key={emp._id} className="shadow-lg border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{emp.name || "No Name"}</span>
                  {emp.status === "fired" && (
                    <span className="text-red-500 text-sm font-semibold">Fired</span>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Role:</span>{" "}
                  {emp.role === "hr" ? (
                    <span className="text-green-600 font-semibold">HR</span>
                  ) : (
                    <span className="text-blue-600 capitalize">{emp.role}</span>
                  )}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Salary:</span>{" "}
                  {emp.Salary ? (
                    <span className="text-teal-600 font-semibold">${emp.Salary.toLocaleString()}</span>
                  ) : (
                    "Not set"
                  )}
                </p>
                <p className="text-sm text-gray-500">{emp.email}</p>
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 justify-between">
                {/*  Make HR */}
                {emp.role === "employee" && emp.status !== "fired" ? (
                  <Button size="sm" variant="outline" className="border border-blue-400" onClick={() => makeHR(emp._id)}>
                    Make HR
                  </Button>
                ) : emp.role === "hr" && emp.status !== "fired" ? (
                  <span className="text-green-600 font-medium text-sm">Already HR</span>
                ) : null}

                {/*  Adjust Salary */}
                {emp.status !== "fired" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="border border-blue-400"
                    onClick={() => {
                      setSelectedUser(emp);
                      setSalaryModalOpen(true);
                    }}
                  >
                    Adjust Salary
                  </Button>
                )}

                {/*  Fire */}
                {emp.status !== "fired" && (
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
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/*  Fire Confirmation Modal */}
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
            <Button variant="outline" onClick={() => setFireModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              fireEmployee(selectedUser);
              setFireModalOpen(false);
            }}>
              Yes, Fire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*  Salary Adjust Modal */}
      <Dialog open={salaryModalOpen} onOpenChange={setSalaryModalOpen}>
        <DialogContent className="rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-teal-600">
              Adjust Salary for {selectedUser?.email}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="text-sm font-medium">
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
          <p className="text-red-600 font-semibold text-sm">{errorMsg}</p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setSalaryModalOpen(false)}>Cancel</Button>
            <Button variant="default" className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => updateSalary(selectedUser)}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
