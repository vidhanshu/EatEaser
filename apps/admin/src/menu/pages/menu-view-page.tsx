import { useParams } from "react-router-dom";
import { MenuItemHeader } from "../components/menu";
import useMenu from "../hooks/use-menu";
import { useEffect } from "react";
import { Separator } from "@ui/components";
import MenuMoreInfo from "../components/menu/menu-more-info";
import AddOns from "../components/menu/add-ons";

const MenuViewPage = () => {
  const { id } = useParams();
  const {
    menuItem,
    isLoadingMenuItem: loading,
    getMenuItem,
  } = useMenu({
    fetchMenuItems: false,
    variables: { menuItemId: id },
  });

  useEffect(() => {
    if (id) getMenuItem();
  }, [id]);

  return (
    <>
      <MenuItemHeader isFetching={loading} menuItem={menuItem} />
      <Separator className="my-6" />
      <MenuMoreInfo isFetching={loading} moreInfo={menuItem?.moreInfo ?? []} />
      <Separator className="my-6" />
      <AddOns isFetching={loading} addOns={menuItem?.addOns ?? []} />
    </>
  );
};

export default MenuViewPage;
