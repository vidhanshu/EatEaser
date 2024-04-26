import { Package2 } from "lucide-react";
import { NSRestaurant } from "@src/types/restaurant.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from "@ui/components";
import OpeningHourseTableSkeleton from "../skeletons/opening-hours-skeleton";

export const OpeningHourseTable = ({
  day,
  isFetching,
}: {
  day?: NSRestaurant.IResturant["openingHours"];
  isFetching?: boolean;
}) => {
  if (isFetching) return <OpeningHourseTableSkeleton />;

  if (!day || day.length === 0)
    return (
      <div className="flex flex-col gap-4 items-center">
        <Package2 size={30} className="text-muted-foreground" />
        <Typography className="text-muted-foreground" variant="h4">
          Please add Opening Hours
        </Typography>
      </div>
    );

  return (
    <div>
      <Typography className="mb-4" variant="h4">
        Opening Hours
      </Typography>
      <Table className="border rounded-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="border">Day</TableHead>
            <TableHead className="border">Opening</TableHead>
            <TableHead className="border">Closing</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {day.map(({ closing, day, opening }) => (
            <TableRow key={day}>
              <TableCell className="border font-medium">{day}</TableCell>
              <TableCell className="border">{opening}</TableCell>
              <TableCell className="border">{closing}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OpeningHourseTable;
