import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, toast } from "@ui/components";
import { CheckCircle, ChevronLeft, Mail, Phone, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import ImageUploadField from "@src/common/components/image-upload-field";
import PageMeta from "@src/common/components/page-meta";
import useAuthStore from "@src/common/stores/auth-store";
import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { PAGES } from "@src/common/utils/pages";

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().url().optional(),
  phone: z.string().regex(/^[0-9]{10,15}$/),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});
const ProfilePage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [imgFile, setImgFile] = useState<File | null>(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => axiosInstance.get(ROUTES.auth.profile)?.then((res) => res.data),
  });
  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => axiosInstance.patch(ROUTES.auth.update, data),
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      setUser(data.data?.data);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to update profile");
    },
  });
  const { data } = user ?? ({} as { data: NSAuth.IUser });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { name: "", email: "", phone: "", currentPassword: "", newPassword: "" },
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (imgFile) {
      return toast.error("Please upload the image first.");
    }
    const { currentPassword, newPassword } = values;
    const payload: Record<string, string> = {};
    if (currentPassword && newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }
    payload.name = values.name;
    payload.email = values.email;
    payload.phone = values.phone;
    if (values.image) payload.image = values.image;

    form.resetField("newPassword");
    form.resetField("currentPassword");
    updateProfile(payload as any);
  };

  const image = form.watch("image") ?? data?.image ?? "";
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (user?.data?._id) {
      form.setValue("name", user.data.name);
      form.setValue("email", user.data.email);
      form.setValue("phone", user.data.phone);
    }
  }, [user]);

  const disableField = isLoading || isUpdating || isSubmitting;

  return (
    <main className="pt-8 px-4">
      <PageMeta title={user?.data?.name} description={PAGES.ProfilePage.description} ogImg={image} />
      <div className="flex gap-x-4 items-center mb-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <h1 className="text-base font-medium">Profile</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center items-center">
            <ImageUploadField
              imgWithPlaceholderProps={{
                className: "bg-input dark:bg-input",
              }}
              disabled={disableField}
              image={image}
              imgFileState={{
                pImgFile: imgFile,
                pSetImgFile: setImgFile,
              }}
              path="customer/"
              onUploadSuccess={(url) => {
                form.setValue("image", url);
              }}
            />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input startIcon={User2} disabled={disableField} className="bg-input  placeholder:text-gray-500" placeholder="Enter name" {...field} />
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
                  <Input startIcon={Mail} disabled={disableField} type="email" className="bg-input  placeholder:text-gray-500" placeholder="Enter email" {...field} />
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
                  <Input startIcon={Phone} disabled={disableField} type="tel" className="bg-input  placeholder:text-gray-500" placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input disabled={disableField} type="password" className="bg-input  placeholder:text-gray-500" placeholder="Enter current password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input disabled={disableField} type="password" className="bg-input  placeholder:text-gray-500" placeholder="Enter new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button loading={disableField} className="w-full" size="sm" endContent={<CheckCircle size={16} />}>
            Save
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default ProfilePage;
