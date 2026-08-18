import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Eye, ArrowRight, Search, X } from "lucide-react";
import type { BlogPost } from "@/lib/api/blog";
import { getBlogs } from "@/lib/api/blog";

export function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    loadBlogs(1);
  }, [selectedTag]);

  const loadBlogs = async (pageNum: number) => {
    try {
      setLoading(true);
      const data = await getBlogs(pageNum, 12, selectedTag || undefined);
      setBlogs(data.blogs);
      setTotalPages(data.pages);
      setPage(pageNum);

      // Extract unique tags
      const tags = new Set<string>();
      data.blogs.forEach((blog) => {
        blog.tags.forEach((tag) => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());
    } catch (error) {
      console.error("Failed to load blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  const featuredBlog = blogs.find((b) => b.featured) || blogs[0];

  return (
    <div className="min-h-screen bg-[color:var(--color-surface)]">
      {/* Hero Section */}
      <div className="mx-auto max-w-[1440px] px-4 py-12 md:py-20 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 rounded-full bg-[color:var(--color-accent-teal)]/10 border border-[color:var(--color-accent-teal)]/30 px-4 py-2">
            <BookOpen className="h-4 w-4 text-[color:var(--color-accent-teal)]" />
            <span className="text-xs font-semibold text-[color:var(--color-accent-teal)]">Blog & Insights</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[color:var(--color-text-primary)] mb-4">
            Eyewear Insights & Tips
          </h1>
          <p className="text-lg text-[color:var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
            Discover expert tips on eyecare, eyewear trends, and how to choose the perfect glasses for your lifestyle
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[color:var(--color-text-tertiary)]" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent-teal)]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Featured Blog Post */}
        {featuredBlog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <Link
              to={`/blog/${featuredBlog.slug}`}
              className="group relative block overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
                {featuredBlog.image && (
                  <div className="relative h-64 md:h-80 overflow-hidden rounded-2xl">
                    <img
                      src={featuredBlog.image}
                      alt={featuredBlog.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 mb-4 w-fit rounded-full bg-[color:var(--color-accent-teal)]/10 border border-[color:var(--color-accent-teal)]/30 px-3 py-1">
                    <span className="text-xs font-semibold text-[color:var(--color-accent-teal)]">Featured</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-[color:var(--color-text-primary)] mb-4 group-hover:text-[color:var(--color-accent-teal)] transition-colors">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-[color:var(--color-text-secondary)] mb-6 line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 mb-6 text-xs text-[color:var(--color-text-tertiary)]">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredBlog.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      {featuredBlog.views} views
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[color:var(--color-accent-teal)] font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <p className="text-sm font-semibold text-[color:var(--color-text-secondary)] mb-4">Filter by tags:</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedTag === null
                    ? "bg-[color:var(--color-accent-teal)] text-white"
                    : "bg-[color:var(--color-panel)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]"
                }`}
              >
                All Articles
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedTag === tag
                      ? "bg-[color:var(--color-accent-teal)] text-white"
                      : "bg-[color:var(--color-panel)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] overflow-hidden h-96" />
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog, i) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="group flex flex-col h-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {blog.image && (
                      <div className="relative h-48 overflow-hidden bg-[color:var(--color-surface-muted)]">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 p-5">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-[color:var(--color-accent-teal)]/10 px-2.5 py-1 text-[10px] font-semibold text-[color:var(--color-accent-teal)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-display text-lg font-bold text-[color:var(--color-text-primary)] mb-2 group-hover:text-[color:var(--color-accent-teal)] transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-[color:var(--color-text-secondary)] mb-4 flex-1 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-[color:var(--color-text-tertiary)] border-t border-[color:var(--color-border)] pt-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {blog.views}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {page > 1 && (
                  <button
                    onClick={() => loadBlogs(page - 1)}
                    className="px-4 py-2 rounded-lg border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-panel)]"
                  >
                    Previous
                  </button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => loadBlogs(p)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      p === page
                        ? "bg-[color:var(--color-accent-teal)] text-white"
                        : "border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-panel)]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                {page < totalPages && (
                  <button
                    onClick={() => loadBlogs(page + 1)}
                    className="px-4 py-2 rounded-lg border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-panel)]"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-[color:var(--color-text-tertiary)]" />
            <p className="mt-4 text-lg text-[color:var(--color-text-secondary)]">No blog posts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
