// app/components/blog/BlogSkeleton.tsx
export default function BlogSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="relative h-[220px] w-full bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-2/3 bg-gray-200 rounded" />
        <div className="h-3 w-20 bg-gray-200 rounded mt-2" />
      </div>
    </div>
  );
}