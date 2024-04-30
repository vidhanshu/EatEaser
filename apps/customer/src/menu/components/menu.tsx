import React, { Ref } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, IndianRupee, Loader2, Minus, Plus } from "lucide-react";

import { Button, ImgWithPlaceholder, Input, Typography, GenericAlertDialog, Separator } from "@repo/ui";
import { NSRestaurant } from "@src/common/types/restaurant.type";
import CSkeleton from "@src/common/components/skeleton";
import useCartStore from "@src/cart/stores/cart-store";
import Empty from "@src/common/components/empty";
import { IoFastFoodOutline } from "react-icons/io5";
import { cn } from "@ui/lib/utils";
import { MenuDetailsPage, MenuPage } from "@src/common/utils/pages";

const Menu = ({
  menuItems,
  isLoading,
  sectionTitle = "Dishes",
  forCart = false,
  notFoundTitle = "Not Found",
  notFoundDescription = "Sorry, no food items found for this category",
  endRef,
  isFetchingNextPage,
  hasNextMenuPage,
}: {
  menuItems: NSRestaurant.IMenuItem[];
  isLoading: boolean;
  sectionTitle?: React.ReactNode;
  forCart?: boolean;
  notFoundTitle?: string;
  notFoundDescription?: string;
  endRef?: Ref<HTMLDivElement>;
  isFetchingNextPage?: boolean;
  hasNextMenuPage?: boolean;
}) => {
  return (
    <div className="space-y-2">
      <h1 className="text-base font-medium w-full">{sectionTitle}</h1>
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse shadow-sm p-4 rounded-md">
              <div>
                <div className="flex gap-x-2 items-center">
                  <CSkeleton className="w-24 h-24  rounded-md" />
                  <div className="flex-1 space-y-4">
                    <CSkeleton className="w-1/2 h-4  rounded-md" />
                    <CSkeleton className="w-1/4 h-4  rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : !menuItems.length ? (
          <Empty notFoundTitle={notFoundTitle} notFoundDescription={notFoundDescription}>
            {forCart && (
              <Link to={MenuPage.href} className="max-w-fit mx-auto">
                <Button size="sm" endContent={<ArrowRight size={16} />}>
                  Explore
                </Button>
              </Link>
            )}
          </Empty>
        ) : (
          menuItems.map((mi, idx) => {
            if (!forCart) return <MenuItem {...(menuItems.length - 1 === idx ? { endRef } : {})} key={mi._id} {...mi} />;
            else {
              return (
                <React.Fragment key={mi._id}>
                  <MenuItem forCart={forCart} {...mi} />
                  {idx < menuItems?.length! - 1 && <Separator />}
                </React.Fragment>
              );
            }
          })
        )}
        {!forCart && (
          <>
            {isFetchingNextPage && <Loader2 className="mx-auto animate-spin mt-4" />}
            {!hasNextMenuPage && <div className="text-center text-sm text-muted-foreground">You reached the end of the page!</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;

const MenuItem = ({ endRef, ...item }: NSRestaurant.IMenuItem & { forCart?: boolean; endRef?: Ref<HTMLDivElement> }) => {
  const { name, _id: itemId, category, isAvailable, price, image, isVegetarian, forCart, addOns } = item;
  const { removeFromCart, getCartItem, addToCart, changeQuantity, isInCart, removeAddon } = useCartStore();
  const itemQty = getCartItem(itemId)?.quantity!;

  return (
    <div className={cn("border-none shadow-sm rounded-md bg-white dark:bg-input", addOns.length && forCart && "pb-4")}>
      <div className="flex">
        <Link to={MenuDetailsPage(itemId).href}>
          <div className="p-4">
            <ImgWithPlaceholder placeholder={name} className="w-24 h-24" src={image} />
          </div>
        </Link>
        <div className="p-4 pl-0 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <Typography variant="md" className="truncate max-w-[180px]">
              {name}
            </Typography>
            {isAvailable && (
              <>
                {isInCart(itemId) ? (
                  <GenericAlertDialog
                    onOk={() => removeFromCart(itemId)}
                    className="max-w-[95vw] w-fit min-w-[350px] rounded-md p-4 dark:border-gray-800"
                    title="Are you sure?"
                    description={`Do you really want to remove "${name}" from cart?`}
                    okBtnTitle="Yes, remove it"
                  >
                    <Button variant="destructive" className="w-6 h-6" size="icon-sm">
                      <Minus size={16} />
                    </Button>
                  </GenericAlertDialog>
                ) : (
                  <Button onClick={() => addToCart({ ...item, quantity: 1 })} className="w-6 h-6" size="icon-sm">
                    <Plus size={16} />
                  </Button>
                )}
              </>
            )}
          </div>
          {!forCart && <Typography className="w-fit text-sm max-w-[180px] whitespace-nowrap truncate text-primary">{category.name}</Typography>}
          <div {...(endRef ? { ref: endRef } : {})} className="flex gap-x-1 items-center">
            <IndianRupee size={15} />
            <Typography>{price}</Typography>
          </div>
          {!forCart && (
            <>
              <div className="flex gap-x-2 items-end">
                {isAvailable ? (
                  <span className="text-xs h-[16px] w-fit px-1 rounded-sm bg-primary text-white">Available</span>
                ) : (
                  <span className="text-xs h-[16px] w-fit px-1 rounded-sm bg-rose-500 text-white">Not available</span>
                )}
                {isVegetarian ? <img className="size-4" src="/veg.png" /> : <img className="size-4" src="/non-veg.png" />}
                {addOns?.length > 0 && <IoFastFoodOutline className="size-4 text-primary" />}
              </div>
            </>
          )}
          {forCart && (
            <div className="flex gap-x-2 items-center justify-end">
              <div className="w-fit flex gap-x-3 items-center">
                <button
                  disabled={itemQty < 2}
                  onClick={() => changeQuantity(itemId, itemQty - 1)}
                  className="min-w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
                >
                  <Minus size={15} />
                </button>
                <Input
                  min={1}
                  className="max-w-16 text-center h-7 appearance-none"
                  sizeVariant="sm"
                  value={itemQty}
                  onChange={(e) => {
                    changeQuantity(itemId, Number(e.target.value));
                  }}
                  type="number"
                  placeholder="Enter quantity"
                />
                <button
                  onClick={() => changeQuantity(itemId, itemQty + 1)}
                  className="min-w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {forCart && (
        <div className="px-4">
          {addOns.length > 0 && (
            <div className="space-y-4">
              <Typography variant="muted">
                Add ons for {name}({addOns.length})
              </Typography>
              {addOns.map(({ _id, name, price, image }) => (
                <div key={_id} className="bg-white dark:bg-input border border-input dark:border-gray-800 p-2 rounded-md justify-between flex gap-x-4">
                  <div className="flex gap-x-4">
                    <ImgWithPlaceholder placeholder={name} src={image} className="w-16 h-16" />
                    <div>
                      <Typography>{name}</Typography>
                      <Typography className="flex gap-x-2 items-center text-primary">
                        <IndianRupee size={20} /> {price}
                      </Typography>
                    </div>
                  </div>
                  <Button className="w-6 h-6" onClick={() => removeAddon(itemId, _id)} variant="destructive" size="icon-sm">
                    <Minus size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
