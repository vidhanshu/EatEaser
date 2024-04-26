import { Skeleton } from "@ui/components";

export const KeyValSkeleton = ({ length = 5 }: { length?: number }) => {
  return (
    <div className="flex flex-col gap-4 justify-start">
      {Array.from({ length }).map((_, index) => (
        <div className="flex items-center gap-x-4" key={index}>
          <Skeleton className="w-16 h-8 rounded-md bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="w-40 h-8 rounded-md bg-gray-200 dark:bg-gray-800" />
        </div>
      ))}
    </div>
  );
};

export default KeyValSkeleton;
