// components/AvailabilityBadge.tsx
interface AvailabilityBadgeProps {
  days: number;
  className?: string;
}

export default function AvailabilityBadge({ days, className = "" }: AvailabilityBadgeProps) {
  return (
    <span 
      className={`
        inline-flex 
        items-center 
        px-3 
        py-1.5 
        bg-[#F0F9FF] 
        text-[#0EA5E9] 
        text-sm 
        font-medium 
        rounded-lg
        whitespace-nowrap
        ${className}
      `}
    >
      Available in {days} days
    </span>
  );
}