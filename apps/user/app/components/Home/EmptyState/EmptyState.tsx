// app/components/EmptyState.tsx
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onRefresh?: () => void;
  showRefresh?: boolean;
}

export default function EmptyState({
  title,
  description,
  icon,
  onRefresh,
  showRefresh = true,
}: EmptyStateProps) {
  return (
    <div className="text-center px-7 py-16 bg-linear-to-b from-gray-50/50 to-transparent rounded-2xl">
      <div className="w-16 h-16 mx-auto mb-5 bg-[#0177AB]/10 rounded-2xl flex items-center justify-center">
        {icon || (
          <svg
            className="w-8 h-8 text-[#0177AB]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        )}
      </div>
      <h3 className="sm:text-lg text-[4.5vw] font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-400 sm:text-sm text-[3vw] mb-6">{description}</p>
      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-2 sm:text-sm text-[3vw] text-[#0177AB] font-medium hover:text-[#006d91] transition-colors group"
      >
        <svg
          className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh
      </button>
    </div>
  );
}
