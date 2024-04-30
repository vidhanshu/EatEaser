/**
 * This page, just comes after the sign up page, and it's responsible for verifying the email of the user.
 * - If the user skips the verification, the user will be redirected to the home page.
 * - If the user verifies the email, the user will be redirected to the home page.
 * - If the user refreshes the page, the timer will persist, and instead of starting from 15 minutes, it starts from the remaining time.
 * - If the user doesn't verify the email within 15 minutes, the user will be redirected to the home page.
*/
import * as z from "zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Card,
  Typography,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  toast,
} from "@ui/components";
import axiosInstance from "@src/common/utils/axios";
import AuthLayout from "@src/auth/components/layout";
import { ROUTES } from "@src/common/utils/api-routes";
import useAuthStore from "@src/common/stores/auth-store";
import { userPersistingTimer } from "@src/common/hooks/use-persting-timer";

const FormSchema = z.object({
  pin: z.string().min(4, {
    message: "Your one-time password must be 4 characters.",
  }),
});
const VerifyEmailPage = () => {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { setUser, user } = useAuthStore();
  const [skiped, setSkipped] = useLocalStorage("skiped", false);
  const { remainingTime, formatTime, startTimer, clearTimer, resetTimer } =
    userPersistingTimer();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { pin: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (value: string) => {
      const res = await axiosInstance.post(ROUTES.auth.verifyEmail, {
        otp: value,
        email: user!.email,
      });
      return res.data;
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error ?? "An error occurred");
      }
    },
    onSuccess({ message }) {
      toast.success(message ?? "Email verified successfully");
      setUser({ isEmailVerified: true });
      resetTimer();
      navigate("/");
    },
  });

  useEffect(() => {
    if (user?.isEmailVerified || skiped) return navigate("/");
    else {
      setLoading(false);
    }
  }, [user, skiped]);

  useEffect(() => {
    startTimer();

    return () => {
      clearTimer();
    };
  }, []);

  if (loading) {
    return null;
  }

  return (
    <AuthLayout>
      <Card className="backdrop-blur-md z-10  bg-primary/5 p-4 mx-auto flex-grow max-w-xs md:max-w-md py-8 select-none">
        <div className="space-y-2 mb-4">
          <Typography className="text-center" variant="large">
            Please verify your email
          </Typography>
          <Typography variant="muted" className="text-center">
            Enter the OTP sent to your email
          </Typography>
        </div>
        <Typography className="text-center" variant="large">
          {remainingTime <= 60 ? <span className="text-rose">{formatTime(remainingTime)}</span> : formatTime(remainingTime)}
        </Typography>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutate(data.pin))} className="space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center gap-4">
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={4}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <InputOTPSlot className="p-6 border border-slate-300" key={index} {...slot} />
                          ))}{" "}
                        </InputOTPGroup>
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Please enter the one-time password sent to your phone.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" loading={isPending} startContent={<ShieldCheck size={18} />} className="w-full">
              Verify
            </Button>
          </form>
        </Form>

        <div className="flex justify-end">
          <Link
            preventScrollReset={true}
            onClick={() => {
              setSkipped(true);
            }}
            className="mt-6 w-fit"
            to="/"
          >
            <Button variant="link">Skip</Button>
          </Link>
        </div>
      </Card>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
