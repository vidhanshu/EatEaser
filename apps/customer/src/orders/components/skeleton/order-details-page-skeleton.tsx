import CSkeleton from "@src/common/components/skeleton";

const OrderDetailsPageSkeleton = () => {
  return (
    <div className="py-8 px-4 space-y-4">
      <div className="grid grid-cols-6 gap-4">
        <CSkeleton className="col-span-2 rounded-sm h-6" />
        <CSkeleton className="col-span-4 rounded-sm h-6" />
        <CSkeleton className="col-span-2 rounded-sm h-6" />
        <CSkeleton className="col-span-4 rounded-sm h-6" />
        <CSkeleton className="col-span-2 rounded-sm h-6" />
        <CSkeleton className="col-span-4 rounded-sm h-6" />
        <CSkeleton className="col-span-2 rounded-sm h-6" />
        <CSkeleton className="col-span-4 rounded-sm h-6" />
        <CSkeleton className="col-span-2 rounded-sm h-6" />
        <CSkeleton className="col-span-4 rounded-sm h-6" />
        <CSkeleton className="col-span-2 rounded-sm h-6" />
        <CSkeleton className="col-span-4 rounded-sm h-6" />
      </div>
      <div className="space-y-4">
        <CSkeleton className="w-full rounded-sm h-20" />
        <CSkeleton className="w-full rounded-sm h-20" />
        <CSkeleton className="w-full rounded-sm h-8" />
        <CSkeleton className="w-full rounded-sm h-8" />
        <CSkeleton className="w-full rounded-sm h-8" />
      </div>
    </div>
  );
};

export default OrderDetailsPageSkeleton;
