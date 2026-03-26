// app/components/blog/BlogCard.tsx
import { Blog } from "@/app/lib/blog/blog-service";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  // Format date from createdAt with proper null handling
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
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
  const getHeadline = (blog: Blog): string => {
    return blog.headline || blog.title || "Untitled Post";
  };

  // Get subheadline/excerpt with fallback
  const getSubHeadline = (blog: Blog): string => {
    return blog.subHeadline || blog.excerpt || "Read more about this insightful article...";
  };

  // Get display tag with fallback
  const getDisplayTag = (blog: Blog): string => {
    return blog.tags?.[0] || blog.category || "Blog";
  };

  // Get slug from headline if not provided
  const getSlug = (blog: Blog): string => {
    return blog.slug || getHeadline(blog).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-[220px] w-full">
        <Image
          src={getImageUrl(blog.image)}
          alt={getHeadline(blog)}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          <span>{getDisplayTag(blog)}</span>
          <span>•</span>
          <span>{formatDate(blog.createdAt || blog.date)}</span>
        </div>

        <h3 className="text-[15px] font-semibold text-gray-800 mb-2 leading-snug line-clamp-2">
          {getHeadline(blog)}
        </h3>

        <p className="text-sm text-gray-500 mb-4 line-clamp-3">
          {getSubHeadline(blog)}
        </p>

        <div className="flex items-center justify-between">
          <Link
            href={`/blog/${blog._id}`}
            className="text-[#0088b5] text-sm font-medium hover:underline"
          >
            Read More →
          </Link>
          
          {/* Optional: Show view count */}
          {blog.views !== undefined && blog.views !== null && (
            <span className="text-xs text-gray-400">
              {blog.views} {blog.views === 1 ? "view" : "views"}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}