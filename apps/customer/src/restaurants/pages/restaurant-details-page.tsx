import { ChevronLeft, MousePointerSquare } from "lucide-react";
import { FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdMail } from "react-icons/md";
import { RiReservedFill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

import CImageWithPlaceholder from "@src/common/components/cimg-with-placeholder";
import PageMeta from "@src/common/components/page-meta";
import SeeMoreText from "@src/common/components/see-more-text";
import StartProgressRating from "@src/common/components/star-progress-rating";
import { PAGES } from "@src/common/utils/pages";
import { Button, GenericDialog, Separator, Typography, toast } from "@ui/components";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import RestaurantDetailsPageSkeleton from "../components/skeletons/restaurant-details-page-skeleton";
import { TableStatusBadge } from "../components/status-badge";
import { TableCard } from "../components/table-card";
import useRestaurant from "../hooks/use-restaurant";

dayjs.extend(customParseFormat);

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

  const [tableModalControl, setTableModalControl] = useState<{ open: boolean; id?: string }>({ open: false, id: undefined });

  const { restaurant: data, isLoadingRestaurant: isLoading } = useRestaurant({ id, filters: { includeTables: true } });

  const restaurant = data?.data;
  const table = restaurant?.tables?.find((table) => table._id === tableModalControl.id);

  return (
    <main className="space-y-4">
      <PageMeta title={restaurant?.name!} description={restaurant?.description ?? PAGES.RestaurantDetailsPage(id!).description} ogImg={restaurant?.image} />
      {isLoading ? (
        <RestaurantDetailsPageSkeleton />
      ) : (
        <>
          <div className="relative">
            <div className="bg-black/30 py-2 absolute inset-x-0 w-full">
              <Button onClick={() => navigate(-1)} className="hover:bg-transparent" variant="ghost" endContent={<ChevronLeft className="text-white" />} size="icon-sm" />
            </div>
            <CImageWithPlaceholder className="w-full h-60 rounded-none" placeholder={restaurant?.name} src={restaurant?.image} />
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
                      {dayjs(opening, "HH:mm").format("hh:mm A")}
                      {" - "}
                      {dayjs(closing, "HH:mm").format("hh:mm A")}
                    </Typography>
                  </div>
                ))}
            </section>
            <Separator />
            <section id="tables" className="space-y-4">
              <Typography variant="h4">Choose the table</Typography>
              <div className="flex gap-x-4 items-center max-w-full overflow-auto no-scrollbar">
                {restaurant?.tables?.length && restaurant.tables.length > 0 ? (
                  restaurant.tables.map((table, idx) => <TableCard key={idx} onViewClick={(id) => setTableModalControl({ open: true, id })} {...table} />)
                ) : (
                  <div className="text-muted-foreground">No tables</div>
                )}
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
                +91-{restaurant?.phone}
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
            <Separator />
            <StartProgressRating ratingDetails={restaurant?.ratingDetails} />
          </div>
        </>
      )}

      {/* Table dialog */}
      {table && (
        <GenericDialog
          dialogContentProps={{ className: "max-w-[calc(100%-32px)] sm:max-w-[380px] rounded-md" }}
          queryControlled={{
            open: tableModalControl.open,
            setOpen: (open) => setTableModalControl((prev) => ({ ...prev, open })),
          }}
          dialogTitle={`Table: ${table?.name}`}
          content={
            <div className="space-y-4">
              <CImageWithPlaceholder className="w-24 h-24 mx-auto" placeholder={table?.name} src={table?.qrCode} />
              <div>
                <Typography>Name: {table?.name}</Typography>
              </div>
              <div>
                <Typography>Description:</Typography>
                <Typography as="h1" variant="muted">
                  {<SeeMoreText readMoreBtnClassName="text-sm" className="text-sm" text={table?.description} limit={100} /> ?? "-"}
                </Typography>
              </div>
              <div>
                <Typography>Capacity: {table?.capacity}</Typography>
              </div>
              <div>
                <Typography as="h1" className="flex items-center gap-x-2">
                  Status: <TableStatusBadge className="mx-0" status={table?.status} />
                </Typography>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (table.status !== "AVAILABLE") return toast.error(`This table is already ${table.status.toLowerCase()}!`);
                    navigate(`${PAGES.MenuPage.href}?restaurantId=${id}&tableId=${tableModalControl.id}`);
                  }}
                  endContent={<MousePointerSquare size={16} />}
                  size="xs"
                >
                  Choose
                </Button>
              </div>
            </div>
          }
        />
      )}
    </main>
  );
};

export default RestaurantDetailsPage;
