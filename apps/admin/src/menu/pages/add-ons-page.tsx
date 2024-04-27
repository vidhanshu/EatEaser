import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { NSRestaurant } from "@src/types/restaurant.type";
import {
  Loader2,
  MoreHorizontal,
  Plus,
  ArrowUpDown,
  IndianRupee,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
  ImgWithPlaceholder,
} from "@ui/components";
import { CreateAddOnForm } from "@src/menu/components/add-on";
import { APP_ROUTES } from "@src/common/utils/app-routes";
import GenericUrlCruDialog from "@src/common/components/generic-url-cru-dialog";
import useAddOns from "@src/menu/hooks/use-add-ons";
import { GenericTable } from "@src/common/components/generic-table";

//--------------------------------------------------------------------------------------------
export const columns: ({
  deleteAddOn,
  setPage,
}: {
  deleteAddOn: (id: { id: string }) => void;
  setPage: (page: number) => void;
}) => ColumnDef<NSRestaurant.IAddon>[] = ({ deleteAddOn, setPage }) => [
  {
    accessorKey: "image",
    header: "Image",
    cell: (cell) => (
      <ImgWithPlaceholder
        className="w-[100px] h-[100px]"
        src={cell.row.original.image}
        placeHolderProps={{ variant: "h5" }}
        placeholder={cell.row.original.name}
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-muted/50"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (cell) => (
      <div className="max-w-2xl">
        {cell.row.original.description
          ? `${cell.row.original.description?.substring(0, 300)}...`
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-gray-200 dark:hover:bg-muted/50"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (cell) => (
      <div className="flex gap-x-2 items-center">
        <IndianRupee size={16} />
        {cell.row.original.price}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  navigate(
                    `${APP_ROUTES.menuAddOns}?mode=view&id=${row.original._id}`
                  )
                }
              >
                View add-on
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(
                    `${APP_ROUTES.menuAddOns}?mode=edit&id=${row.original._id}`
                  )
                }
              >
                Edit add-on
              </DropdownMenuItem>
              <AlertDialogTrigger>
                <DropdownMenuItem className="text-rose-500">
                  Delete add-on
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex gap-x-2 items-center">
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-rose-500 hover:bg-rose-600 text-white active:bg-rose-700"
                onClick={() => {
                  deleteAddOn({ id: row.original._id });
                  setPage(1);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];

//--------------------------------------------------------------------------------------------

export function AddOnsPage() {
  const [page, setPage] = useState(1);
  const { addOns, isFetchingAddOns, deleteAddOn } = useAddOns({
    variables: { filters: { page: page.toString() } },
  });

  if (isFetchingAddOns) {
    return <Loader2 size={25} className="animate-spin" />;
  }
  return (
    <>
      <div className="flex justify-end pb-4">
        <Link to={`${APP_ROUTES.menuAddOns}?mode=create`}>
          <Button size="sm" startContent={<Plus size={16} />}>
            New AddOn
          </Button>
        </Link>
      </div>
      <GenericTable
        page={page}
        setPage={setPage}
        columns={columns({ deleteAddOn, setPage })}
        totalPages={addOns?.totalPages ?? 1}
        data={addOns?.result ?? []}
      />
      <GenericUrlCruDialog
        itemName="AddOn"
        onCloseNavigateTo={APP_ROUTES.menuAddOns}
      >
        {(mode, id) => <CreateAddOnForm mode={mode} id={id} />}
      </GenericUrlCruDialog>
    </>
  );
}

export default AddOnsPage;
