// app/blog/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { blogService, Blog, BlogComment } from "@/app/lib/blog/blog-service";
import MarkdownRenderer from "@/app/components/blog/MarkdownRenderer";
import Sidebar from "@/app/components/blog/Sidebar";
import { useToast } from "@/app/contexts/toast-context";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });

  // Helper functions
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

  const getImageUrl = (image?: string): string => {
    if (image && image.trim()) return image;
    return "https://images.unsplash.com/photo-1612332883331-e8ea07a15f14?q=80&w=774&auto=format&fit=crop";
  };

  const getHeadline = (blog: Blog): string => {
    return blog.headline || blog.title || "Untitled Post";
  };

  const getCategory = (blog: Blog): string => {
    return blog.category || "Blog";
  };

  const getReadTime = (blog: Blog): number => {
    // Calculate read time based on content length (approx 200 words per minute)
    const content = blog.body || blog.content || "";
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Try to fetch by slug first, if that fails, try by ID
        let blogData: Blog | null = null;
        try {
          blogData = await blogService.getBlogBySlug(slug);
        } catch (slugError) {
          console.log("Fetch by slug failed, trying by ID...");
          blogData = await blogService.getBlogById(slug);
        }

        if (!blogData) {
          router.push("/not-found");
          return;
        }

        const commentsData = await blogService.getComments(blogData._id);
        setBlog(blogData);
        setComments(commentsData);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        router.push("/not-found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.comment) {
      showToast?.({
        type: "error",
        message: "Please fill in all fields",
        duration: 3000,
      });
      return;
    }

    if (!blog) return;

    setSubmitting(true);
    try {
      const newComment = await blogService.addComment(blog._id, formData);
      setComments([newComment, ...comments]);
      setFormData({ name: "", email: "", comment: "" });
      showToast?.({
        type: "success",
        message: "Comment added successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to add comment:", error);
      showToast?.({
        type: "error",
        message: "Failed to add comment",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f5f7fa] py-16">
        <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm animate-pulse h-24" />
              <div className="bg-white p-4 rounded-lg shadow-sm animate-pulse h-48" />
              <div className="bg-white p-4 rounded-lg shadow-sm animate-pulse h-64" />
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="h-[350px] bg-gray-200 rounded-md mb-6" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const readTime = getReadTime(blog);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0088b5] to-[#006d91] text-white pt-24 pb-16">
        {/* Background GIF */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/video/vaad-bg.gif"
            alt="VAAD Media Billboard"
            fill
            priority
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <h1 className="text-3xl md:text-[68.36px] font-bold mb-4">Blog</h1>
            <p className="text-lg md:text-[15.19px] font-semibold text-white mb-8 max-w-100 text-center">
              Lekki’s evolving skyline isn’t just about architecture — it’s a
              hotspot for outdoor advertising. In 2025, brands are turning to
              premium billboard placements.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-white/80">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>&gt;</span>
              <span className="text-white">Blog</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto p-16 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3"
        >
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="relative w-full h-[350px] mb-6">
              <Image
                src={getImageUrl(blog.image)}
                alt={getHeadline(blog)}
                fill
                className="object-cover rounded-md"
                unoptimized
              />
            </div>

            <div className="text-sm text-gray-500 mb-2 flex items-center gap-3">
              <span>{getCategory(blog)}</span>
              <span>•</span>
              <span>{formatDate(blog.createdAt || blog.date)}</span>
              <span>•</span>
              <span>{readTime} min read</span>
            </div>

            <h1 className="text-2xl font-bold mb-4">{getHeadline(blog)}</h1>

            {/* Render content - use body from API */}
            <MarkdownRenderer content={blog.body || blog.content || ""} />
          </div>

          {/* Comments */}
          <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
            <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold">
                      {comment.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{comment.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                      <p className="text-sm mt-1">{comment.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Leave Comment */}
          <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
            <h3 className="font-semibold mb-4">Leave a comment</h3>

            <form onSubmit={handleSubmitComment} className="space-y-4">
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0088b5]"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0088b5]"
                required
              />
              <textarea
                name="comment"
                placeholder="Comment"
                value={formData.comment}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-md text-sm h-28 focus:outline-none focus:ring-2 focus:ring-[#0088b5]"
                required
              />

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#0088b5] text-white px-6 py-2 rounded-md text-sm hover:bg-[#006d91] transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
