import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SectionHeader({
  title,
  subtitle,
  showViewAll,
}: {
  title: string;
  subtitle: string;
  showViewAll: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
      <div>
        <h2 className="text-[6.5vw] sm:text-[32px] font-semibold text-[#141212] mb-2">
          {title}
        </h2>
        <p className="text-[#434141] w-full text-[3.5vw] sm:text-[16px]">{subtitle}</p>
      </div>

      {showViewAll && (
        <Link
          href="/billboards"
          className="inline-flex transition-all hover:underline underline-offset-4 items-center gap-2 text-[#0177AB] font-medium sm:text-[17.44px] text-[4vw] mt-4 md:mt-0 group"
        >
          <span>View all</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  )
}
