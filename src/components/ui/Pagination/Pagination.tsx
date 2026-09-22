import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPages = () => {
    const pages: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, -1, totalPages];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        -1,
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, -1, page - 1, page, page + 1, -1, totalPages];
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] transition hover:bg-gray-50 disabled:opacity-40"
      >
        <ChevronRight size={18} />
      </button>

      {getPages().map((item, index) =>
        item === -1 ? (
          <span key={index} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`h-10 min-w-10 rounded-xl px-3 text-sm transition ${
              item === page
                ? 'bg-[var(--color-primary)] text-white'
                : 'border border-[var(--color-border)] hover:bg-gray-50'
            }`}
          >
            {item.toLocaleString('fa-IR')}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] transition hover:bg-gray-50 disabled:opacity-40"
      >
        <ChevronLeft size={18} />
      </button>
    </div>
  );
}
