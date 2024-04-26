import { cn } from "@ui/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

export interface TypographyProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof typographyVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}
const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      default: "leading-7",
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      large: "text-xl font-bold",
      md: "text-md font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const Typography = ({
  as = "p",
  variant,
  className,
  ...props
}: TypographyProps) => {
  const Comp = as;
  return (
    <Comp
      className={cn(typographyVariants({ className, variant }))}
      {...props}
    />
  );
};
