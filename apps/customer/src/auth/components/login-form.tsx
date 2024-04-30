import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

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
  Checkbox,
  toast,
} from "@repo/ui";
import * as z from "zod";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@src/auth/utils/validations";
import useAuthStore from "@src/common/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@src/common/utils/axios";
import { ROUTES } from "@src/common/utils/api-routes";
import { PAGES } from "@src/common/utils/pages";

const LoginForm = () => {
  const navigate = useNavigate();
  const signIn = useAuthStore((data) => data.signIn);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ email, password }: z.infer<typeof loginFormSchema>) => {
      const res = await axiosInstance.post(ROUTES.auth.signIn, {
        email,
        password,
      });
      return res.data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const response = error.response?.data;
        toast.error(response?.error ?? "An error occurred");
      }
    },
    onSuccess: ({ token, data, message }) => {
      signIn({ token: token!, user: data! });
      toast.success(message ?? "Sign in successfully");
      navigate("/");
    },
  });
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    mutate(values);
  }
  return (
    <Card className="backdrop-blur-md z-10  bg-primary/5 p-4 mx-auto flex-grow max-w-xs md:max-w-md py-8 select-none dark:border-gray-700">
      <div className="space-y-2 mb-4">
        <Typography className="text-center" variant="large">
          Welcome back!
        </Typography>
        <Typography variant="muted" className="text-center">
          Login to your existing account
        </Typography>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="space-y-4">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      className="bg-transparent"
                      startIcon={Lock}
                      type="password"
                      placeholder="Password"
                      iconProps={{ className: "text-primary/60" }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-x-2">
                        <Checkbox disabled={isPending} checked={value} onCheckedChange={(val) => form.setValue("rememberMe", !!val)} id="rememberMe" {...field} />
                        <label className="text-sm" htmlFor="rememberMe">
                          Remeber me
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Link to="#" className="text-sm">
                Forgot password?
              </Link>
            </div>
          </div>
          <Button loading={isPending} className="w-full" type="submit">
            LOGIN
          </Button>
        </form>
      </Form>
      <Typography className="text-center text-sm mt-4">
        Don&apos;t have an account?{" "}
        <Link to={PAGES.RegisterPage.href} className="font-semibold">
          Sign up
        </Link>
      </Typography>
    </Card>
  );
};

export default LoginForm;
