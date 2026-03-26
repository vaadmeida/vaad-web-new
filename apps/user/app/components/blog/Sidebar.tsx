/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/blog/Sidebar.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBlogAssets } from "@/app/hooks/useBlogAssets";
import { useBlogs } from "@/app/hooks/useBlogs";
import { useRouter } from "next/navigation";

interface SidebarProps {
  onFilter?: (keyword?: string, category?: string, tag?: string) => void;
}

export default function Sidebar({ onFilter }: SidebarProps) {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { assets, loading: assetsLoading } = useBlogAssets();
  const { blogs, loading: blogsLoading } = useBlogs({ limit: 3 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      onFilter?.(searchKeyword, undefined, undefined);
      router.push(`/blog?search=${encodeURIComponent(searchKeyword)}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedTag(null);
    onFilter?.(undefined, category, undefined);
    router.push(`/blog?category=${encodeURIComponent(category)}`);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setSelectedCategory(null);
    onFilter?.(undefined, undefined, tag);
    router.push(`/blog?tag=${encodeURIComponent(tag)}`);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setSearchKeyword("");
    onFilter?.();
    router.push("/blog");
  };

  const getPostCount = (category: string) => {
    return blogs.filter((blog) => blog.category === category).length;
  };

  // Format date from createdAt with proper null handling
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  // Get image URL with fallback
  const getImageUrl = (image?: string): string => {
    if (image && image.trim()) return image;
    return "https://images.unsplash.com/photo-1612332883331-e8ea07a15f14?q=80&w=774&auto=format&fit=crop";
  };

  // Get headline with fallback
  const getHeadline = (blog: any): string => {
    return blog.headline || blog.title || "Untitled Post";
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Type to search..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0088b5]"
          />
        </form>
      </div>

      {/* Categories */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-semibold text-sm mb-3">Blog Categories</h4>
        {assetsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-5 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2 text-sm text-gray-600">
            {assets?.categories?.map((category) => (
              <li key={category}>
                <button
                  onClick={() => handleCategoryClick(category)}
                  className={`hover:text-[#0088b5] transition-colors ${
                    selectedCategory === category
                      ? "text-[#0088b5] font-medium"
                      : ""
                  }`}
                >
                  {category} ({getPostCount(category)})
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent Posts */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-semibold text-sm mb-3">Recent Posts</h4>
        {blogsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-14 h-14 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-2 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="flex gap-3 mb-3 group">
              <div className="relative w-14 h-14 flex-shrink-0 rounded overflow-hidden">
                <Image
                  src={getImageUrl(blog.image)}
                  alt={getHeadline(blog)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/blog/${blog._id}`}
                  className="font-medium text-gray-700 hover:text-[#0088b5] transition-colors line-clamp-2 text-xs block"
                >
                  {getHeadline(blog)}
                </Link>
                <span className="text-gray-400 text-xs block mt-1">
                  {formatDate(blog.createdAt || blog.date)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tags */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-semibold text-sm mb-3">Tags</h4>
        {assetsLoading ? (
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-6 w-16 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {assets?.tags?.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`text-xs px-3 py-1 border rounded-md transition-colors ${
                  selectedTag === tag
                    ? "bg-[#0088b5] text-white border-[#0088b5]"
                    : "text-gray-600 hover:border-[#0088b5] hover:text-[#0088b5]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {(selectedCategory || selectedTag || searchKeyword) && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <button
            onClick={clearFilters}
            className="w-full text-center text-sm text-[#0088b5] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
