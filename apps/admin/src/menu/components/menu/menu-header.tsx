import {
  Pencil,
  ReceiptText,
  Salad,
  IndianRupee,
  Vegan,
  Settings2,
  Layers2,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@ui/components";
import KeyVal from "@ui/components/custom/key-val";
import { NSRestaurant } from "@src/types/restaurant.type";
import useSidebarStore from "@src/common/stores/sidebar-store";
import ImgWithPlaceholder from "@src/common/components/img-with-placeholder";
import { HeaderSkeleton } from "@src/common/components/skeletons";
import { APP_ROUTES } from "@src/common/utils/app-routes";
import GenericAlertDialog from "@ui/components/custom/generic-alert-dialog";
import useMenu from "@src/menu/hooks/use-menu";

export const MenuItemHeader = ({
  menuItem: data,
  isFetching = false,
}: {
  menuItem?: NSRestaurant.IMenuItem;
  isFetching: boolean;
}) => {
  const navigate = useNavigate();
  const open = useSidebarStore((state) => state.open);
  const { deleteMenuItem, isDeleting } = useMenu({
    fetchMenuItems: false,
    variables: { menuItemId: data?._id },
    onSuccess: () => {
      navigate(APP_ROUTES.menu);
    },
  });

  if (isFetching) {
    return <HeaderSkeleton />;
  }

  const keyValData = [
    {
      label: "Name",
      icon: Salad,
      value: data?.name,
    },
    {
      label: "Price",
      icon: IndianRupee,
      value: data?.price,
    },
    {
      label: "Vegan?",
      icon: Vegan,
      value: data?.isVegan ? "Yes" : "No",
    },
    {
      label: "Available?",
      icon: Settings2,
      value: data?.isAvailable ? "Yes" : "No",
    },
    {
      label: "Category",
      icon: Layers2,
      value: data?.category?.name,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div className="flex gap-x-4 items-center">
          <ImgWithPlaceholder src={data?.image} placeholder={data?.name} />
          <div className="space-y-2">
            {keyValData.map(({ label, icon, value }) => (
              <KeyVal key={label} label={{ label, icon }} value={value} />
            ))}
          </div>
        </div>
        <div className="flex gap-x-4">
          <GenericAlertDialog onOk={() => deleteMenuItem({ id: data?._id! })}>
            <Button
              loading={isDeleting}
              variant="destructive"
              size="sm"
              startContent={<Trash2 size={16} />}
            >
              Delete
            </Button>
          </GenericAlertDialog>

          <Link to={`${APP_ROUTES.menuEdit}?id=${data?._id}`}>
            <Button size="sm" startContent={<Pencil size={16} />}>
              Edit
            </Button>
          </Link>
        </div>
      </div>
      <KeyVal
        containerProps={{ className: "flex flex-col items-start gap-2" }}
        label={{ label: "Description", icon: ReceiptText }}
        value={data?.description || "N/A"}
        valueProps={{
          className: open
            ? "max-w-[calc(100vw-250px-64px)]"
            : "max-w-[calc(100vw-85px-64px)]",
        }}
      />
    </div>
  );
};

export default MenuItemHeader;
