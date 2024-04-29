import CSkeleton from "@src/common/components/skeleton";

const RestaurantDetailsPageSkeleton = () => {
  return (
    <div className="space-y-4">
      <CSkeleton className="h-60" />
      <div className="px-4 space-y-4">
        <CSkeleton className="h-7 rounded-md" />
        <CSkeleton className="h-7 rounded-md" />
        <CSkeleton className="h-2 rounded-md" />
        <CSkeleton className="h-2 rounded-md" />
        <CSkeleton className="h-2 rounded-md" />
        <CSkeleton className="h-2 rounded-md" />
        <div className="grid grid-cols-5 gap-4">
          <CSkeleton className="col-span-2 h-32 rounded-md" />
          <CSkeleton className="col-span-3 h-32 rounded-md" />
        </div>
        <CSkeleton className="h-7 rounded-md" />
        <CSkeleton className="h-7 rounded-md" />
        <CSkeleton className="h-2 rounded-md" />
        <CSkeleton className="h-2 rounded-md" />
        <CSkeleton className="h-2 rounded-md" />
        <CSkeleton className="h-2 rounded-md" />
      </div>
    </div>
  );
};

export default RestaurantDetailsPageSkeleton;
