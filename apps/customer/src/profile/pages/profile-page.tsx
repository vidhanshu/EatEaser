import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, ImgWithPlaceholder, Input } from "@repo/ui";
import { CheckCircle, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@src/common/utils/axios";
import { ROUTES } from "@src/common/utils/api-routes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().regex(/^[0-9]{10,15}$/),
});
const ProfilePage = () => {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => axiosInstance.get(ROUTES.auth.profile)?.then((res) => res.data),
  });
  const { data } = user ?? ({} as { data: NSAuth.IUser });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { name: "", email: "", phone: "" },
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  useEffect(() => {
    if (user?.data?._id) {
      form.setValue("name", user.data.name);
      form.setValue("email", user.data.email);
      form.setValue("phone", user.data.phone);
    }
  }, [user]);

  return (
    <main className="pt-8 px-4">
      <div className="flex gap-x-4 items-center mb-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <h1 className="text-base font-medium">Profile</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ImgWithPlaceholder src={data?.image} placeholder={data?.name} className="mx-auto" />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="dark:bg-[#1f222a]  placeholder:text-gray-500" placeholder="Enter name" {...field} />
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
                  <Input className="dark:bg-[#1f222a]  placeholder:text-gray-500" placeholder="Enter email" {...field} />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input className="dark:bg-[#1f222a]  placeholder:text-gray-500" placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" size="sm" endContent={<CheckCircle size={16} />}>
            Save
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default ProfilePage;
