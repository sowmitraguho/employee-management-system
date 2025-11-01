
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import Swal from "sweetalert2";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../../Contexts/AuthContext/AuthContext";
import useProtectedAxios from "../../../../Hooks/useProtectedAxios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PaymentForm({ payrollId, amount, employeeId, onClose, refetchPayroll }) {
  const stripe = useStripe();
  const elements = useElements();
  const baseURL = import.meta.env.VITE_API_URL;
  const { loggedInUser } = useContext(AuthContext);

  //  Mutation for Admin → Approve/Reject payroll
  const updatePayrollStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const token = await loggedInUser.getIdToken(true);
      const res = await useProtectedAxios.patch(`${baseURL}/payments/${id}`, { status }, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, //  Attach token here
        },
      });
      console.log('update payrollstatus mutation: ', res);
      return res.json();
    },
    onSuccess: () => {
      // toast({ title: "Payroll updated " });
      QueryClient.invalidateQueries(["payroll"]);
    },
  });

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    try {
      //  1. Create PaymentIntent
      const res = await useProtectedAxios.post(`${baseURL}/payments/create-payment-intent`, {
        amount,
        employeeId,
        payrollId,
      });
      const clientSecret = res.data.clientSecret;
      console.log('client secret', clientSecret);

      //  2. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        Swal.fire("Payment Failed", error.message, "error");
      } else if (paymentIntent.status === "succeeded") {
        Swal.fire("Success!", "Payment completed successfully.", "success");
        updatePayrollStatus.mutate({ id: payrollId, status: "approved", });
        refetchPayroll(); // Refresh payroll list
        onClose(); // Close modal
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || err.message, "error");
    }
  };

  return (
    <div className="space-y-4">
      <CardElement className="border p-3 rounded" />
      <button
        onClick={handlePayment}
        disabled={!stripe}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Pay ${amount}
      </button>
    </div>
  );
}

export default function PaymentModal({ open, onClose, payroll }) {
  if (!payroll) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay {payroll.employeeName}</DialogTitle>
        </DialogHeader>
        <Elements stripe={stripePromise}>
          <PaymentForm
            payrollId={payroll._id}
            amount={payroll.employeeSalary}
            employeeId={payroll.employeeId}
            onClose={onClose}
            refetchPayroll={payroll.refetchPayroll}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}
