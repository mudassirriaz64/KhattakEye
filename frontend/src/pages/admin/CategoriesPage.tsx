import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, Plus, Edit3, Trash2, Search, X, FolderOpen, ArrowRight, Layers, Columns } from "lucide-react";
import { type AdminCategory } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import { getCategoriesApi, adminCreateCategoryApi, adminDeleteCategoryApi, adminUpdateCategoryApi } from "@/lib/api/admin";

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCategories = () => {
    getCategoriesApi("glasses").then((data) => {
      if (Array.isArray(data)) {
        const mapped: AdminCategory[] = [];
        data.forEach((c) => {
          const parentId = c._id || c.id || "";
          mapped.push({
            id: parentId,
            name: c.name,
            slug: c.slug || c.name.toLowerCase().replace(/\s+/g, "-"),
            description: c.description || "",
            productCount: c.productCount || 0,
            parent: null,
            featured: c.featured !== undefined ? c.featured : true,
            status: c.status || "active",
            image: c.image || "",
            createdAt: c.createdAt || new Date().toISOString()
          });

          if (Array.isArray(c.subcategories)) {
            c.subcategories.forEach((sub) => {
              mapped.push({
                id: sub._id || sub.id || `${parentId}-${sub.slug}`,
                _id: sub._id,
                name: sub.name,
                slug: sub.slug || sub.name.toLowerCase().replace(/\s+/g, "-"),
                description: sub.description || "",
                productCount: sub.productCount || 0,
                parent: parentId,
                featured: false,
                status: "active",
                image: "",
                group: sub.group || "Category",
                createdAt: c.createdAt || new Date().toISOString()
              });
            });
          }
        });
        setCategories(mapped);
      }
    }).catch((err) => {
      console.error("Failed to fetch categories:", err);
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [selectedParent, setSelectedParent] = useState<AdminCategory | null>(null);

  const [showParentForm, setShowParentForm] = useState(false);
  const [editingCat, setEditingCat] = useState<AdminCategory | null>(null);
  const [parentForm, setParentForm] = useState({ name: "", slug: "", description: "", productKind: "glasses" as "glasses" | "lenses", type: "category" as "category" | "style" | "collection", featured: true, status: "active" as "active" | "inactive" });
  
  const [newSubName, setNewSubName] = useState("");
  const [newSubDescription, setNewSubDescription] = useState("");
  const [selectedGroupOption, setSelectedGroupOption] = useState("Category");
  const [customGroup, setCustomGroup] = useState("");

  const parentCategories = categories.filter((c) => !c.parent && (!search || c.name.toLowerCase().includes(search.toLowerCase())));
  const getSubcategories = useCallback(
    (parentId: string) => categories.filter((c) => c.parent === parentId),
    [categories]
  );

  // Distinct mega-menu groups/columns under a parent (e.g. Category, Styles, Collections)
  const getMegaMenuColumns = (parentId: string) =>
    new Set(getSubcategories(parentId).map((s) => s.group).filter(Boolean)).size;

  // Derive distinct existing groups for the selected parent
  const existingGroups = useMemo(() => {
    if (!selectedParent) return [];
    return Array.from(
      new Set(
        getSubcategories(selectedParent.id)
          .map((s) => s.group)
          .filter(Boolean)
      )
    ) as string[];
  }, [selectedParent, getSubcategories]);

  // Set default selected group option when existingGroups change
  useEffect(() => {
    if (existingGroups.length > 0) {
      setSelectedGroupOption(existingGroups[0]);
      setCustomGroup("");
    } else {
      setSelectedGroupOption("_new_");
      setCustomGroup("Category");
    }
  }, [existingGroups]);

  // Sync selectedParent on categories state update (e.g. after reload)
  useEffect(() => {
    if (selectedParent) {
      const updated = categories.find(c => c.id === selectedParent.id);
      if (updated) setSelectedParent(updated);
    }
  }, [categories, selectedParent]);

  const resetParentForm = () => {
    setParentForm({ name: "", slug: "", description: "", productKind: "glasses", type: "category", featured: true, status: "active" });
    setEditingCat(null);
  };

  const openEditParent = (cat: AdminCategory) => {
    setParentForm({ name: cat.name, slug: cat.slug, description: cat.description, productKind: cat.productKind || "glasses", type: cat.type || "category", featured: cat.featured, status: cat.status });
    setEditingCat(cat);
    setShowParentForm(true);
  };

  const saveParentCategory = async () => {
    try {
      if (editingCat) {
        await adminUpdateCategoryApi(editingCat.id, parentForm);
      } else {
        await adminCreateCategoryApi({ name: parentForm.name, description: parentForm.description, productKind: parentForm.productKind, type: parentForm.type });
      }
      fetchCategories();
    } catch (err) {
      console.error("Failed to save category:", err);
    }
    setShowParentForm(false);
    resetParentForm();
  };

  const handleAddSubcategory = async () => {
    if (!selectedParent || !newSubName.trim()) return;
    const slug = newSubName.toLowerCase().replace(/\s+/g, "-");
    const groupToSave = (existingGroups.length === 0 || selectedGroupOption === "_new_") 
      ? (customGroup.trim() || "Category") 
      : selectedGroupOption;

    const newSub = {
      name: newSubName,
      slug,
      description: newSubDescription || `${newSubName} under ${selectedParent.name}`,
      group: groupToSave,
      productCount: 0
    };

    const currentSubs = getSubcategories(selectedParent.id).map(s => ({
      _id: s._id || s.id,
      name: s.name,
      slug: s.slug,
      description: s.description,
      group: s.group || "Category",
      productCount: s.productCount
    }));

    try {
      await adminUpdateCategoryApi(selectedParent.id, {
        subcategories: [...currentSubs, newSub]
      });
      setNewSubName("");
      setNewSubDescription("");
      if (existingGroups.length > 0) {
        setSelectedGroupOption(existingGroups[0]);
        setCustomGroup("");
      } else {
        setSelectedGroupOption("_new_");
        setCustomGroup("Category");
      }
      fetchCategories();
    } catch (err) {
      console.error("Failed to add subcategory option:", err);
    }
  };

  const removeCategory = async () => {
    if (!deleteId) return;
    const idToDelete = deleteId;
    setDeleteId(null);

    const cat = categories.find(c => c.id === idToDelete);
    if (!cat) return;

    try {
      if (cat.parent) {
        // It is a subcategory, update parent document
        const currentSubs = categories
          .filter(c => c.parent === cat.parent && c.id !== idToDelete)
          .map(s => ({
            _id: s._id || s.id,
            name: s.name,
            slug: s.slug,
            description: s.description,
            group: s.group || "Category",
            productCount: s.productCount
          }));
        await adminUpdateCategoryApi(cat.parent, {
          subcategories: currentSubs
        });
      } else {
        // It is a parent category
        await adminDeleteCategoryApi(idToDelete);
        if (selectedParent && selectedParent.id === idToDelete) {
          setSelectedParent(null);
        }
      }
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Parent Categories</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">Manage main categories and their subcategory options</p>
        </div>
        <Button variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => { resetParentForm(); setShowParentForm(true); }} className="text-xs">
          Add Parent Category
        </Button>
      </div>

      {showParentForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 overflow-hidden">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{editingCat ? "Edit Parent Category" : "New Parent Category"}</h3>
              <button type="button" onClick={() => setShowParentForm(false)}><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Name</label>
                <input type="text" value={parentForm.name} onChange={(e) => setParentForm((p) => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} placeholder="e.g. Sunglasses" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Slug</label>
                <input type="text" value={parentForm.slug} onChange={(e) => setParentForm((p) => ({ ...p, slug: e.target.value }))} placeholder="e.g. sunglasses" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" />
              </div>
               <div className="sm:col-span-2">
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Product Kind</label>
                <select value={parentForm.productKind} onChange={(e) => setParentForm((p) => ({ ...p, productKind: e.target.value as "glasses" | "lenses" }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm">
                  <option value="glasses">Glasses (Eyeglasses / Sunglasses)</option>
                  <option value="lenses">Lenses (Contact Lenses)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Description</label>
                <input type="text" value={parentForm.description} onChange={(e) => setParentForm((p) => ({ ...p, description: e.target.value }))} placeholder="Category description..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="primary" onClick={saveParentCategory} className="text-xs">{editingCat ? "Update" : "Create"} Parent Category</Button>
              <Button variant="ghost" onClick={() => setShowParentForm(false)} className="text-xs">Cancel</Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main minimal Parent Category List */}
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] p-4">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search parent categories..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--color-border)]">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Parent Category</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Subcategories Options</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Mega-Menu Columns</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Total Products</th>
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
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-brand-primary)]/10 text-[color:var(--color-brand-primary)]">
                            <Grid3X3 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[color:var(--color-text-primary)] group-hover:text-[color:var(--color-brand-primary)] transition-colors">{parent.name}</p>
                            <p className="text-xs text-[color:var(--color-text-tertiary)]">{parent.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-xs font-semibold text-[color:var(--color-text-secondary)] border border-[color:var(--color-border)]">
                            <Layers className="h-3.5 w-3.5 text-[color:var(--color-brand-primary)]" />
                            {subs.length} Options
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-xs font-semibold text-[color:var(--color-text-secondary)] border border-[color:var(--color-border)]">
                            <Columns className="h-3.5 w-3.5 text-[color:var(--color-brand-primary)]" />
                            {getMegaMenuColumns(parent.id)} Columns
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-[color:var(--color-text-primary)]">
                        {parent.productCount} products
                      </td>
                      <td className="px-4 py-4"><StatusBadge status={parent.status} /></td>
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            className="text-xs h-8"
                            onClick={() => setSelectedParent(parent)}
                          >
                            Manage Subcategories <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                          <button type="button" onClick={() => openEditParent(parent)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-teal)]"><Edit3 className="h-3.5 w-3.5" /></button>
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-brand-primary)] text-white font-bold">
                    {selectedParent.name[0]}
                  </div>
                  <div>
                    <h2 className="font-display text-lg text-[color:var(--color-text-primary)]">{selectedParent.name} Details</h2>
                    <p className="text-xs text-[color:var(--color-text-tertiary)]">Subcategories & Options under {selectedParent.name}</p>
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-secondary)] mb-3">Add New Option to {selectedParent.name}</h4>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input 
                      type="text" 
                      value={newSubName} 
                      onChange={(e) => setNewSubName(e.target.value)} 
                      placeholder="Option Name (e.g. Polarized Shades)" 
                      className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3.5 py-2 text-xs" 
                    />
                    {existingGroups.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        <select
                          value={selectedGroupOption}
                          onChange={(e) => setSelectedGroupOption(e.target.value)}
                          className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3.5 py-2 text-xs w-full"
                        >
                          {existingGroups.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                          <option value="_new_">+ Add New Group</option>
                        </select>
                        {selectedGroupOption === "_new_" && (
                          <input 
                            type="text" 
                            value={customGroup} 
                            onChange={(e) => setCustomGroup(e.target.value)} 
                            placeholder="New Group Name" 
                            className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3.5 py-2 text-xs w-full" 
                          />
                        )}
                      </div>
                    ) : (
                      <input 
                        type="text" 
                        value={customGroup} 
                        onChange={(e) => setCustomGroup(e.target.value)} 
                        placeholder="Group (e.g. Category, Styles, Collections)" 
                        className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3.5 py-2 text-xs" 
                      />
                    )}
                    <input 
                      type="text" 
                      value={newSubDescription} 
                      onChange={(e) => setNewSubDescription(e.target.value)} 
                      placeholder="Description (optional)" 
                      className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3.5 py-2 text-xs sm:col-span-3" 
                    />
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={handleAddSubcategory} 
                    disabled={!newSubName.trim()} 
                    className="mt-3 text-xs"
                    iconLeft={<Plus className="h-3.5 w-3.5" />}
                  >
                    Add to {selectedParent.name}
                  </Button>
                </div>

                {/* List of Subcategory Options */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-secondary)] mb-3">
                    Current Options ({getSubcategories(selectedParent.id).length})
                  </h4>
                  
                  {getSubcategories(selectedParent.id).length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[color:var(--color-border)] py-8 text-center">
                      <FolderOpen className="mx-auto h-8 w-8 text-[color:var(--color-text-tertiary)]" />
                      <p className="mt-2 text-xs text-[color:var(--color-text-tertiary)]">No options added yet for {selectedParent.name}</p>
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
                            <span className="text-xs text-[color:var(--color-text-tertiary)]">{sub.productCount} products</span>
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

