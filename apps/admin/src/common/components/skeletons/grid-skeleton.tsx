import { Skeleton } from "@ui/components";

export const GridSkeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-48 rounded-md bg-gray-200 dark:bg-gray-800"
        />
      ))}
    </div>
  );
};

export default GridSkeleton;
