import { ImgWithPlaceholder, ImgWithPlaceholderProps } from "@ui/components";
import { cn } from "@ui/lib/utils";

const CImageWithPlaceholder = ({ className, ...props }: ImgWithPlaceholderProps) => {
  return <ImgWithPlaceholder className={cn("bg-gray-200  dark:bg-[#24272F]", className)} {...props} />;
};

export default CImageWithPlaceholder;
