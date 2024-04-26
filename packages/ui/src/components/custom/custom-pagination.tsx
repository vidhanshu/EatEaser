import React from "react";
import {
  Button,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "..";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@ui/lib/utils";

const CustomPagination = ({
  page,
  setPage,
  totalPages,
}: {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}) => {
  if (totalPages === 1) return null;

  return (
    <Pagination className="mt-8 justify-end">
      <PaginationContent>
        <Button
          size="icon-sm"
          startContent={<ChevronLeft size={16} />}
          disabled={page === 1}
          onClick={() => {
            setPage(page - 1);
          }}
        />
        {[...Array(totalPages > 5 ? 5 : totalPages)].map((_, i) => (
          <Button
            onClick={() => {
              setPage(i + 1);
            }}
            className={cn(
              i + 1 === page &&
                "bg-blue-500 hover:text-white hover:bg-blue-600 active:bg-blue-700 text-white"
            )}
            size="icon-sm"
            variant="outline"
            key={i}
          >
            {i + 1}
          </Button>
        ))}
        {totalPages > 5 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <Button
            size="icon-sm"
            startContent={<ChevronRight size={16} />}
            disabled={page === totalPages}
            onClick={() => {
              if (page < totalPages) {
                setPage(page + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
