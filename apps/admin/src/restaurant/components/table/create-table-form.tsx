import { z } from "zod";
import { useForm } from "react-hook-form";
import { ArrowDownToLine, ChevronRight, Pencil } from "lucide-react";

import { createTableSchema } from "../../utils/validations";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@ui/components";
import useTable from "../../hooks/use-table";
import { cn } from "@ui/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { NSRestaurant } from "@src/types/restaurant.type";

/// ------------------------------------------------------------------------------

const defaultValues: z.infer<typeof createTableSchema> = {
  capacity: "",
  description: "",
  name: "",
  status: "AVAILABLE",
};

const K_TABLE_STATUS_OPTIONS = [
  {
    label: "Available 🟢",
    value: "AVAILABLE",
  },
  {
    label: "Reserved 🔴",
    value: "RESERVED",
  },
  {
    label: "Occupied 🟡",
    value: "OCCUPIED",
  },
];

/// ------------------------------------------------------------------------------

export const CreateTableForm = ({
  mode,
  id,
}: {
  mode: "view" | "edit" | "create";
  id?: string;
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createTable, loading, updatedTable, table, getById } = useTable({
    fetchTables: false,
    variables: { tableId: id },
    onSuccess: () => {
      navigate("/restaurant/tables");
    },
  });
  const status = searchParams.get("status") as NSRestaurant.TABLE_STATUS;
  const form = useForm<z.infer<typeof createTableSchema>>({
    defaultValues,
    resolver: zodResolver(createTableSchema),
  });

  const onSubmit = (values: z.infer<typeof createTableSchema>) => {
    if (mode === "view") return;

    const payload: any = {
      name: values.name,
      capacity: Number(values.capacity),
    };
    if (values.description) {
      payload.description = values.description;
    }
    if (values.status) {
      payload.status = values.status;
    }
    if (mode === "edit") {
      updatedTable({ data: payload, id: id as string });
    } else {
      createTable(payload);
    }
  };

  useEffect(() => {
    if (table) {
      form.reset({ ...table, capacity: table.capacity.toString() });
      form.setValue("status", table.status);
    }
  }, [table]);

  useEffect(() => {
    if (status && ["AVAILABLE", "RESERVED", "OCCUPIED"].includes(status)) {
      form.setValue("status", status);
    }
  }, [status]);

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      getById();
    }
  }, [mode]);
  const isViewMode = mode === "view";

  return (
    <div className="max-w-4xl">
      <Form {...form}>
        {isViewMode && table?.qrCode && (
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-semibold">Table Details</h1>
            <img className="w-24 h-24 mx-auto" alt="qr" src={table?.qrCode} />
            <Button
              size="xs"
              onClick={() => {
                if (!table?.qrCode) return;
                window.open(table.qrCode, "_blank");
              }}
              startContent={<ArrowDownToLine size={16} />}
            >
              Download
            </Button>
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unique Name</FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      isViewMode
                        ? "disabled:cursor-auto disabled:opacity-100"
                        : ""
                    )}
                    disabled={isViewMode || loading}
                    placeholder="Eg. T1"
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
                <FormLabel>Description of table(optional)</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isViewMode || loading}
                    rows={5}
                    className={cn(
                      isViewMode
                        ? "disabled:cursor-auto disabled:opacity-100"
                        : ""
                    )}
                    placeholder="Location, room where table is present"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity of table</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className={cn(
                      isViewMode
                        ? "disabled:cursor-auto disabled:opacity-100"
                        : ""
                    )}
                    disabled={isViewMode || loading}
                    placeholder="Capacity of the table, eg. 6"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Table status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        isViewMode
                          ? "disabled:cursor-auto disabled:opacity-100"
                          : ""
                      )}
                      disabled={isViewMode || loading}
                    >
                      <SelectValue placeholder="Select Table status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {K_TABLE_STATUS_OPTIONS.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isViewMode ? (
            <div className="flex justify-end">
              <Button endContent={<ChevronRight size={16} />} loading={loading}>
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
              navigate(`/restaurant/tables?mode=edit&id=${id}`);
            }}
            endContent={<Pencil size={16} />}
            loading={loading}
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateTableForm;
