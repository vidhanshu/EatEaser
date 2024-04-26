import { z } from "zod";
import { useForm } from "react-hook-form";
import { ChevronRight, Pencil } from "lucide-react";

import { createCategorySchema } from "../../utils/validations";
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
import useCategory from "@src/menu/hooks/use-categories";
import { cn } from "@ui/lib/utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { APP_ROUTES } from "@src/common/utils/app-routes";
import ImageUploadField from "@src/common/components/image-upload-field";
import { NSRestaurant } from "@src/types/restaurant.type";

/// ------------------------------------------------------------------------------

const defaultValues: z.infer<typeof createCategorySchema> = {
  description: "",
  name: "",
  image: "",
};

/// ------------------------------------------------------------------------------

export const CreateCategoryForm = ({
  mode,
  id,
}: {
  mode: "view" | "edit" | "create";
  id?: string;
}) => {
  const [imgFile, setImgFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const {
    createCategory,
    isFetchingCategory,
    isUpdating,
    isCreating,
    updateCategory,
    category,
    getCategory,
  } = useCategory({
    fetchCategories: false,
    variables: { categoryId: id },
    onSuccess: () => {
      navigate(APP_ROUTES.menuCategories);
    },
  });
  const form = useForm<z.infer<typeof createCategorySchema>>({
    defaultValues,
    resolver: zodResolver(createCategorySchema),
  });

  const onSubmit = (values: z.infer<typeof createCategorySchema>) => {
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
    if (imgFile) {
      return toast.error("Please upload the image first.");
    }

    if (mode === "edit") {
      let changedData: any = {};
      Object.keys(payload).forEach((key) => {
        if (category?.[key as keyof NSRestaurant.ICategory] !== payload[key]) {
          changedData[key] = payload[key];
        }
      });
      updateCategory({ payload: changedData, id: id as string });
    } else {
      createCategory(payload);
    }
  };

  useEffect(() => {
    if (category) {
      if (form.getValues("image") === "") {
        form.reset(category);
      } else {
        form.setValue("name", category.name);
        form.setValue("description", category.description);
      }
    }
  }, [category]);

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      getCategory();
    }
  }, [mode]);
  const isViewMode = mode === "view";
  const image = form.watch("image") ?? category?.image;
  const disabledInput =
    isViewMode || isUpdating || isCreating || isFetchingCategory;

  return (
    <div className="max-w-4xl">
      {isViewMode && (
        <Typography variant="h4" className="text-center mb-4">
          Category details
        </Typography>
      )}
      <Form {...form}>
        <div className="flex items-center justify-center">
          <ImageUploadField
            disabled={disabledInput}
            image={image}
            name={mode === "create" ? "C" : category?.name}
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
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      isViewMode
                        ? "disabled:cursor-auto disabled:opacity-100"
                        : ""
                    )}
                    disabled={disabledInput}
                    placeholder="Eg. Starter, Main Course, Dessert, etc."
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
                <FormLabel>Description of category(optional)</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={disabledInput}
                    rows={5}
                    className={cn(
                      isViewMode
                        ? "disabled:cursor-auto disabled:opacity-100"
                        : ""
                    )}
                    placeholder="Eg. Starters are small dishes that are served before the main course."
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
                loading={isUpdating || isCreating || isFetchingCategory}
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
              navigate(`${APP_ROUTES.menuCategories}?mode=edit&id=${id}`);
            }}
            endContent={<Pencil size={16} />}
            loading={isUpdating || isCreating || isFetchingCategory}
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateCategoryForm;
