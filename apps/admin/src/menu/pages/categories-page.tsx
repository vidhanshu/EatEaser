import { GenericTable } from "@src/common/components/generic-table";
import GenericUrlCruDialog from "@src/common/components/generic-url-cru-dialog";
import { APP_ROUTES } from "@src/common/utils/app-routes";
import { CreateCategoryForm } from "@src/menu/components/categories";
import useCategory from "@src/menu/hooks/use-categories";
import { NSRestaurant } from "@src/types/restaurant.type";
import { ColumnDef } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ImgWithPlaceholder,
} from "@ui/components";
import { ArrowUpDown, Loader2, MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//--------------------------------------------------------------------------------------------
export const columns: ({ deleteCategory }: { deleteCategory: (id: { id: string }) => void }) => ColumnDef<NSRestaurant.ICategory>[] = ({ deleteCategory }) => [
  {
    accessorKey: "image",
    header: "Image",
    cell: (cell) => <ImgWithPlaceholder className="w-[100px] h-[100px]" src={cell.row.original.image} placeHolderProps={{ variant: "h5" }} placeholder={cell.row.original.name} />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="hover:bg-gray-200 dark:hover:bg-muted/50" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (cell) => <div className="max-w-2xl">{cell.row.original.description ? `${cell.row.original.description?.substring(0, 300)}...` : "N/A"}</div>,
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
              <DropdownMenuItem onClick={() => navigate(`${APP_ROUTES.menuCategories}?mode=view&id=${row.original._id}`)}>View category</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`${APP_ROUTES.menuCategories}?mode=edit&id=${row.original._id}`)}>Edit category</DropdownMenuItem>
              <AlertDialogTrigger>
                <DropdownMenuItem className="text-rose-500">Delete category</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex gap-x-2 items-center">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will also delete all the menu items associated with this category, you can change their categories if want to keep them.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-rose-500 hover:bg-rose-600 text-white active:bg-rose-700" onClick={() => deleteCategory({ id: row.original._id })}>
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

export function CategoriesPage() {
  const [page, setPage] = useState(1);
  const { categories, isLoadingCategories, deleteCategory } = useCategory({
    variables: {
      filters: { page: page.toString() },
    },
  });

  if (isLoadingCategories) {
    return <Loader2 size={25} className="animate-spin" />;
  }
  return (
    <>
      <div className="flex justify-end pb-4">
        <Link to={`${APP_ROUTES.menuCategories}?mode=create`}>
          <Button size="sm" startContent={<Plus size={16} />}>
            New Category
          </Button>
        </Link>
      </div>
      <GenericTable setPage={setPage} page={page} totalPages={categories?.totalPages ?? 1} columns={columns({ deleteCategory })} data={categories?.result ?? []} />
      <GenericUrlCruDialog itemName="Category" onCloseNavigateTo={APP_ROUTES.menuCategories}>
        {(mode, id) => <CreateCategoryForm mode={mode} id={id} />}
      </GenericUrlCruDialog>
    </>
  );
}

export default CategoriesPage;
