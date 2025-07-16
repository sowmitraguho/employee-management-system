import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format, isValid } from "date-fns";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export default function ProgressPage() {
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [workRecords, setWorkRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${baseURL}/users`, { withCredentials: true });
        const records = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setEmployees(records);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // ✅ Fetch work records
  useEffect(() => {
    const fetchWorkRecords = async () => {
      try {
        const res = await axios.get(`${baseURL}/works`, { withCredentials: true });
        const records = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setWorkRecords(records);
      } catch (err) {
        console.error("Error fetching work records:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkRecords();
  }, []);

  if (loading) return <p className="text-center text-gray-600 dark:text-gray-300">Loading work records...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  // ✅ Filtered work records safely
  const filteredRecords = workRecords.filter((record) => {
    if (!record?.completionDate) return false;
    const recordDate = new Date(record.completionDate);
    if (!isValid(recordDate)) return false;

    const recordMonth = format(recordDate, "MMMM");

    const matchesEmployee = selectedEmployee !== "all" ? record.email === selectedEmployee : true;
    const matchesMonth = selectedMonth !== "all" ? recordMonth === selectedMonth : true;

    return matchesEmployee && matchesMonth;
  });

  // ✅ Unique available months safely
  const availableMonths = [
    ...new Set(
      workRecords
        .filter((r) => r?.completionDate && isValid(new Date(r.completionDate)))
        .map((r) => format(new Date(r.completionDate), "MMMM"))
    ),
  ];

  return (
    <Card className="p-4 space-y-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* ✅ Header */}
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Employee Work Progress
        </CardTitle>
      </CardHeader>

      {/* ✅ Filters: Responsive flex */}
      <CardContent className="flex flex-col sm:flex-row gap-4">
        {/* Employee Dropdown */}
        <div className="w-full sm:w-[200px]">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-full dark:bg-gray-800 dark:text-gray-200">
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees?.map((emp) => {
                const value = emp.email ?? emp._id ?? `unknown-${Math.random()}`;
                return (
                  <SelectItem key={value} value={emp.email ?? ""}>
                    {emp.email || "Unknown Employee"}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Month Dropdown */}
        <div className="w-full sm:w-[200px]">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full dark:bg-gray-800 dark:text-gray-200">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {availableMonths?.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      {/* ✅ Responsive Table Wrapper */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead className="text-gray-700 dark:text-gray-200">Employee</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Task</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Date</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">Hours</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRecords?.length > 0 ? (
              filteredRecords.map((record) => {
                const validDate =
                  record?.completionDate && isValid(new Date(record.completionDate))
                    ? format(new Date(record.completionDate), "dd MMM yyyy")
                    : "Invalid date";

                return (
                  <TableRow
                    key={record._id || record.email || Math.random()}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell className="text-gray-800 dark:text-gray-300">{record.email ?? "Unknown"}</TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-300">{record.workName ?? "No task name"}</TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-300">{validDate}</TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-300">{record.finishHour ?? "-"}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan="4"
                  className="text-center text-gray-500 dark:text-gray-400 py-4"
                >
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
