"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

export function TablePagination({ totalPages }: { totalPages: number }) {

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return (`${pathname}?${params.toString()}`)
  };

  const currentPage = Number(searchParams.get("page")) || 1;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={createPageUrl(Math.max(1, currentPage - 1))} />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => {

          const page = i + 1;

          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                href={createPageUrl(page)}
              >{page}</PaginationLink>
            </PaginationItem>
          )
        })}

        
        <PaginationItem>
          <PaginationNext href={createPageUrl(Math.min(totalPages, currentPage + 1))} />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  )
}