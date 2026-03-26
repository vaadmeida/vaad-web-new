// app/components/blog/BlogContent.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import BlogCard from "./BlogCard";
import BlogSkeleton from "./BlogSkeleton";
import { useBlogs } from "@/app/hooks/useBlogs";

export default function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [keyword, setKeyword] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [tag, setTag] = useState(searchParams.get("tag") || "");

  const { blogs, loading, total, refetch } = useBlogs({
    keyword: keyword || undefined,
    category: category || undefined,
    tags: tag || undefined,
  });

  useEffect(() => {
    refetch();
  }, [keyword, category, tag]);

  const handleFilter = (newKeyword?: string, newCategory?: string, newTag?: string) => {
    setKeyword(newKeyword || "");
    setCategory(newCategory || "");
    setTag(newTag || "");
  };

  return (
    <section className="py-16 bg-[#f5f7fa]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar onFilter={handleFilter} />
          </div>

          {/* Blog Grid */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {loading ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <BlogSkeleton key={i} />
                  ))}
                </div>
              ) : blogs.length > 0 ? (
                <>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {blogs.map((blog) => (
                      <BlogCard key={blog._id} blog={blog} />
                    ))}
                  </div>
                  
                  {/* Show count of blogs */}
                  <div className="text-center mt-8 text-sm text-gray-500">
                    Showing {blogs.length} blog{blogs.length !== 1 ? 's' : ''}
                    {total > blogs.length && ` out of ${total}`}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-500">No blog posts found.</p>
                  <button
                    onClick={() => {
                      setKeyword("");
                      setCategory("");
                      setTag("");
                    }}
                    className="mt-4 text-[#0088b5] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}