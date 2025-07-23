import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format, isValid } from "date-fns";
import useProtectedAxios from "../../../Hooks/useProtectedAxios";
import useAxiosGetData from "../../../Hooks/useAxiosGetData";

const baseURL = import.meta.env.VITE_API_URL;

export default function ProgressPage() {
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [workRecords, setWorkRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {getAllWorks} = useAxiosGetData();


  // ✅ Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await useProtectedAxios.get(`${baseURL}/users`, {
          withCredentials: true,
        });
        const records = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
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
        const res = await getAllWorks();
       // console.log('getting all works in progress page', res);
        const records = Array.isArray(res)
          ? res
          : res?.data || [];
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

  // ✅ Filtered work records safely (always computed)
  const filteredRecords = useMemo(() => {
    return workRecords.filter((record) => {
      if (!record?.completionDate) return false;
      const recordDate = new Date(record.completionDate);
      if (!isValid(recordDate)) return false;

      const recordMonth = format(recordDate, "MMMM");
      const matchesEmployee =
        selectedEmployee !== "all" ? record.email === selectedEmployee : true;
      const matchesMonth =
        selectedMonth !== "all" ? recordMonth === selectedMonth : true;

      return matchesEmployee && matchesMonth;
    });
  }, [workRecords, selectedEmployee, selectedMonth]);

  // ✅ Calculate total hours dynamically (always computed)
  const totalHours = useMemo(() => {
    return filteredRecords.reduce(
      (sum, rec) => sum + (parseFloat(rec.finishHour) || 0),
      0
    );
  }, [filteredRecords]);

  // ✅ Unique available months safely
  const availableMonths = useMemo(() => {
    return [
      ...new Set(
        workRecords
          .filter(
            (r) => r?.completionDate && isValid(new Date(r.completionDate))
          )
          .map((r) => format(new Date(r.completionDate), "MMMM"))
      ),
    ];
  }, [workRecords]);

  const [page, setPage] = useState(1);
  const pageSize = 10; // ✅ Show 10 rows per page

   // ✅ Total pages
  const totalPages = Math.ceil((filteredRecords?.length || 0) / pageSize);

  // ✅ Slice the data for current page
  const paginatedRecords = filteredRecords?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // ✅ Now safe to return conditionally
  if (loading)
    return (
      <p className="text-center text-gray-600 dark:text-gray-300">
        Loading work records...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md rounded-xl transition-colors duration-300 my-6">
      {/* ✅ Header */}
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Employee Work Progress
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Track employee tasks and work hours
        </p>
      </CardHeader>

      {/* ✅ Filters */}
      <CardContent className="flex flex-col sm:flex-row gap-4">
        {/* Employee Dropdown */}
        <div className="flex-1 min-w-[180px]">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-full dark:bg-gray-800 dark:text-gray-200">
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees?.map((emp) => {
                const value = emp._id ?? emp.email ?? `unknown-${Math.random()}`;
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
        <div className="flex-1 min-w-[180px]">
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

      {/* ✅ Work Hours Summary */}
      <div className="flex justify-center">
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 w-full sm:w-1/2 text-center shadow-sm">
          <p className="text-lg font-medium text-blue-800 dark:text-blue-300">
            Total Work Hours
          </p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {totalHours.toFixed(2)} hrs
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            (Based on current filter)
          </p>
        </div>
      </div>

      {/* ✅ Responsive Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead className="text-gray-700 dark:text-gray-200">
                Employee
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">
                Task
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">
                Date
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">
                Hours
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
        {paginatedRecords?.length > 0 ? (
          paginatedRecords.map((record) => {
            const validDate =
              record?.completionDate &&
              isValid(new Date(record.completionDate))
                ? format(new Date(record.completionDate), "dd MMM yyyy")
                : "Invalid date";

            return (
              <TableRow
                key={record._id || record.email || Math.random()}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <TableCell className="text-gray-800 dark:text-gray-300">
                  {record.email ?? "Unknown"}
                </TableCell>
                <TableCell className="text-gray-800 dark:text-gray-300">
                  {record.workName ?? "No task name"}
                </TableCell>
                <TableCell className="text-gray-800 dark:text-gray-300">
                  {validDate}
                </TableCell>
                <TableCell className="text-gray-800 dark:text-gray-300">
                  {record.finishHour ?? "-"}
                </TableCell>
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
        {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-3 py-1 rounded ${
              page === 1
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Prev
          </button>

          <span className="text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-3 py-1 rounded ${
              page === totalPages
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
      </div>
    </Card>
  );
}
