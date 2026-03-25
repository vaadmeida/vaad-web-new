"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import { blogs } from "@/app/data/blogData";
import BlogCard from "./BlogCard";
import BlogSkeleton from "./BlogSkeleton";

export default function BlogContent() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section className="py-16 bg-[#f5f7fa]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Blog Grid */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid sm:grid-cols-2 gap-6">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <BlogSkeleton key={i} />
                    ))
                  : blogs.map((blog) => (
                      <BlogCard key={blog.slug} blog={blog} />
                    ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-10 gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    className="w-8 h-8 rounded-full border text-sm hover:bg-[#0088b5] hover:text-white"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}