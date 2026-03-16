import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    page: number;
    onPageChange: (page: number) => void;
    hasMore: boolean;
    hasPrev: boolean;
}

export function Pagination({ page, onPageChange, hasMore, hasPrev }: PaginationProps) {
    return (
        <nav aria-label="Pagination"
             className="inline-flex items-center gap-0.5 bg-white border border-neutral-200 rounded-xl p-1 shadow-sm"
        >
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={!hasPrev}
                aria-label="Previous page"
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={14} /> Prev
            </button>

            <div className="w-px h-4 bg-neutral-200 mx-1" />

            <span className="min-w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-900 text-white text-xs font-semibold font-mono">
                {page}
            </span>

            <div className="w-px h-4 bg-neutral-200 mx-1" />

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={!hasMore}
                aria-label="Next page"
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
                Next <ChevronRight size={14} />
            </button>
        </nav>
    );
}