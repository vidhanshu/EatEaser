import { cn } from "@ui/lib/utils";
import { Typography } from "./typography";

export const LimitedNameViewer = ({
  names,
  limit = 1,
  moreTextClassName,
}: {
  names: string[];
  limit?: number;
  moreTextClassName?: string;
}) => {
  return (
    <>
      <Typography
        as="h1"
        variant="md"
        className="flex gap-x-2 items-center max-w-full whitespace-nowrap truncate"
      >
        {names.slice(0, limit).join(", ")}{" "}
        <Typography
          variant="muted"
          className={cn("text-xs font-normal", moreTextClassName)}
          title={names.slice(limit).join(", ")}
        >
          {names.length > limit ? ` +${names.length - limit} more` : ""}
        </Typography>
      </Typography>
    </>
  );
};
