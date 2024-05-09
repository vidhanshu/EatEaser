import { Skeleton, Typography, TypographyProps } from "@ui/components";
import { getInitials } from "@ui/helpers";
import { cn } from "@ui/lib/utils";
import { useState } from "react";

export interface ImgWithPlaceholderProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholder?: string;
  placeHolderProps?: TypographyProps;
}
export const ImgWithPlaceholder = ({
  src,
  placeholder,
  className,
  placeHolderProps: {
    className: placeHolderClassName,
    ...placeholderProps
  } = {},
  ...imgProps
}: ImgWithPlaceholderProps) => {
  const [loading, setLoading] = useState(src ? true : false);

  return (
    <div className="relative">
      {src ? (
        <img
          src={src}
          className={cn(
            "w-[160px] h-[160px] object-cover rounded-md",
            className
          )}
          onLoad={setLoading.bind(null, false)}
          {...imgProps}
        />
      ) : (
        <div
          className={cn(
            "w-[160px] h-[160px] rounded-md flex items-center justify-center bg-gray-300 dark:bg-gray-900",
            className
          )}
        >
          <Typography
            variant="h1"
            className={cn("text-muted-foreground", placeHolderClassName)}
            {...placeholderProps}
          >
            {getInitials(placeholder ?? "")}
          </Typography>
        </div>
      )}
      {loading && (
        <Skeleton className={cn("absolute w-full inset-0 h-full", className)} />
      )}
    </div>
  );
};

export default ImgWithPlaceholder;
