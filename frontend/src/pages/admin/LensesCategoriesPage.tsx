import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Plus, Edit3, Trash2, Search, X, FolderOpen, ArrowRight, Layers } from "lucide-react";
import { adminLensesCategories, type AdminCategory } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import { getCategoriesApi, adminCreateCategoryApi, adminDeleteCategoryApi } from "@/lib/api/admin";

export function AdminLensesCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>(adminLensesCategories);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  useEffect(() => {
    getCategoriesApi("lenses").then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const mapped: AdminCategory[] = data.map((c: any) => ({
          id: c._id || c.id,
          name: c.name,
          slug: c.slug || c.name.toLowerCase().replace(/\s+/g, "-"),
          description: c.description || "",
          productCount: c.productCount || 0,
          parent: c.parent || null,
          featured: c.featured !== undefined ? c.featured : true,
          status: c.status || "active",
          image: c.image || "",
          productKind: c.productKind || "lenses",
          type: c.type || "category",
          createdAt: c.createdAt || new Date().toISOString()
        }));
        setCategories(mapped);
      }
    }).catch(() => {});
  }, []);

  const [selectedParent, setSelectedParent] = useState<AdminCategory | null>(null);

  const [showParentForm, setShowParentForm] = useState(false);
  const [editingCat, setEditingCat] = useState<AdminCategory | null>(null);
  const [parentForm, setParentForm] = useState({
    name: "",
    slug: "",
    description: "",
    productKind: "lenses" as const,
    type: "category" as "category" | "style" | "collection",
    featured: true,
    status: "active" as "active" | "inactive"
  });
  
  const [newSubName, setNewSubName] = useState("");
  const [newSubDescription, setNewSubDescription] = useState("");

  const parentCategories = categories.filter((c) => !c.parent && (!search || c.name.toLowerCase().includes(search.toLowerCase())));
  const getSubcategories = (parentId: string) => categories.filter((c) => c.parent === parentId);

  const resetParentForm = () => {
    setParentForm({ name: "", slug: "", description: "", productKind: "lenses", type: "category", featured: true, status: "active" });
    setEditingCat(null);
  };

  const openEditParent = (cat: any) => {
    setParentForm({ name: cat.name, slug: cat.slug, description: cat.description, productKind: "lenses", type: cat.type || "category", featured: cat.featured, status: cat.status });
    setEditingCat(cat);
    setShowParentForm(true);
  };

  const saveParentCategory = async () => {
    if (editingCat) {
      setCategories((prev) => prev.map((c) => c.id === editingCat.id ? { ...c, ...parentForm } : c));
    } else {
      const newCat: AdminCategory = {
        id: `cat-lns-${Date.now()}`,
        ...parentForm,
        parent: null,
        productCount: 0,
        image: "",
        createdAt: new Date().toISOString()
      };
      setCategories((prev) => [newCat, ...prev]);
      try {
        await adminCreateCategoryApi({
          name: parentForm.name,
          description: parentForm.description,
          productKind: "lenses",
          type: parentForm.type
        });
      } catch (err) {
        console.error("Failed to create lenses category:", err);
      }
    }
    setShowParentForm(false);
    resetParentForm();
  };

  const handleAddSubcategory = () => {
    if (!selectedParent || !newSubName.trim()) return;
    const slug = newSubName.toLowerCase().replace(/\s+/g, "-");
    const newSub: AdminCategory = {
      id: `cat-sub-lns-${Date.now()}`,
      name: newSubName,
      slug,
      parent: selectedParent.id,
      description: newSubDescription || `${newSubName} under ${selectedParent.name}`,
      image: "",
      productCount: 0,
      featured: false,
      status: "active",
      createdAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    };
    setCategories((prev) => [...prev, newSub]);
    setNewSubName("");
    setNewSubDescription("");
  };

  const removeCategory = async () => {
    if (deleteId) {
      const idToDelete = deleteId;
      setCategories((prev) => prev.filter((c) => c.id !== deleteId && c.parent !== deleteId));
      if (selectedParent && selectedParent.id === deleteId) {
        setSelectedParent(null);
      }
      setDeleteId(null);
      try {
        await adminDeleteCategoryApi(idToDelete);
      } catch (err) {
        console.error("Failed to delete category:", err);
      }
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-teal-600" />
            <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Contact Lenses Categories</h1>
          </div>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">Manage main Contact Lenses categories (Shop by Type, Shop by Need) & their subcategories</p>
        </div>
        <Button variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => { resetParentForm(); setShowParentForm(true); }} className="text-xs bg-teal-600 hover:bg-teal-700 text-white">
          Add Lenses Parent Category
        </Button>
      </div>

      {showParentForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 overflow-hidden">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{editingCat ? "Edit Contact Lenses Group" : "New Contact Lenses Parent Category"}</h3>
              <button type="button" onClick={() => setShowParentForm(false)}><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Name</label>
                <input type="text" value={parentForm.name} onChange={(e) => setParentForm((p) => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} placeholder="e.g. Shop by Type or Shop by Need" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Slug</label>
                <input type="text" value={parentForm.slug} onChange={(e) => setParentForm((p) => ({ ...p, slug: e.target.value }))} placeholder="e.g. shop-by-type" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Mega-Menu Column</label>
                <select value={parentForm.type} onChange={(e) => setParentForm((p) => ({ ...p, type: e.target.value as any }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm">
                  <option value="category">Category (Column 1 - e.g. Shop by Type)</option>
                  <option value="style">Style / Need (Column 2 - e.g. Shop by Need)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Description</label>
                <input type="text" value={parentForm.description} onChange={(e) => setParentForm((p) => ({ ...p, description: e.target.value }))} placeholder="Category description..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="primary" onClick={saveParentCategory} className="text-xs bg-teal-600 hover:bg-teal-700 text-white">{editingCat ? "Update" : "Create"} Lenses Group</Button>
              <Button variant="ghost" onClick={() => setShowParentForm(false)} className="text-xs">Cancel</Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Parent Lenses Category List */}
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] p-4">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lenses categories..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--color-border)]">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Lenses Parent Group</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Mega-Menu Column</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Subcategories Options</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Status</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {parentCategories.map((parent, i) => {
                  const subs = getSubcategories(parent.id);
                  return (
                    <motion.tr 
                      key={parent.id} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: i * 0.03 }} 
                      className="group border-b border-[color:var(--color-border)] transition-colors last:border-0 hover:bg-[color:var(--color-surface-muted)] cursor-pointer"
                      onClick={() => setSelectedParent(parent)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 font-bold">
                            <Eye className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[color:var(--color-text-primary)] group-hover:text-teal-600 transition-colors">{parent.name}</p>
                            <p className="text-xs text-[color:var(--color-text-tertiary)]">{parent.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold text-teal-600 uppercase tracking-wider">
                        {parent.type === "style" ? "Shop by Need (Col 2)" : "Shop by Type (Col 1)"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-xs font-semibold text-[color:var(--color-text-secondary)] border border-[color:var(--color-border)]">
                            <Layers className="h-3.5 w-3.5 text-teal-600" />
                            {subs.length} Options
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4"><StatusBadge status={parent.status} /></td>
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            className="text-xs h-8 hover:border-teal-500 hover:text-teal-600"
                            onClick={() => setSelectedParent(parent)}
                          >
                            Manage Subcategories <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                          <button type="button" onClick={() => openEditParent(parent)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-teal-600"><Edit3 className="h-3.5 w-3.5" /></button>
                          <button type="button" onClick={() => setDeleteId(parent.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Parent Category Details & Subcategory Options Modal */}
      <AnimatePresence>
        {selectedParent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-2xl">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white font-bold">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg text-[color:var(--color-text-primary)]">{selectedParent.name} Options</h2>
                    <p className="text-xs text-[color:var(--color-text-tertiary)]">Manage subcategories under {selectedParent.name}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedParent(null)} className="rounded-lg p-1 text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
                
                {/* Add Subcategory Form */}
                <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-secondary)] mb-3">Add Subcategory to {selectedParent.name}</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input 
                      type="text" 
                      value={newSubName} 
                      onChange={(e) => setNewSubName(e.target.value)} 
                      placeholder="e.g. Daily Disposable, Toric, Colored" 
                      className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3.5 py-2 text-xs" 
                    />
                    <input 
                      type="text" 
                      value={newSubDescription} 
                      onChange={(e) => setNewSubDescription(e.target.value)} 
                      placeholder="Description (optional)" 
                      className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3.5 py-2 text-xs" 
                    />
                  </div>
                  <Button 
                    onClick={handleAddSubcategory} 
                    disabled={!newSubName.trim()} 
                    className="mt-3 text-xs bg-teal-600 hover:bg-teal-700 text-white"
                    iconLeft={<Plus className="h-3.5 w-3.5" />}
                  >
                    Add Option to {selectedParent.name}
                  </Button>
                </div>

                {/* List of Subcategory Options */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-secondary)] mb-3">
                    Current Subcategories ({getSubcategories(selectedParent.id).length})
                  </h4>
                  
                  {getSubcategories(selectedParent.id).length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[color:var(--color-border)] py-8 text-center">
                      <FolderOpen className="mx-auto h-8 w-8 text-[color:var(--color-text-tertiary)]" />
                      <p className="mt-2 text-xs text-[color:var(--color-text-tertiary)]">No subcategories added yet for {selectedParent.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {getSubcategories(selectedParent.id).map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-3.5">
                          <div>
                            <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{sub.name}</p>
                            <p className="text-xs text-[color:var(--color-text-tertiary)]">{sub.description || sub.slug}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              type="button" 
                              onClick={() => setDeleteId(sub.id)} 
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-danger)]/10 hover:text-[color:var(--color-danger)] transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Footer */}
              <div className="flex justify-end border-t border-[color:var(--color-border)] px-6 py-3">
                <Button variant="outline" onClick={() => setSelectedParent(null)} className="text-xs">Close</Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeCategory} title="Delete Category" message="Category option will be removed." confirmLabel="Delete" variant="danger" />
    </div>
  );
}
