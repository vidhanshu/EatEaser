import { Typography } from "@repo/ui";
import { useState } from "react";

const SeeMoreText = ({ text, limit = 200 }: { text: string; limit?: number }) => {
  const [wrapped, setWrapped] = useState(true);
  return (
    <Typography className="text-base text-muted-foreground">
      {wrapped ? (
        <>
          {text.slice(0, limit)}{" "}
          {text.length > limit && (
            <>
              ...
              <span onClick={() => setWrapped(false)} className="text-base text-emerald-500">
                Read more
              </span>
            </>
          )}
        </>
      ) : (
        <>
          {text}{" "}
          <span onClick={() => setWrapped(true)} className="text-base text-emerald-500">
            Read less
          </span>
        </>
      )}
    </Typography>
  );
};

export default SeeMoreText;
