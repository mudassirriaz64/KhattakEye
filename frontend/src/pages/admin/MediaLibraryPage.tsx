import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, FileText, Upload, Trash2, Search, FolderOpen } from "lucide-react";
import { cmsMediaItems, type CmsMediaItem } from "@/lib/admin-data";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

export function AdminMediaLibraryPage() {
  const [media, setMedia] = useState(cmsMediaItems);
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const folders = ["All", ...new Set(media.map((m) => m.folder))];

  const filtered = media.filter((m) => {
    const matchFolder = activeFolder === "All" || m.folder === activeFolder;
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
    return matchFolder && matchSearch;
  });

  const removeMedia = () => {
    if (deleteId) { setMedia((prev) => prev.filter((m) => m.id !== deleteId)); setDeleteId(null); }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Media Library</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{media.length} files</p>
        </div>
        <Button variant="primary" iconLeft={<Upload className="h-4 w-4" />} className="text-xs">Upload Files</Button>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex flex-col gap-4 border-b border-[color:var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {folders.map((folder) => (
              <button key={folder} type="button" onClick={() => setActiveFolder(folder)} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", activeFolder === folder ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]")}>
                <FolderOpen className="h-3 w-3" /> {folder} {folder !== "All" && `(${media.filter((m) => m.folder === folder).length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.03 }} className="group relative rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] overflow-hidden">
                <div className="flex aspect-square items-center justify-center bg-[color:var(--color-surface-muted)]">
                  {item.type === "image" ? (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[color:var(--color-surface-muted)] to-[color:var(--color-panel)]">
                      <Image className="h-8 w-8 text-[color:var(--color-text-tertiary)]" />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-surface-muted)]">
                      <FileText className="h-8 w-8 text-[color:var(--color-text-tertiary)]" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"><Image className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setDeleteId(item.id)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm hover:bg-red-500/50"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="p-2.5">
                  <p className="truncate text-[10px] font-medium text-[color:var(--color-text-primary)]">{item.name}</p>
                  <p className="text-[9px] text-[color:var(--color-text-tertiary)]">{item.size} · {item.uploadedAt}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center">
            <Image className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
            <p className="mt-3 text-sm font-medium text-[color:var(--color-text-primary)]">No files found</p>
            <p className="text-xs text-[color:var(--color-text-secondary)]">Upload files or adjust your filters.</p>
          </div>
        )}
      </div>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeMedia} title="Delete File" message="Are you sure you want to delete this file?" />
    </div>
  );
}
