import { Blog } from "@/app/data/blogData";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg overflow-hidden shadow-sm"
    >
      <div className="relative h-[220px] w-full">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          <span>{blog.category}</span>
          <span>•</span>
          <span>{blog.date}</span>
        </div>

        <h3 className="text-[15px] font-semibold text-gray-800 mb-2 leading-snug">
          {blog.title}
        </h3>

        <p className="text-sm text-gray-500 mb-4">{blog.excerpt}</p>

        <Link
          href={`/blog/${blog.slug}`}
          className="text-[#0088b5] text-sm font-medium hover:underline"
        >
          Read More →
        </Link>
      </div>
    </motion.div>
  );
}
