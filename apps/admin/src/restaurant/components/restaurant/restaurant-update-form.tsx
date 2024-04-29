import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useRestaurant from "../../hooks/use-restaurant";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
  RadioGroup,
  RadioGroupItem,
  toast,
} from "@ui/components";
import { updateRestaurantSchema } from "../../utils/validations";
import { useEffect } from "react";
import { ArrowUpFromLine, Loader2 } from "lucide-react";
import { NSRestaurant } from "@src/types/restaurant.type";
import ImageUploadField from "@src/common/components/image-upload-field";

const defaultValues = {
  acceptsReservations: false,
  address: "",
  description: "",
  email: "",
  image: "",
  name: "",
  phone: "",
  googleMapLink: "",
  website: "",
};

export const RestaurantUpdateForm = () => {
  const { updateRestaurant, isUpading, data, isFetching } = useRestaurant();
  const form = useForm<z.infer<typeof updateRestaurantSchema>>({
    defaultValues,
    resolver: zodResolver(updateRestaurantSchema),
  });
  async function onSubmit(values: z.infer<typeof updateRestaurantSchema>) {
    // only send the fields that are changed
    const changedValues: any = {};
    let key: keyof typeof values;
    for (key in values) {
      if (values[key] !== data?.[key as keyof NSRestaurant.IResturant]) {
        changedValues[key] = values[key];
      }
    }
    if (Object.keys(changedValues).length === 0)
      return toast.error("No changes made");
    Object.keys(changedValues).forEach((key) => {
      if (changedValues[key] === "") delete changedValues[key];
    });
    await updateRestaurant(changedValues);
  }

  useEffect(() => {
    if (data) {
      form.reset(data);
      form.setValue("acceptsReservations", data.acceptsReservations);
    }
  }, [data]);

  if (isFetching) return <Loader2 size={25} className="m-4 animate-spin" />;

  return (
    <div className="max-w-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ImageUploadField
            image={data?.image}
            name={data?.name}
            onUploadSuccess={(url) => {
              form.setValue("image", url);
              updateRestaurant({ image: url });
            }}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Description</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
                    <Input placeholder="phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Address</FormLabel>
                <FormControl>
                  <Input placeholder="address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="googleMapLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Google map embedd url for your restaurant (optional)
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Google map embedd url"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant website (optional)</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="Website link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acceptsReservations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accepts Reservations?</FormLabel>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value === "yes");
                  }}
                  value={field.value ? "yes" : "no"}
                  defaultValue={field.value ? "yes" : "no"}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center gap-x-6 space-y-0">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </FormItem>
                </RadioGroup>
              </FormItem>
            )}
          />
          <Button
            loading={isUpading}
            startContent={<ArrowUpFromLine size={16} />}
            type="submit"
          >
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RestaurantUpdateForm;
