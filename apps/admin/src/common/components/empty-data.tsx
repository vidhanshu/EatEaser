import { Link } from "react-router-dom";
import { Plus, Ratio } from "lucide-react";
import { Button, Typography } from "@ui/components";

import { PropsWithChildren } from "react";

export const EmptyData = ({
  placeholder = "No data found!",
  children,
  link,
}: {
  placeholder?: string;
  link?: string;
} & PropsWithChildren) => {
  return (
    <div className="flex items-center flex-col gap-4 justify-center">
      <Ratio className="text-muted-foreground" size={30} />
      <Typography className="text-muted-foreground" variant="h4">
        {placeholder}
      </Typography>
      {children}
      {link && (
        <Link to={link}>
          <Button startContent={<Plus size={16} />}>Add new</Button>
        </Link>
      )}
    </div>
  );
};
