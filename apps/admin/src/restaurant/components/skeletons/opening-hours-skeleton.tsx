import { Skeleton } from "@ui/components";

export const OpeningHourseTableSkeleton = () => {
  return (
    <div>
      <Skeleton className="bg-gray-200 dark:bg-gray-800 w-20 h-6 mb-4 rounded-sm" />
      <Skeleton className="bg-gray-200 dark:bg-gray-800 w-full h-10 mb-4 rounded-sm" />
      <Skeleton className="bg-gray-200 dark:bg-gray-800 w-full h-10 mb-4 rounded-sm" />
      <Skeleton className="bg-gray-200 dark:bg-gray-800 w-full h-10 mb-4 rounded-sm" />
      <Skeleton className="bg-gray-200 dark:bg-gray-800 w-full h-10 mb-4 rounded-sm" />
    </div>
  );
};

export default OpeningHourseTableSkeleton;
