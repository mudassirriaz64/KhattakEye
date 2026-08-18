import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Edit3, Trash2, X, AlertCircle, Eye, Calendar, Tag as TagIcon, Image as ImageIcon } from "lucide-react";
import type { BlogPost } from "@/lib/api/blog";
import { adminGetBlogsApi, adminGetBlogByIdApi, adminCreateBlogApi, adminUpdateBlogApi, adminDeleteBlogApi } from "@/lib/api/admin";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import { useToastStore } from "@/lib/stores/toast-store";

interface BlogForm {
  title: string;
  excerpt: string;
  content: string;
  tags: string;
  author: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  image?: File;
  imagePreview?: string;
}

export function AdminBlogPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BlogForm>({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    author: "Khattak Eyewear",
    status: "draft",
    featured: false,
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await adminGetBlogsApi(1, 100);
      if (data.blogs) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Failed to load blogs:", error);
      addToast({
        title: "Error",
        description: "Failed to load blogs",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filtered = blogs.filter((b) => {
    const matchesSearch = !search || b.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setForm({
      title: "",
      excerpt: "",
      content: "",
      tags: "",
      author: "Khattak Eyewear",
      status: "draft",
      featured: false,
    });
    setFormError(null);
  };

  const openEdit = async (blog: BlogPost) => {
    try {
      const data = await adminGetBlogByIdApi(blog._id);
      setForm({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        tags: data.tags?.join(", ") || "",
        author: data.author,
        status: data.status,
        featured: data.featured,
        imagePreview: data.image,
      });
      setEditing(data);
      setFormError(null);
      setShowForm(true);
    } catch (error) {
      console.error("Failed to load blog:", error);
      addToast({
        title: "Error",
        description: "Failed to load blog",
        type: "error",
      });
    }
  };

  const saveBlog = async () => {
    if (!form.title.trim()) {
      const msg = "Please enter blog title";
      setFormError(msg);
      addToast({ title: "Missing Required Field", description: msg, type: "error" });
      return;
    }

    if (!form.content.trim()) {
      const msg = "Please enter blog content";
      setFormError(msg);
      addToast({ title: "Missing Required Field", description: msg, type: "error" });
      return;
    }

    setFormError(null);
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content);
      formData.append("tags", form.tags);
      formData.append("author", form.author);
      formData.append("status", form.status);
      formData.append("featured", String(form.featured));

      if (form.image) {
        formData.append("image", form.image);
      }

      if (editing) {
        await adminUpdateBlogApi(editing._id, formData);
        addToast({
          title: "Success",
          description: "Blog updated successfully",
          type: "success",
        });
      } else {
        await adminCreateBlogApi(formData);
        addToast({
          title: "Success",
          description: "Blog created successfully",
          type: "success",
        });
      }

      await loadBlogs();
      setShowForm(false);
      setEditing(null);
      resetForm();
    } catch (error) {
      console.error("Failed to save blog:", error);
      addToast({
        title: "Error",
        description: "Failed to save blog",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const removeBlog = async () => {
    if (deleteId) {
      const idToDelete = deleteId;
      setSaving(true);
      try {
        await adminDeleteBlogApi(idToDelete);
        setBlogs((prev) => prev.filter((b) => b._id !== deleteId));
        setDeleteId(null);
        addToast({
          title: "Success",
          description: "Blog deleted successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Failed to delete blog:", error);
        addToast({
          title: "Error",
          description: "Failed to delete blog",
          type: "error",
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((p) => ({ ...p, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((p) => ({ ...p, imagePreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Blog Posts</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{blogs.length} blog posts</p>
        </div>
        <Button
          variant="primary"
          iconLeft={<Plus className="h-4 w-4" />}
          onClick={() => {
            resetForm();
            setEditing(null);
            setShowForm(true);
          }}
          className="text-xs"
        >
          Add Blog
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 overflow-hidden">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{editing ? "Edit Blog Post" : "New Blog Post"}</h3>
              <button type="button" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Blog Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Enter blog title"
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                    placeholder="Blog author"
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Excerpt (Brief Summary)</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value.slice(0, 500) }))}
                  placeholder="Short description for blog card (max 500 chars)"
                  maxLength={500}
                  rows={2}
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm resize-none"
                />
                <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">{form.excerpt.length}/500</p>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Content *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Full blog content (HTML supported)"
                  rows={8}
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm resize-none"
                />
                <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">{form.content.length} characters</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                    placeholder="e.g., eyewear, fashion, tips"
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))}
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
                <label className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.12em]">Featured Image</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="block w-full text-sm"
                    />
                    <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">JPG, PNG, WebP (recommended: 1200x600px)</p>
                  </div>
                  {form.imagePreview && (
                    <div className="flex-shrink-0">
                      <img
                        src={form.imagePreview}
                        alt="Preview"
                        className="h-20 w-32 rounded-lg object-cover border border-[color:var(--color-border)]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                    className="h-4 w-4 rounded"
                  />
                  <span className="text-xs">Featured Post</span>
                </label>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button variant="primary" onClick={saveBlog} disabled={saving} className="text-xs">
                {saving ? "Saving..." : editing ? "Update Blog" : "Create Blog"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setFormError(null);
                }}
                className="text-xs"
              >
                Cancel
              </Button>
              {formError && (
                <div className="flex items-center gap-1.5 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/40 dark:border-red-800 px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 shadow-sm animate-pulse">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{formError}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 h-24" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((blog, i) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5"
              >
                <div className="flex gap-4">
                  {blog.image && (
                    <div className="flex-shrink-0">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-24 w-40 rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-display text-lg text-[color:var(--color-text-primary)] line-clamp-1">{blog.title}</h3>
                        <p className="mt-1 text-xs text-[color:var(--color-text-secondary)] line-clamp-2">{blog.excerpt}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => openEdit(blog)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-teal)]"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(blog._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[color:var(--color-text-tertiary)]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {blog.views} views
                      </div>
                      <StatusBadge status={blog.status} />
                      {blog.featured && <StatusBadge status="featured" />}
                      {blog.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <TagIcon className="h-3.5 w-3.5" />
                          {blog.tags.length} tags
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="py-16 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-[color:var(--color-text-tertiary)]" />
          <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">No blog posts found</p>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={removeBlog}
        title="Delete Blog Post"
        message="This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
