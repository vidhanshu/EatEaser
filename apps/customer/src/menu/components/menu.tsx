import { Link } from "react-router-dom";
import { IndianRupee } from "lucide-react";

import { ImgWithPlaceholder, Typography } from "@repo/ui";
import { NSRestaurant } from "@src/common/types/restaurant.type";

const Menu = ({ menuItems, isLoading }: { menuItems: NSRestaurant.IMenuItem[]; isLoading: Boolean }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-medium">Dishes</h1>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse shadow-sm p-4 rounded-md">
              <div>
                <div className="flex gap-x-2 items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-md" />
                  <div className="flex-1 space-y-4">
                    <div className="w-1/2 h-4 bg-gray-200 rounded-md" />
                    <div className="w-1/4 h-4 bg-gray-200 rounded-md" />
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
                Not Found
              </Typography>
              <Typography className="text-center" variant="muted">
                Sorry, no food items found for this category
              </Typography>
            </div>
          </div>
        ) : (
          menuItems.map((mi) => <MenuItem key={mi._id} {...mi} />)
        )}
      </div>
    </div>
  );
};

export default Menu;

const MenuItem = ({ name, _id, category, isAvailable, price, image, isVegetarian }: NSRestaurant.IMenuItem) => {
  return (
    <div>
      <Link to={`/menu/${_id}`} className="flex border-none shadow-sm rounded-md bg-white">
        <div className="p-4">
          <ImgWithPlaceholder placeholder={name} className="w-24 h-24" src={image} />
        </div>
        <div className="p-4 pl-0 flex-1 flex flex-col justify-between">
          <Typography variant="md" className="truncate max-w-[180px]">
            {name}
          </Typography>
          <Typography className="w-fit text-sm max-w-[180px] whitespace-nowrap truncate text-emerald-500">{category.name}</Typography>
          <div className="flex gap-x-1 items-center">
            <IndianRupee size={15} />
            <Typography>{price}</Typography>
          </div>
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
        </div>
      </Link>
    </div>
  );
};
