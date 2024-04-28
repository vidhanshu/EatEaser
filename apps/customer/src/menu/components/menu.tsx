import { Link } from "react-router-dom";
import { IndianRupee, Minus, Plus } from "lucide-react";

import { Button, ImgWithPlaceholder, Input, Typography, GenericAlertDialog } from "@repo/ui";
import { NSRestaurant } from "@src/common/types/restaurant.type";
import CSkeleton from "@src/common/components/skeleton";
import useCartStore from "@src/cart/stores/cart-store";

const Menu = ({
  menuItems,
  isLoading,
  sectionTitle = "Dishes",
  forCart = false,
  notFoundTitle = "Not Found",
  notFoundDescription = "Sorry, no food items found for this category",
}: {
  menuItems: NSRestaurant.IMenuItem[];
  isLoading: boolean;
  sectionTitle?: string;
  forCart?: boolean;
  notFoundTitle?: string;
  notFoundDescription?: string;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-medium">{sectionTitle}</h1>
      </div>
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
          <div className="flex flex-col gap-4">
            <img className="w-60 mx-auto h-auto" src="/not-found-food.svg" />
            <div className="space-y-2">
              <Typography className="text-center" variant="h4">
                {notFoundTitle}
              </Typography>
              <Typography className="text-center" variant="muted">
                {notFoundDescription}
              </Typography>
            </div>
          </div>
        ) : (
          menuItems.map((mi) => <MenuItem key={mi._id} {...mi} forCart={forCart} />)
        )}
      </div>
    </div>
  );
};

export default Menu;

const MenuItem = ({ name, _id, category, isAvailable, price, image, isVegetarian, forCart }: NSRestaurant.IMenuItem & { forCart?: boolean }) => {
  const { removeFromCart, getCartItem, changeQuantity } = useCartStore();
  const itemQty = getCartItem(_id)?.quantity!;

  const Comp = forCart ? "div" : Link;
  const Comp2 = !forCart ? "div" : Link;

  return (
    <div>
      <Comp to={`/menu/${_id}`} className="flex border-none shadow-sm rounded-md bg-white dark:bg-[#1f222a]">
        <Comp2 to={`/menu/${_id}`}>
          <div className="p-4">
            <ImgWithPlaceholder placeholder={name} className="w-24 h-24" src={image} />
          </div>
        </Comp2>
        <div className="p-4 pl-0 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <Typography variant="md" className="truncate max-w-[180px]">
              {name}
            </Typography>
            {forCart && (
              <GenericAlertDialog
                onOk={() => removeFromCart(_id)}
                className="max-w-[95vw] rounded-md p-4 dark:border-gray-800"
                title="Are you sure?"
                description={`Do you really want to remove "${name}" from cart?`}
                okBtnTitle="Yes, remove it"
              >
                <Button variant="destructive" className="w-6 h-6" size="icon-sm">
                  <Minus size={16} />
                </Button>
              </GenericAlertDialog>
            )}
          </div>
          {!forCart && <Typography className="w-fit text-sm max-w-[180px] whitespace-nowrap truncate text-emerald-500">{category.name}</Typography>}
          <div className="flex gap-x-1 items-center">
            <IndianRupee size={15} />
            <Typography>{price}</Typography>
          </div>
          {!forCart && (
            <div className="flex gap-x-2 items-end">
              {isAvailable ? (
                <span className="text-xs h-[16px] w-fit px-1 rounded-sm bg-emerald-500 text-white">Available</span>
              ) : (
                <span className="text-xs h-[16px] w-fit px-1 rounded-sm bg-rose-500 text-white">Not available</span>
              )}
              {isVegetarian ? (
                <span className="text-xs h-[16px] w-fit px-1 rounded-sm bg-emerald-500 text-white">Veg</span>
              ) : (
                <span className="text-xs h-[16px] w-fit px-1 rounded-sm bg-rose-500 text-white">Non-veg</span>
              )}
            </div>
          )}
          {forCart && (
            <div className="flex gap-x-2 items-center justify-end">
              <div className="w-fit flex gap-x-3 items-center">
                <button
                  disabled={itemQty < 2}
                  onClick={() => changeQuantity(_id, itemQty - 1)}
                  className="min-w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-primary-foreground"
                >
                  <Minus size={15} />
                </button>
                <Input
                  min={1}
                  className="max-w-16 text-center h-7"
                  sizeVariant="sm"
                  value={itemQty}
                  onChange={(e) => {
                    changeQuantity(_id, Number(e.target.value));
                  }}
                  type="number"
                  placeholder="Enter quantity"
                />
                <button
                  onClick={() => changeQuantity(_id, itemQty + 1)}
                  className="min-w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-primary-foreground"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </Comp>
    </div>
  );
};
