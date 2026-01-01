import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/Components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/Components/ui/table";
import { format, isValid } from "date-fns";
import useProtectedAxios from "../../../../Hooks/useProtectedAxios";
import useAxiosGetData from "../../../../Hooks/useAxiosGetData";
import { ChevronLeft, ChevronRight, Clock, User, Briefcase, Calendar } from "lucide-react";

const baseURL = import.meta.env.VITE_API_URL;

export default function ProgressPage() {
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [workRecords, setWorkRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { getAllWorks } = useAxiosGetData();

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
        const records = Array.isArray(res) ? res : res?.data || [];
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

  // ✅ Filtered work records safely
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

  // ✅ Calculate total hours dynamically
  const totalHours = useMemo(() => {
    return filteredRecords.reduce(
      (sum, rec) => sum + (parseFloat(rec.finishHour) || 0),
      0
    );
  }, [filteredRecords]);

  // ✅ Calculate average hours
  const averageHours = useMemo(() => {
    return filteredRecords.length > 0 ? (totalHours / filteredRecords.length).toFixed(2) : 0;
  }, [filteredRecords, totalHours]);

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

  // ✅ Total pages
  const totalPages = Math.ceil((filteredRecords?.length || 0) / pageSize);

  // ✅ Slice the data for current page
  const paginatedRecords = filteredRecords?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Animation variants
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

  const cardHoverVariants = {
    hover: {
      y: -4,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    },
  };

  // ✅ Now safe to return conditionally
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Loading work records...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400 font-medium">
              Error: {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );

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
            Employee Work Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Track employee tasks, hours, and productivity metrics
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* Employee Filter */}
          <motion.div
            variants={cardHoverVariants}
            whileHover="hover"
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <User className="w-4 h-4 inline mr-2" />
              Employee
            </label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 h-10">
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
          </motion.div>

          {/* Month Filter */}
          <motion.div
            variants={cardHoverVariants}
            whileHover="hover"
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              Month
            </label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 h-10">
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
          </motion.div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Total Records */}
          <motion.div
            variants={cardHoverVariants}
            whileHover="hover"
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Records
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                  {filteredRecords.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          {/* Total Hours */}
          <motion.div
            variants={cardHoverVariants}
            whileHover="hover"
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Hours
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                  {totalHours.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">hours</p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </motion.div>

          {/* Average Hours */}
          <motion.div
            variants={cardHoverVariants}
            whileHover="hover"
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Avg Hours/Task
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                  {averageHours}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">hours</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </motion.div>

          {/* Active Employees */}
          <motion.div
            variants={cardHoverVariants}
            whileHover="hover"
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Active Employees
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                  {new Set(filteredRecords.map((r) => r.email)).size}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">unique</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Table Card */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <CardTitle className="text-gray-900 dark:text-gray-50">
                Work Records
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {filteredRecords.length} records found • Page {page} of {totalPages || 1}
              </p>
            </CardHeader>

            <CardContent className="p-0">
              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                      <TableHead className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <User className="w-4 h-4 inline mr-2" />
                        Employee
                      </TableHead>
                      <TableHead className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                        <Briefcase className="w-4 h-4 inline mr-2" />
                        Task
                      </TableHead>
                      <TableHead className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Date
                      </TableHead>
                      <TableHead className="px-4 md:px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Hours
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paginatedRecords?.length > 0 ? (
                      paginatedRecords.map((record, idx) => {
                        const validDate =
                          record?.completionDate &&
                          isValid(new Date(record.completionDate))
                            ? format(new Date(record.completionDate), "dd MMM yyyy")
                            : "Invalid date";

                        return (
                          <TableRow
                            key={record._id || record.email || idx}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-gray-800/30 transition-colors"
                          >
                            <TableCell className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                              {record.email ?? "Unknown"}
                            </TableCell>
                            <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                {record.workName ?? "No task"}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">
                              {validDate}
                            </TableCell>
                            <TableCell className="px-4 md:px-6 py-4 text-sm font-semibold text-center text-emerald-600 dark:text-emerald-400">
                              {record.finishHour ?? "-"}h
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan="4"
                          className="px-4 md:px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Briefcase className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
                            <p className="font-medium">No records found</p>
                            <p className="text-sm">Try adjusting your filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-semibold">
                      {(page - 1) * pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold">
                      {Math.min(page * pageSize, filteredRecords.length)}
                    </span>{" "}
                    of <span className="font-semibold">{filteredRecords.length}</span> records
                  </p>

                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        page === 1
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={page}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= 1 && value <= totalPages) {
                            setPage(value);
                          }
                        }}
                        className="w-12 text-center bg-transparent font-semibold text-gray-900 dark:text-gray-100 border-0 outline-none"
                      />
                      <span className="text-gray-600 dark:text-gray-400">/ {totalPages}</span>
                    </div>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        page === totalPages
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}