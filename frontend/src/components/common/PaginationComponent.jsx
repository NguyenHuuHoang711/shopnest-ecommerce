import React, { memo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponent = ({ page, setPage, totalPages }) => {
  return (
    <div className="flex justify-center">
      <Pagination>
        <PaginationContent
          className="
         flex items-center gap-1
 
         rounded-2xl
 
         border border-black/[0.045]
 
         bg-white/[0.88]
         backdrop-blur-xl
 
         p-1.5
 
         shadow-[0_1px_2px_rgba(0,0,0,0.015),0_10px_30px_rgba(0,0,0,0.04)]
       "
        >
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(Math.max(page - 1, 1))}
              className={`
             h-9
 
             rounded-xl
 
             border-0
 
             px-4
 
             text-[11px]
             font-medium
 
             tracking-[0.04em]
 
             transition-all duration-300
 
             hover-supported:hover:bg-black/[0.04]
 
             ${
               page === 1
                 ? "pointer-events-none opacity-30"
                 : "cursor-pointer text-black/72"
             }
           `}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(Math.max(page - 2, 0), Math.min(page + 2, totalPages))
            .map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  onClick={() => setPage(p)}
                  className={`
                               cursor-pointer
     h-9
     min-w-9
 
     rounded-xl
 
     border-0
 
     px-3
 
     text-[11px]
     font-medium
 
     transition-all duration-300
 
     ${
       p === page
         ? `
           bg-black
           text-white
 
           shadow-[0_8px_20px_rgba(0,0,0,0.16)]
 
           hover-supported:hover:bg-black/90
           hover-supported:hover:text-white
           hover-supported:hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)]
         `
         : `
           text-black/65
 
           hover-supported:hover:bg-black/[0.04]
         `
     }
   `}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(Math.min(page + 1, totalPages))}
              className={`
             h-9
 
             rounded-xl
 
             border-0
 
             px-4
 
             text-[11px]
             font-medium
 
             tracking-[0.04em]
 
             transition-all duration-300
 
             hover-supported:hover:bg-black/[0.04]
 
             ${
               page === totalPages
                 ? "pointer-events-none opacity-30"
                 : "cursor-pointer text-black/72"
             }
           `}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default memo(PaginationComponent);
