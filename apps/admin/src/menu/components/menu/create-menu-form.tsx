import { z } from "zod";
import { useForm } from "react-hook-form";
import { ChevronRight } from "lucide-react";

import { createMenuSchema } from "@src/menu/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Separator,
  Textarea,
  Typography,
  toast,
} from "@ui/components";
import useMenu from "@src/menu/hooks/use-menu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { APP_ROUTES } from "@src/common/utils/app-routes";
import ImageUploadField from "@src/common/components/image-upload-field";
import { MultipleKeyValInput } from "@ui/components";
import AsyncCategorySelect from "@src/common/components/async-category-select";
import AsyncMultipleAddonSelect from "@src/common/components/async-multiple-addon-select";

/// ------------------------------------------------------------------------------

const defaultValues: z.infer<typeof createMenuSchema> = {
  description: undefined,
  name: "",
  image: undefined,
  addOns: [],
  category: {
    id: "",
    name: "",
  },
  isAvailable: true,
  isVegan: false,
  isVegetarian: false,
  moreInfo: [],
  price: "",
};

/// ------------------------------------------------------------------------------

export const CreateMenuForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [imgFile, setImgFile] = useState<File | null>(null);
  const id = searchParams.get("id") ?? "";
  const {
    createMenuItem,
    isFetchingMenuItem,
    updateMenuItem,
    menuItem,
    getMenuItem,
    isUpdating,
    isCreating,
  } = useMenu({
    fetchMenuItems: false,
    variables: { menuItemId: id },
    onSuccess: () => {
      navigate(id ? APP_ROUTES.menuView.replace(":id", id) : APP_ROUTES.menu);
    },
  });
  const form = useForm<z.infer<typeof createMenuSchema>>({
    defaultValues,
    resolver: zodResolver(createMenuSchema),
  });

  const onSubmit = (values: z.infer<typeof createMenuSchema>) => {
    const payload: any = values;
    if (imgFile) {
      return toast.error("Please upload the image first.");
    }
    if (values.addOns) {
      payload.addOns = values.addOns.map((addOn) => addOn.id);
    }
    if (values.category) {
      payload.category = values.category.id;
    }
    if (!values.image) {
      delete payload.image;
    }
    if (!values.description) {
      delete payload.description;
    }

    if (id) {
      let changedData: any = {};
      Object.keys(payload).forEach((key) => {
        if (menuItem?.[key as keyof typeof menuItem] !== payload[key]) {
          changedData[key] = payload[key];
        }
      });
      updateMenuItem({ payload: changedData, id: id as string });
    } else {
      createMenuItem(payload);
    }
  };

  useEffect(() => {
    if (menuItem) {
      const dishData = {
        ...menuItem,
        addOns: menuItem.addOns?.map((addOn) => ({
          id: addOn._id,
          name: addOn.name,
        })),
        category: {
          id: menuItem.category._id,
          name: menuItem.category.name,
        },
      };
      form.reset({ ...dishData, price: dishData.price.toString() });
    }
  }, [menuItem]);

  useEffect(() => {
    if (id) {
      getMenuItem();
    }
  }, [id]);

  const image = form.watch("image") ?? menuItem?.image;
  const disableInput = isFetchingMenuItem || isUpdating || isCreating;

  return (
    <div className="max-w-4xl">
      <ImageUploadField
        disabled={disableInput}
        image={image}
        name={!id ? "D" : menuItem?.name}
        imgFileState={{
          pImgFile: imgFile,
          pSetImgFile: setImgFile,
        }}
        imgWithPlaceholderProps={{
          className: "border",
        }}
        path="restaurant/"
        onUploadSuccess={(url) => {
          form.setValue("image", url);
        }}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Menu item Name *</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    disabled={disableInput}
                    placeholder="Eg. Paneer Tikka"
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
                <FormLabel>
                  Description of menu item{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    disabled={disableInput}
                    rows={5}
                    placeholder="Eg. Paneer Tikka is a popular Indian dish made with paneer and spices."
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
                <FormLabel>Menu item price *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={disableInput}
                    placeholder="Enter price of the dish in INR."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Menu item Category *</FormLabel>
                <FormControl>
                  <AsyncCategorySelect
                    value={value}
                    allowFirstFetch
                    inputProps={field}
                    setValue={onChange}
                    placeholder="Select a category"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="addOns"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>
                  Menu item Addons{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <AsyncMultipleAddonSelect
                    value={value}
                    allowFirstFetch
                    inputProps={field}
                    setValue={onChange}
                    placeholder="Select a addon"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <div>
            <Typography className="mb-4" variant="md">
              Availability & Dietary Options
            </Typography>
            <div className="flex gap-x-4 items-center">
              <FormField
                control={form.control}
                name="isVegan"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-x-2">
                        <Checkbox
                          disabled={disableInput}
                          onCheckedChange={onChange}
                          checked={value}
                          id="isVegan"
                          {...field}
                        />
                        <Label htmlFor="isVegan">is Vegan?</Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isVegetarian"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-x-2">
                        <Checkbox
                          disabled={disableInput}
                          onCheckedChange={onChange}
                          checked={value}
                          id="isVegetarian"
                          {...field}
                        />
                        <Label htmlFor="isVegetarian">is Vegetarian?</Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-x-2">
                        <Checkbox
                          disabled={disableInput}
                          onCheckedChange={onChange}
                          checked={value}
                          id="isAvailable"
                          {...field}
                        />
                        <Label htmlFor="isAvailable">is Available?</Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator />
          <div id="more-info">
            <FormField
              control={form.control}
              name="moreInfo"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <div className="flex justify-between items-end">
                    <FormLabel className="mb-2">
                      Menu item more info{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </FormLabel>
                  </div>
                  <FormControl>
                    <MultipleKeyValInput
                      disabled={disableInput}
                      errorMsg={
                        <ul>
                          <li>
                            Label should contain min 1, max 100 characters
                          </li>
                          <li>
                            value should contain min 3, max 500 characters
                          </li>
                        </ul>
                      }
                      value={value}
                      setValue={onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button
              endContent={<ChevronRight size={16} />}
              loading={isUpdating || isCreating}
            >
              {!id ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateMenuForm;
