import React from 'react'

export default function BlogSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="h-[220px] bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 w-1/3 rounded" />
        <div className="h-4 bg-gray-200 w-3/4 rounded" />
        <div className="h-3 bg-gray-200 w-full rounded" />
        <div className="h-3 bg-gray-200 w-2/3 rounded" />
      </div>
    </div>
  );
}
