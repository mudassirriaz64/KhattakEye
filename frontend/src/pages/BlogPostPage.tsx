import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Eye, ArrowLeft, Share2, Copy, Check } from "lucide-react";
import type { BlogPost } from "@/lib/api/blog";
import { getBlogBySlug, getBlogs } from "@/lib/api/blog";
import { useToastStore } from "@/lib/stores/toast-store";

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) {
      navigate("/blog");
      return;
    }

    const loadBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlogBySlug(slug);
        setBlog(data);

        // Load related blogs based on tags
        if (data.tags && data.tags.length > 0) {
          const related = await getBlogs(1, 3, data.tags[0]);
          setRelatedBlogs(related.blogs.filter((b: BlogPost) => b.slug !== slug).slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load blog:", error);
        addToast({
          title: "Error",
          description: "Blog post not found",
          type: "error",
        });
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug, navigate, addToast]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      title: "Copied!",
      description: "Blog link copied to clipboard",
      type: "success",
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = blog?.title || "Check out this blog post";

    const urls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--color-surface)] py-12">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-[color:var(--color-panel)] rounded-lg" />
            <div className="h-96 bg-[color:var(--color-panel)] rounded-3xl" />
            <div className="space-y-4">
              <div className="h-10 bg-[color:var(--color-panel)] rounded-lg w-3/4" />
              <div className="h-6 bg-[color:var(--color-panel)] rounded-lg w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const readingTime = Math.ceil(blog.content.split(" ").length / 200);

  return (
    <div className="min-h-screen bg-[color:var(--color-surface)]">
      {/* Header Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl px-4 py-6 md:px-8"
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-accent-teal)] hover:gap-3 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Blog</span>
        </Link>
      </motion.div>

      <div className="mx-auto max-w-4xl px-4 md:px-8 py-6">
        {/* Hero Image */}
        {blog.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative h-96 md:h-[500px] overflow-hidden rounded-3xl mb-10 border border-[color:var(--color-border)] shadow-lg"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>
        )}

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          {/* Category Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-[color:var(--color-accent-teal)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--color-accent-teal)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display text-4xl md:text-5xl font-bold text-[color:var(--color-text-primary)] mb-6">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[color:var(--color-text-secondary)] pb-6 border-b border-[color:var(--color-border)]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[color:var(--color-accent-teal)]" />
              <span>
                {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[color:var(--color-accent-teal)]" />
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[color:var(--color-accent-teal)]" />
              <span>{blog.views} views</span>
            </div>
            {blog.author && (
              <div className="flex items-center gap-2 ml-auto">
                <span>By</span>
                <span className="font-semibold text-[color:var(--color-text-primary)]">{blog.author}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-none mb-12"
        >
          <div
            className="text-lg leading-relaxed text-[color:var(--color-text-secondary)]"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 mb-12"
        >
          <h3 className="font-semibold text-[color:var(--color-text-primary)] mb-4">Share this article</h3>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleShare("twitter")}
              className="px-4 py-2 rounded-lg bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-accent-teal)] hover:text-white transition-all text-sm font-semibold"
            >
              Share on Twitter
            </button>
            <button
              onClick={() => handleShare("facebook")}
              className="px-4 py-2 rounded-lg bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-accent-teal)] hover:text-white transition-all text-sm font-semibold"
            >
              Share on Facebook
            </button>
            <button
              onClick={() => handleShare("linkedin")}
              className="px-4 py-2 rounded-lg bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-accent-teal)] hover:text-white transition-all text-sm font-semibold"
            >
              Share on LinkedIn
            </button>
            <button
              onClick={() => handleShare("whatsapp")}
              className="px-4 py-2 rounded-lg bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-accent-teal)] hover:text-white transition-all text-sm font-semibold"
            >
              Share on WhatsApp
            </button>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-lg bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-accent-teal)] hover:text-white transition-all text-sm font-semibold flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[color:var(--color-text-primary)] mb-8">
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((relatedBlog, i) => (
                <Link
                  key={relatedBlog._id}
                  to={`/blog/${relatedBlog.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {relatedBlog.image && (
                    <div className="relative h-40 overflow-hidden bg-[color:var(--color-surface-muted)]">
                      <img
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="font-display text-base font-bold text-[color:var(--color-text-primary)] mb-2 group-hover:text-[color:var(--color-accent-teal)] transition-colors line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-xs text-[color:var(--color-text-secondary)] mb-3 flex-1 line-clamp-2">
                      {relatedBlog.excerpt}
                    </p>
                    <div className="text-xs text-[color:var(--color-text-tertiary)]">
                      {new Date(relatedBlog.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
