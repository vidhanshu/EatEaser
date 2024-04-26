import { Skeleton } from "@ui/components";

export const HeaderSkeleton = () => {
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-x-4 items-center flex-grow">
          <Skeleton className="bg-gray-200 dark:bg-gray-800 w-[160px] h-[160px]" />
          <div className="space-y-2 w-1/2">
            <Skeleton className="bg-gray-200 dark:bg-gray-800 h-6" />
            <Skeleton className="bg-gray-200 dark:bg-gray-800 h-6" />
            <Skeleton className="bg-gray-200 dark:bg-gray-800 h-6" />
            <Skeleton className="bg-gray-200 dark:bg-gray-800 h-6" />
            <Skeleton className="bg-gray-200 dark:bg-gray-800 h-6" />
          </div>
        </div>
        <Skeleton className="bg-gray-200 dark:bg-gray-800 w-[80px] h-[36px]" />
      </div>
      <Skeleton className="bg-gray-200 dark:bg-gray-800 h-8 w-full mt-4" />
    </div>
  );
};

export default HeaderSkeleton;
