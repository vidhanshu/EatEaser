import { useLocation, Link } from "react-router-dom";
import { Button } from "..";
import { cn } from "@ui/lib/utils";

export const LinkTabs = ({
  tabsData,
}: {
  tabsData: { label: string; link: string }[];
}) => {
  const pathname = useLocation().pathname;
  return (
    <div className="flex gap-x-4 pt-4 border-b">
      {tabsData.map((tab) => {
        const active = pathname === tab.link;
        return (
          <Link to={tab.link} key={tab.link}>
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "rounded-none hover:bg-gray-200 dark:hover:bg-gray-800 rounded-t-sm",
                active ? "border-b-2 border-primary" : ""
              )}
            >
              {tab.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};
