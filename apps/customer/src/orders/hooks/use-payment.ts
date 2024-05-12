import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import useAuthStore from "../../common/stores/auth-store";
import { ROUTES } from "../../common/utils/api-routes";
import axiosInstance from "../../common/utils/axios";
import { loadScript } from "../../common/utils/helpers";

const usePayment = ({ onSuccess }: { onSuccess?: (orderId: string) => void }) => {
  const user = useAuthStore((store) => store.user);
  const [loading, setLoading] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ dbOrderId, ...rest }: { rzpOrderId: string; rzpPaymentId: string; rzpSignature: string; dbOrderId: string }) =>
      axiosInstance.post(ROUTES.restaurant.order.verifyPayment(dbOrderId), rest),
    onSuccess: async ({ data }) => {
      const { orderId } = data.data;
      toast.success("Payment successful!", { dismissible: true });
      onSuccess?.(orderId);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  async function showRazorpay({ amount, rzpOrderId, dbOrderId }: { amount: number; rzpOrderId: string; dbOrderId: string }) {
    if (!user) return;
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_DO0qZrDqmyi64V",
      currency: "INR",
      amount,
      order_id: rzpOrderId,
      name: `Eateaser - ${user.name}'s order`,
      image: "https://eat-easer-customer.vercel.app/logo.svg",
      handler: async function (response: any) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
        // verify payment
        mutate({ rzpOrderId: razorpay_order_id, rzpPaymentId: razorpay_payment_id, rzpSignature: razorpay_signature, dbOrderId });
      },
      prefill: {
        name: user.name,
        email: user.email,
        phone_number: user.phone,
      },
      theme: {
        color: "#10b77f",
      },
    };
    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  }

  const getRzpOrderId = async (payload: { orderId: string; amount: number }) => {
    try {
      setLoading(true);
      const rzpId = (await axiosInstance.post(ROUTES.restaurant.order.createRzpOrder, payload)).data.data.rzpOrderId;
      setLoading(false);
      return rzpId;
    } catch (error) {
      return null;
    }
  };
  return { showRazorpay, verifyPayment: mutate, isPending: isPending || loading, getRzpOrderId };
};

export default usePayment;
