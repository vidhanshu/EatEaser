import { Button, Switch, TimeHMPicker } from "@ui/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from "@ui/components";
import { useEffect, useState } from "react";
import useRestaurant from "@src/restaurant/hooks/use-restaurant";
import {
  getDateFromTimeString,
  getTimeFromDate,
} from "@src/common/utils/helpers";
import { Loader2, Save } from "lucide-react";

const defaultValue = [
  {
    day: "Mo",
    opening: undefined,
    closing: undefined,
    isOpen: true,
  },
  {
    day: "Tu",
    opening: undefined,
    closing: undefined,
    isOpen: true,
  },
  {
    day: "We",
    opening: undefined,
    closing: undefined,
    isOpen: true,
  },
  {
    day: "Th",
    opening: undefined,
    closing: undefined,
    isOpen: true,
  },
  {
    day: "Fr",
    opening: undefined,
    closing: undefined,
    isOpen: true,
  },
  {
    day: "Sa",
    opening: undefined,
    closing: undefined,
    isOpen: true,
  },
  {
    day: "Su",
    opening: undefined,
    closing: undefined,
    isOpen: true,
  },
];
const RestaurantEditOHPage = () => {
  const { data, isFetching, updateRestaurant, isUpading } = useRestaurant();
  const [openingHours, setOpeningHours] = useState<
    {
      day: string;
      opening?: Date;
      closing?: Date;
      isOpen: boolean;
    }[]
  >(defaultValue);

  useEffect(() => {
    if (data) {
      const newOpeningHours = data.openingHours.map((oh) => {
        const day = oh.day;
        const opening = getDateFromTimeString(oh.opening);
        const closing = getDateFromTimeString(oh.closing);
        return { day, opening, closing, isOpen: true };
      });
      // add remaining days with isOpen false
      const remainingDays = defaultValue
        .filter((d) => !newOpeningHours.some((oh) => oh.day === d.day))
        .map((d) => ({ ...d, isOpen: false }));
      setOpeningHours([...newOpeningHours, ...remainingDays]);
    }
  }, [data]);

  if (isFetching) return <Loader2 size={25} className="animate-spin" />;

  const handleUpdate = async () => {
    const newOH = openingHours
      .filter((oh) => oh.isOpen)
      .map((oh) => ({
        day: oh.day,
        opening: oh.opening ? getTimeFromDate(oh.opening) : "00:00",
        closing: oh.closing ? getTimeFromDate(oh.closing) : "00:00",
      }));
    await updateRestaurant({ openingHours: newOH });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Typography className="mb-4" variant="h4">
          Opening Hours
        </Typography>
        <Button
          loading={isUpading}
          onClick={handleUpdate}
          size="sm"
          startContent={<Save size={16} />}
        >
          Save
        </Button>
      </div>
      <Table className="border rounded-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="border">Day</TableHead>
            <TableHead className="border">Opening</TableHead>
            <TableHead className="border">Closing</TableHead>
            <TableHead className="border">Is Open on this day?</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {openingHours.map(({ closing, day, opening, isOpen }) => (
            <TableRow key={day}>
              <TableCell className="border font-medium">{day}</TableCell>
              <TableCell className="border">
                {isOpen ? (
                  <TimeHMPicker
                    date={opening}
                    setDate={(date) =>
                      setOpeningHours((prev) =>
                        prev.map((d) =>
                          d.day === day ? { ...d, opening: date } : d
                        )
                      )
                    }
                  />
                ) : (
                  "NA"
                )}
              </TableCell>
              <TableCell className="border">
                {isOpen ? (
                  <TimeHMPicker
                    date={closing}
                    setDate={(date) =>
                      setOpeningHours((prev) =>
                        prev.map((d) =>
                          d.day === day ? { ...d, closing: date } : d
                        )
                      )
                    }
                  />
                ) : (
                  "NA"
                )}
              </TableCell>
              <TableCell className="border">
                <Switch
                  checked={isOpen}
                  onCheckedChange={(checked) => {
                    setOpeningHours((prev) =>
                      prev.map((d) =>
                        d.day === day ? { ...d, isOpen: checked } : d
                      )
                    );
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RestaurantEditOHPage;
