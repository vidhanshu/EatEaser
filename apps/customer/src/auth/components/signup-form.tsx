import { z } from "zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, User, Mail, Phone } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Card,
  Typography,
  toast,
} from "@repo/ui";
import { signUpFormSchema } from "../utils/validations";
import axiosInstance from "@src/common/utils/axios";
import { ROUTES } from "@src/common/utils/api-routes";
import useAuthStore from "@src/common/stores/auth-store";

const SignupForm = () => {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();
  const { isPending, mutate } = useMutation({
    mutationFn: async (value: z.infer<typeof signUpFormSchema>) => {
      const res = await axiosInstance.post(ROUTES.auth.signUp, value);
      return res.data;
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error ?? "An error occurred");
      }
    },
    onSuccess({ token, data, message }) {
      toast.success(message ?? "Account created successfully");
      signIn({ token, user: data });
      navigate("/verify-email");
    },
  });

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    mutate(values);
  }
  return (
    <Card className="backdrop-blur-md z-10 bg-primary/5 p-4 mx-auto flex-grow max-w-xs md:max-w-md py-8 select-none dark:border-gray-700">
      <div className="space-y-2 mb-4">
        <Typography className="text-center" variant="large">
          Let&apos; Get Started!
        </Typography>
        <Typography variant="muted" className="text-center">
          Create an account
        </Typography>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      className="bg-transparent"
                      startIcon={User}
                      type="text"
                      placeholder="Name"
                      iconProps={{ className: "text-primary/60" }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      className="bg-transparent"
                      startIcon={Mail}
                      type="email"
                      placeholder="Email"
                      iconProps={{ className: "text-primary/60" }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone no.</FormLabel>
                  <FormControl>
                    <Input className="bg-transparent" startIcon={Phone} type="tel" placeholder="Phone no." iconProps={{ className: "text-primary/60" }} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input className="bg-transparent" startIcon={Lock} type="password" placeholder="Password" iconProps={{ className: "text-primary/60" }} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button loading={isPending} className="w-full" type="submit">
            SIGN UP
          </Button>
        </form>
      </Form>
      <Typography className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link to="/sign-in" className="font-semibold">
          Sign in
        </Link>
      </Typography>
    </Card>
  );
};

export default SignupForm;
