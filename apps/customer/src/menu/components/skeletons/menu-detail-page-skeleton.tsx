import CSkeleton from "@src/common/components/skeleton";

const MenuDetailsPageSkeleton = () => {
  return (
    <div className="space-y-4">
      <CSkeleton className="w-full h-60 rounded-md" />
      <div className="flex gap-x-4 px-4">
        <CSkeleton className="flex-1 w-full rounded-md h-10" />
        <CSkeleton className="w-10 rounded-md h-10" />
      </div>
      <div className="flex gap-x-4 px-4">
        <CSkeleton className="w-10 rounded-md h-10" />
      </div>
      <div className="px-4 space-y-4">
        <CSkeleton className="w-full h-3 rounded-md" />
        <div className="flex gap-x-4">
          <CSkeleton className="w-4 h-4 rounded-md" />
          <CSkeleton className="w-4 h-4 rounded-md" />
          <CSkeleton className="w-4 h-4 rounded-md" />
          <CSkeleton className="w-4 h-4 rounded-md" />
          <CSkeleton className="w-4 h-4 rounded-md" />
        </div>
      </div>
      <div className="px-4 space-y-4">
        <CSkeleton className="flex-1 w-full rounded-md h-10" />
        <CSkeleton className="w-full h-3 rounded-md" />
        <CSkeleton className="w-full h-3 rounded-md" />
        <CSkeleton className="w-full h-3 rounded-md" />
        <CSkeleton className="w-full h-3 rounded-md" />
      </div>
    </div>
  );
};

export default MenuDetailsPageSkeleton;
