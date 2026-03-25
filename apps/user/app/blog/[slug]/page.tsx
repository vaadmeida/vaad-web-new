import MarkdownRenderer from "@/app/components/blog/MarkdownRenderer";
import Sidebar from "@/app/components/blog/Sidebar";
import { blogs } from "@/app/data/blogData";
import { motion } from "framer-motion";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const blog = blogs.find((b) => b.slug === params.slug);

  if (!blog) return {};

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [blog.image],
    },
  };
}

export default function BlogDetail({ params }: { params: { slug: string } }) {
  const blog = blogs.find((b) => b.slug === params.slug);

  if (!blog) return <div>Not found</div>;

  return (
    <div className="bg-[#f5f7fa] py-16">
      <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="relative w-full h-[350px] mb-6">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              <div className="text-sm text-gray-500 mb-2">
                {blog.category} • {blog.date}
              </div>

              <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>

              <MarkdownRenderer content={blog.content} />
            </div>

            {/* Comments */}
            <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
              <h3 className="font-semibold mb-4">Comments</h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">John</p>
                    <p className="text-xs text-gray-500">
                      This was really helpful!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Leave Comment */}
            <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
              <h3 className="font-semibold mb-4">Leave a comment</h3>

              <form className="space-y-4">
                <input
                  placeholder="Name"
                  className="w-full border px-3 py-2 rounded-md text-sm"
                />
                <input
                  placeholder="Email"
                  className="w-full border px-3 py-2 rounded-md text-sm"
                />
                <textarea
                  placeholder="Comment"
                  className="w-full border px-3 py-2 rounded-md text-sm h-28"
                />

                <button className="bg-[#0088b5] text-white px-6 py-2 rounded-md text-sm">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
