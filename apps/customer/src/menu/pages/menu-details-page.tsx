import { useParams, useNavigate } from "react-router-dom";
import useMenu from "../hooks/use-menu";
import { useEffect, useState } from "react";
import { Button, ImgWithPlaceholder, Typography, Table, TableCell, TableRow, TableBody, Separator, Input } from "@repo/ui";
import { CheckCircle, ChevronLeft, IndianRupee, Minus, Plus, ShoppingCart, XCircle } from "lucide-react";
import SeeMoreText from "@src/common/components/see-more-text";
import MenuDetailsPageSkeleton from "../components/skeletons/menu-detail-page-skeleton";
import useCartStore from "@src/cart/stores/cart-store";
import PageMeta from "@src/common/components/page-meta";
import { CheckoutPage, PAGES } from "@src/common/utils/pages";
import { FaStar, FaStarHalf } from "react-icons/fa6";

const MenuDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addAddon, getCartItem, removeAddon, isInCart, removeFromCart, cart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const { getMenuItem, menuItem, isLoadingMenuItem } = useMenu({ variables: { menuItemId: id } });

  useEffect(() => {
    if (id) getMenuItem();
  }, [id]);

  if (isLoadingMenuItem) {
    return <MenuDetailsPageSkeleton />;
  }

  const itemInCart = getCartItem(menuItem?._id!);

  return (
    <main className="space-y-4">
      <PageMeta title={menuItem?.name!} description={menuItem?.description ?? PAGES.MenuDetailsPage(id!).description} ogImg={menuItem?.image} />
      <div className="relative">
        <div className="bg-black/30 py-2 absolute inset-x-0 w-full">
          <Button onClick={() => navigate(-1)} className="hover:bg-transparent" variant="ghost" endContent={<ChevronLeft className="text-white" />} size="icon-sm" />
        </div>
        <ImgWithPlaceholder className="w-full h-60 rounded-none" placeholder={menuItem?.name} src={menuItem?.image} />
      </div>
      <div className="px-4 space-y-4 relative">
        {menuItem?.isVegetarian ? <img className="absolute top-0 right-4 w-6 h-6" src="/veg.png" /> : <img className="absolute top-0 right-4 w-6 h-6" src="/non-veg.png" />}
        <Typography variant="h3">{menuItem?.name}</Typography>
        <div className="flex justify-start">
          <Typography className="flex gap-x-2 items-center text-primary" variant="large">
            <IndianRupee size={20} /> {menuItem?.price}
          </Typography>
        </div>
        <div>
          <Typography>4.5 Rating (1245 Users)</Typography>
          <div className="flex gap-x-2">
            <div className="flex gap-x-2 items-center w-fit mt-2">
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStar className="text-yellow-500" />
              <FaStarHalf className="text-yellow-500" />
            </div>
          </div>
        </div>
        {menuItem?.description && <Separator />}
        {menuItem?.description && (
          <div>
            <Typography variant="h5">Details</Typography>
            <SeeMoreText text={menuItem.description} />
          </div>
        )}

        {!!menuItem?.addOns?.length && (
          <div>
            <Typography variant="h5">Add ons</Typography>
            <div className="mt-4 w-full no-scrollbar overflow-auto flex gap-x-4">
              {menuItem.addOns.map(({ _id, name, price, description, image, restaurant }) => (
                <div className="bg-input p-2 rounded-md shadow-sm border dark:border-input min-w-[calc(100%-30px)] flex gap-x-2" key={_id}>
                  <ImgWithPlaceholder className="max-w-32 max-h-32" placeholder={name} src={image} />
                  <div className="flex flex-col gap-1 justify-between flex-1">
                    <Typography className="max-w-[100px] sm:max-w-[150px] truncate" variant="h5">
                      {name}
                    </Typography>
                    <div className="flex gap-x-1 items-center">
                      <IndianRupee className="text-primary" size={15} />
                      <Typography className="text-primary">{price}</Typography>
                    </div>
                    <Typography className="max-w-[100px] sm:max-w-[150px] truncate" variant="muted">
                      {description}
                    </Typography>
                    {itemInCart?.addOns?.map(({ _id }) => _id)?.includes(_id) ? (
                      <div className="flex justify-end">
                        <Button onClick={() => removeAddon(menuItem?._id, _id)} variant="destructive" disabled={!menuItem?.isAvailable || !itemInCart} size="icon-sm">
                          <Minus size={16} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <Button
                          onClick={() => addAddon(menuItem?._id, { _id, name, price, description, image, restaurant })}
                          disabled={!menuItem?.isAvailable || !itemInCart}
                          size="icon-sm"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!!menuItem?.moreInfo?.length && (
          <div>
            <Typography variant="h5">More Info</Typography>
            <Table>
              <TableBody>
                {menuItem?.moreInfo.map(({ value, label }, idx) => {
                  return (
                    <TableRow key={idx} className="dark:border-input">
                      <TableCell>{label}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="border-b dark:border-input" />
        <div className="space-y-4">
          <div className="flex gap-x-2 items-center justify-between">
            <Typography>Choose Quantity</Typography>
            <div className="w-fit flex gap-x-3 items-center">
              <Button disabled={quantity < 2} onClick={() => setQuantity((q) => q - 1)} className="min-w-8" size="icon-sm">
                <Minus size={20} />
              </Button>
              <Input className="max-w-16 text-center" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} type="number" placeholder="Enter quantity" />
              <Button onClick={() => setQuantity((q) => q + 1)} className="min-w-8" size="icon-sm">
                <Plus size={20} />
              </Button>
            </div>
          </div>
          <div className="flex gap-x-4 items-center">
            {isInCart(menuItem?._id!) ? (
              <Button
                onClick={() => {
                  if (menuItem) {
                    removeFromCart(menuItem?._id!);
                  }
                }}
                disabled={!menuItem?.isAvailable}
                size="sm"
                endContent={<Minus size={16} />}
                variant="destructive"
                className="flex-1"
              >
                Remove
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (menuItem) {
                    addToCart({ ...menuItem, addOns: [], quantity });
                  }
                }}
                disabled={!menuItem?.isAvailable}
                endContent={<ShoppingCart size={16} />}
                className="flex-1 bg-white dark:bg-input"
                variant="outline"
              >
                Add to cart
              </Button>
            )}
            <Button
              variant={!menuItem?.isAvailable ? "destructive" : "default"}
              disabled={!menuItem?.isAvailable || !cart.length}
              endContent={!menuItem?.isAvailable ? <XCircle size={16} /> : <CheckCircle size={16} />}
              className="flex-1"
              size="sm"
              onClick={menuItem?.isAvailable && cart.length ? () => navigate(CheckoutPage.href) : () => {}}
            >
              {!menuItem?.isAvailable ? "Not available" : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MenuDetailsPage;
