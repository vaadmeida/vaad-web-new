// app/blog/page.tsx
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/Home/Footer";
import SimilarMedia from "../components/SimilarMedia";
import BlogContent from "../components/blog/BlogContent";

export const metadata = {
  title: "Blog | VAAD Media",
  description: "Latest insights on billboard advertising in Lagos.",
};

export default function BlogPage() {
  return (
    <>
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
              <h1 className="text-3xl md:text-[68.36px] font-bold mb-4">
                Blog
              </h1>
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

        {/* Main Content */}
        <BlogContent />
      </div>

      <SimilarMedia />
      <Footer />
    </>
  );
}