import { z } from "zod";
import { useForm } from "react-hook-form";
import { ChevronRight, Pencil } from "lucide-react";

import { createAddOnSchema } from "@src/menu/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Typography,
  toast,
} from "@ui/components";
import { cn } from "@ui/lib/utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { APP_ROUTES } from "@src/common/utils/app-routes";
import ImageUploadField from "@src/common/components/image-upload-field";
import { NSRestaurant } from "@src/types/restaurant.type";
import useAddOns from "@src/menu/hooks/use-add-ons";

/// ------------------------------------------------------------------------------

const defaultValues: z.infer<typeof createAddOnSchema> = {
  description: "",
  name: "",
  image: "",
  price: "",
};

/// ------------------------------------------------------------------------------

export const CreateAddOnForm = ({
  mode,
  id,
}: {
  mode: "view" | "edit" | "create";
  id?: string;
}) => {
  const [imgFile, setImgFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const {
    createAddOn,
    isFetchingAddOn,
    isUpdating,
    isCreating,
    updateAddOn,
    addOn,
    getAddOn,
  } = useAddOns({
    fetchAddOns: false,
    variables: { addOnId: id },
    onSuccess: () => {
      navigate(APP_ROUTES.menuAddOns);
    },
  });
  const form = useForm<z.infer<typeof createAddOnSchema>>({
    defaultValues,
    resolver: zodResolver(createAddOnSchema),
  });

  const onSubmit = (values: z.infer<typeof createAddOnSchema>) => {
    if (mode === "view") return;

    const payload: any = {
      name: values.name,
    };
    if (values.description) {
      payload.description = values.description;
    }
    if (values.image) {
      payload.image = values.image;
    }
    if (values.price) {
      payload.price = values.price;
    }
    if (imgFile) {
      return toast.error("Please upload the image first.");
    }

    if (mode === "edit") {
      let changedData: any = {};
      Object.keys(payload).forEach((key) => {
        if (addOn?.[key as keyof NSRestaurant.IAddon] !== payload[key]) {
          changedData[key] = payload[key];
        }
      });
      updateAddOn({ payload: changedData, id: id as string });
    } else {
      createAddOn(payload);
    }
  };

  useEffect(() => {
    if (addOn) {
      if (form.getValues("image") === "") {
        form.reset({ ...addOn, price: addOn.price.toString() });
      } else {
        form.setValue("name", addOn.name);
        form.setValue("description", addOn.description);
        form.setValue("price", addOn.price.toString());
      }
    }
  }, [addOn]);

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      getAddOn();
    }
  }, [mode]);
  const isViewMode = mode === "view";
  const image = form.watch("image") ?? addOn?.image;
  const disabledInput =
    isViewMode || isUpdating || isCreating || isFetchingAddOn;

  return (
    <div className="max-w-4xl">
      {isViewMode && (
        <Typography variant="h4" className="text-center mb-4">
          Add-on details
        </Typography>
      )}
      <Form {...form}>
        <div className="flex items-center justify-center">
          <ImageUploadField
            disabled={disabledInput}
            image={image}
            name={mode === "create" ? "C" : addOn?.name}
            imgFileState={{
              pImgFile: imgFile,
              pSetImgFile: setImgFile,
            }}
            path="restaurant/"
            onUploadSuccess={(url) => {
              form.setValue("image", url);
            }}
          />
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add-on Name</FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      isViewMode
                        ? "disabled:cursor-auto disabled:opacity-100"
                        : ""
                    )}
                    disabled={disabledInput}
                    placeholder="Eg. Fries, Salad, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add-on Price</FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      isViewMode
                        ? "disabled:cursor-auto disabled:opacity-100"
                        : ""
                    )}
                    type="number"
                    disabled={disabledInput}
                    placeholder="Eg. 30."
                    {...field}
                  />
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
                <FormLabel>Description of add-on(optional)</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={disabledInput}
                    rows={5}
                    className={cn(
                      isViewMode
                        ? "disabled:cursor-auto disabled:opacity-100"
                        : ""
                    )}
                    placeholder="Eg. Yummy fries with extra cheese."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isViewMode ? (
            <div className="flex justify-end">
              <Button
                endContent={<ChevronRight size={16} />}
                loading={isUpdating || isCreating || isFetchingAddOn}
              >
                {mode === "create" ? "Create" : "Update"}
              </Button>
            </div>
          ) : null}
        </form>
      </Form>
      {isViewMode && (
        <div className="flex justify-end">
          <Button
            className="mt-4"
            type="button"
            onClick={() => {
              navigate(`${APP_ROUTES.menuAddOns}?mode=edit&id=${id}`);
            }}
            endContent={<Pencil size={16} />}
            loading={isFetchingAddOn}
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateAddOnForm;
