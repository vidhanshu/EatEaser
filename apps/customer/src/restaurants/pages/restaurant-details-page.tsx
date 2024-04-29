import { useParams, useNavigate } from "react-router-dom";
import { Button, ImgWithPlaceholder, Typography, Separator, Progress } from "@repo/ui";
import { ChevronLeft } from "lucide-react";
import SeeMoreText from "@src/common/components/see-more-text";
import axiosInstance from "@src/common/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { ROUTES } from "@src/common/utils/api-routes";
import { NSRestaurant } from "@src/common/types/restaurant.type";
import { FaPhone, FaStar, FaStarHalf } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdMail } from "react-icons/md";
import { RiReservedFill } from "react-icons/ri";
import RestaurantDetailsPageSkeleton from "../components/skeletons/restaurant-details-page-skeleton";

// -----------------------------------------------------------------------------------------------
const dayFullMap = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
};

type dfmKeyType = keyof typeof dayFullMap;
// -----------------------------------------------------------------------------------------------

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      if (id) return (await axiosInstance.get(ROUTES.restaurant.byId(id))).data as NSCommon.ApiResponse<NSRestaurant.IResturant>;
    },
  });

  const restaurant = data?.data;

  return (
    <main className="space-y-4">
      {isLoading ? (
        <RestaurantDetailsPageSkeleton />
      ) : (
        <>
          <div className="relative">
            <div className="bg-black/30 py-2 absolute inset-x-0 w-full">
              <Button onClick={() => navigate(-1)} className="hover:bg-transparent" variant="ghost" endContent={<ChevronLeft className="text-white" />} size="icon-sm" />
            </div>
            <ImgWithPlaceholder className="w-full h-60 rounded-none" placeholder={restaurant?.name} src={restaurant?.image} />
          </div>
          <div className="px-4 space-y-4">
            <section>
              <Typography variant="h4">{restaurant?.name}</Typography>
            </section>
            <Separator />
            <section className="space-y-4">
              <Typography variant="h4">Overview</Typography>
              <SeeMoreText className="text-sm" readMoreBtnClassName="text-sm" text={restaurant?.description!} />
              {!!restaurant?.openingHours?.length &&
                restaurant.openingHours.length > 0 &&
                restaurant.openingHours.map(({ closing, day, opening }, idx) => (
                  <div key={idx} className="flex gap-x-4">
                    <Typography className="w-24 font-semibold">{dayFullMap[day as dfmKeyType]}</Typography>
                    <Typography className="text-primary font-medium">
                      {opening}-{closing}
                    </Typography>
                  </div>
                ))}
            </section>
            <Separator />
            <section className="grid grid-cols-5 items-center">
              <div className="col-span-2 space-y-2">
                <Typography className="text-4xl font-semibold text-center">4.8</Typography>
                <div className="flex gap-x-2 items-center w-fit mx-auto">
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStarHalf className="text-yellow-500" />
                </div>
                <Typography variant="muted" className="text-center text-xs">
                  (128k reviews)
                </Typography>
              </div>
              <div className="col-span-3 border-l-2 pl-4">
                <div className="flex gap-x-2 items-center">
                  <span className="w-4">5</span> <Progress className="h-2" value={90} />
                </div>
                <div className="flex gap-x-2 items-center">
                  <span className="w-4">4</span> <Progress className="h-2" value={78} />
                </div>
                <div className="flex gap-x-2 items-center">
                  <span className="w-4">3</span> <Progress className="h-2" value={55} />
                </div>
                <div className="flex gap-x-2 items-center">
                  <span className="w-4">2</span> <Progress className="h-2" value={30} />
                </div>
                <div className="flex gap-x-2 items-center">
                  <span className="w-4">1</span> <Progress className="h-2" value={10} />
                </div>
              </div>
            </section>
            <Separator />
            <section className="space-y-4">
              <Typography variant="h4">Address</Typography>
              <Typography variant="muted">
                <FaLocationDot size={24} className="text-primary inline mr-2" />
                {restaurant?.address}
              </Typography>
              {restaurant?.googleMapLink && (
                <iframe className="w-full h-60 rounded-md" src={restaurant.googleMapLink} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              )}
            </section>
            <Separator />
            <section className="space-y-4">
              <Typography variant="h4">Contact Information</Typography>
              <Typography variant="muted">
                <FaPhone size={16} className="text-primary inline mr-2" />
                {restaurant?.phone}
              </Typography>
              <Typography variant="muted">
                <MdMail size={16} className="text-primary inline mr-2" />
                {restaurant?.email}
              </Typography>
              <Typography variant="muted">
                <RiReservedFill size={18} className="text-primary inline mr-2" />
                {restaurant?.acceptsReservations ? "Accepts reserversations" : "Doesn't accept reservations"}
              </Typography>
            </section>
          </div>
        </>
      )}
    </main>
  );
};

export default RestaurantDetailsPage;
