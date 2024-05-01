import { Typography } from "@ui/components";
import { cn } from "@ui/lib/utils";
import { useState } from "react";

const SeeMoreText = ({ text, limit = 200, className, readMoreBtnClassName }: { text?: string; limit?: number; className?: string; readMoreBtnClassName?: string }) => {
  const [wrapped, setWrapped] = useState(true);
  return (
    <Typography className={cn("text-base text-muted-foreground", className)}>
      {wrapped ? (
        <>
          {text?.slice(0, limit)}{" "}
          {text?.length && text.length > limit && (
            <>
              ...
              <span onClick={() => setWrapped(false)} className={cn("text-base cursor-pointer text-primary", readMoreBtnClassName)}>
                Read more
              </span>
            </>
          )}
        </>
      ) : (
        <>
          {text}{" "}
          <span onClick={() => setWrapped(true)} className={cn("text-base cursor-pointer text-primary", readMoreBtnClassName)}>
            Read less
          </span>
        </>
      )}
    </Typography>
  );
};

export default SeeMoreText;
