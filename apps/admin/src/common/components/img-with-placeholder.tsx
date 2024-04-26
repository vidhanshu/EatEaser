import { getInitials } from "@src/restaurant/utils/helpers";
import { Typography, TypographyProps } from "@ui/components";
import { cn } from "@ui/lib/utils";

interface ImgWithPlaceholderProps
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
  return (
    <>
      {src ? (
        <img
          src={src}
          className={cn(
            "w-[160px] h-[160px] object-cover rounded-md",
            className
          )}
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
    </>
  );
};

export default ImgWithPlaceholder;
