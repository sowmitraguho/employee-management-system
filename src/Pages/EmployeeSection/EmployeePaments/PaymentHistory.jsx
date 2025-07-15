import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";


const fetchPayments = async (email, page) => {
  const res = await fetch(`https://employee-management-system-server-3k7l.onrender.com/payments/${email}?page=${page}&limit=5`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch payment history");
  return res.json();
};

export default function PaymentHistory() {
  const { loggedInUser } = useContext(AuthContext) // your logged-in user
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments", loggedInUser?.email, page],
    queryFn: () => fetchPayments(loggedInUser?.email, page),
    enabled: !!loggedInUser?.email,
  });

  const payments = data?.payments || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) return <PaymentSkeleton />;
  if (isError) return <p className="text-red-500">Failed to load payment history</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <div className="border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month / Year</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <TableRow key={p.transactionId}>
                  <TableCell>{`${p.month} / ${p.year}`}</TableCell>
                  <TableCell>{p.salaryAmount}</TableCell>
                  <TableCell>{p.paymentStatus}</TableCell>
                  <TableCell className="font-mono">{p.transactionId}</TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  No payments yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
            Prev
          </Button>
          <p>
            Page {page} of {totalPages}
          </p>
          <Button disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

// Skeleton Loader
function PaymentSkeleton() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex justify-between mb-2">
          <Skeleton className="w-1/4 h-6" />
          <Skeleton className="w-1/6 h-6" />
          <Skeleton className="w-1/3 h-6" />
        </div>
      ))}
    </div>
  );
}
