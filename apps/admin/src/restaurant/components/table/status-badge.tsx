import { NSRestaurant } from "@src/types/restaurant.type";

export const getClassNameByStatus = (
    status: NSRestaurant.TABLE_STATUS,
    borderOnly: boolean = false
  ) => {
    switch (status) {
      case "AVAILABLE":
        return borderOnly
          ? "border-green-500 bg-green-300/5"
          : "border text-sm w-fit mx-auto border-green-500 px-2 bg-green-500/20 rounded-full";
      case "RESERVED":
        return borderOnly
          ? "border-rose-500 bg-red-300/5"
          : "border text-sm w-fit mx-auto border-rose-500 px-2 bg-rose-500/20 rounded-full";
      case "OCCUPIED":
        return borderOnly
          ? "border-yellow-500 bg-yellow-300/5"
          : "border text-sm w-fit mx-auto border-yellow-500 px-2 bg-yellow-500/20 rounded-full";
      default:
        return borderOnly
          ? "border-gray-500 bg-gray-300/5"
          : "border text-sm w-fit mx-auto border-gray-500 px-2 bg-gray-500/20 rounded-full";
    }
  };
  
  export const TableStatusBadge = ({
    status,
  }: {
    status: NSRestaurant.TABLE_STATUS;
  }) => (
    <div className={getClassNameByStatus(status)}>
      {status.toLowerCase() ?? "NA"}
    </div>
  );