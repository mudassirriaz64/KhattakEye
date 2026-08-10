import { useState, useEffect, useMemo, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Glasses, Plus, Edit3, Trash2, Search, X, Layers, Palette, Columns, Info, Save, ChevronDown,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import {
  type ApiLensOption,
  type ApiLensCollection,
  type ApiLensBrand,
  type ApiLensTypeEntry,
  type LensOptionAppliesTo,
  getAdminLensOptionsApi,
  createLensOptionApi,
  updateLensOptionApi,
  deleteLensOptionApi,
} from "@/lib/api/lens-options";

const inputCls =
  "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm outline-none transition-colors focus:border-[color:var(--color-brand-primary)]";
const labelCls =
  "mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/@/g, " at ")
    .replace(/%/g, " percent ")
    .replace(/#/g, " number ")
    .replace(/\./g, "")
    .replace(/\+/g, " plus ")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();

const blankDraft = (): ApiLensOption => ({
  _id: "",
  slug: "",
  appliesTo: "eyeglasses",
  name: "",
  price: undefined,
  description: "",
  info: "",
  icon: "",
  hasStrengthOptions: false,
  strengths: [],
  hasColorOptions: false,
  colors: [],
  collections: [],
  delegatesToAppliesTo: undefined,
  isActive: true,
  order: 0,
});

const countTypes = (opt: ApiLensOption): number => {
  let count = 0;
  opt.collections?.forEach((c) => {
    if (c.brands && c.brands.length > 0) {
      c.brands.forEach((b) => (count += b.lensTypes?.length || 0));
    } else {
      count += c.lensTypes?.length || 0;
    }
  });
  return count;
};

// Auto-generate slugs for anything missing one, de-duplicating within this category.
// Existing slugs are preserved so saved carts/orders keep working across edits.
const ensureSlugs = (opt: ApiLensOption): ApiLensOption => {
  const used = new Set<string>();
  const seed = (s?: string) => {
    if (s) used.add(s);
  };
  seed(opt.slug);
  (opt.collections || []).forEach((c) => {
    seed(c.slug);
    if (c.brands && c.brands.length > 0) {
      c.brands.forEach((b) => {
        seed(b.slug);
        (b.lensTypes || []).forEach((t) => seed(t.slug));
      });
    } else {
      (c.lensTypes || []).forEach((t) => seed(t.slug));
    }
  });

  const pick = (base: string): string => {
    let s = base || "item";
    let n = 2;
    while (used.has(s)) s = `${base}-${n++}`;
    used.add(s);
    return s;
  };

  return {
    ...opt,
    slug: opt.slug || pick(slugify(opt.name)),
    collections: (opt.collections || []).map((c) => {
      const cCopy: ApiLensCollection = { ...c, slug: c.slug || pick(slugify(c.name)) };
      if (cCopy.brands && cCopy.brands.length > 0) {
        cCopy.brands = cCopy.brands.map((b) => ({
          ...b,
          slug: b.slug || pick(slugify(b.name)),
          lensTypes: (b.lensTypes || []).map((t) => ({
            ...t,
            slug: t.slug || pick(slugify(t.name)),
          })),
        }));
      } else {
        cCopy.lensTypes = (cCopy.lensTypes || []).map((t) => ({
          ...t,
          slug: t.slug || pick(slugify(t.name)),
        }));
      }
      return cCopy;
    }),
  };
};

// The icon field is unused by the storefront; auto-manage it from the slug.
const autoIcon = (opt: ApiLensOption): string => {
  if (opt.icon) return opt.icon;
  const s = `${opt.slug} ${opt.name}`.toLowerCase();
  if (s.includes("sun") || s.includes("tint")) return "Sun";
  if (s.includes("reading") || s.includes("near")) return "BookOpen";
  if (s.includes("distance")) return "Eye";
  return opt.appliesTo === "sunglasses" || opt.appliesTo === "common" ? "Glasses" : "Eye";
};

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2.5 text-left transition-colors hover:border-[color:var(--color-text-secondary)]"
    >
      <span>
        <span className="block text-sm font-semibold text-[color:var(--color-text-secondary)]">{label}</span>
        {hint && <span className="block text-[11px] text-[color:var(--color-text-tertiary)]">{hint}</span>}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-[color:var(--color-brand-primary)]" : "bg-[color:var(--color-border)]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5"
          )}
        />
      </span>
    </button>
  );
}

function Collapsible({
  title,
  subtitle,
  count,
  countLabel,
  defaultOpen = false,
  onRemove,
  children,
}: {
  title: string;
  subtitle?: string;
  count?: number;
  countLabel?: string;
  defaultOpen?: boolean;
  onRemove?: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-[color:var(--color-text-tertiary)] transition-transform",
              open && "rotate-180"
            )}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[color:var(--color-text-primary)]">{title}</p>
            {subtitle && (
              <p className="truncate text-[11px] text-[color:var(--color-text-tertiary)]">{subtitle}</p>
            )}
          </div>
          {count != null && (
            <span className="shrink-0 rounded-lg bg-[color:var(--color-surface-muted)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-text-tertiary)]">
              {count} {countLabel ?? "items"}
            </span>
          )}
        </button>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-danger)]/10 hover:text-[color:var(--color-danger)]"
            aria-label="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[color:var(--color-border)] px-4 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LensTypesEditor({
  lensTypes,
  onChange,
}: {
  lensTypes: ApiLensTypeEntry[];
  onChange: (v: ApiLensTypeEntry[]) => void;
}) {
  const update = (i: number, patch: Partial<ApiLensTypeEntry>) =>
    onChange(lensTypes.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  const remove = (i: number) => onChange(lensTypes.filter((_, idx) => idx !== i));
  const add = () =>
    onChange([
      ...lensTypes,
      { slug: "", name: "", price: undefined, priceOnRequest: false, description: "", info: "" },
    ]);

  return (
    <div className="space-y-2">
      {lensTypes.map((t, i) => (
        <LensTypeRow
          key={i}
          lensType={t}
          onChange={(patch) => update(i, patch)}
          onRemove={() => remove(i)}
        />
      ))}
      <Button variant="outline" className="text-xs" onClick={add} iconLeft={<Plus className="h-3.5 w-3.5" />}>
        Add Lens Type
      </Button>
    </div>
  );
}

function LensTypeRow({
  lensType,
  onChange,
  onRemove,
}: {
  lensType: ApiLensTypeEntry;
  onChange: (patch: Partial<ApiLensTypeEntry>) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
      <div className="flex items-center gap-2 p-2.5">
        <input
          className={cn(inputCls, "min-w-0 flex-1")}
          value={lensType.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Lens name (e.g. Multicoat)"
        />
        <input
          type="number"
          min={0}
          className={cn(inputCls, "w-24 text-right", lensType.priceOnRequest && "opacity-40")}
          value={lensType.price ?? ""}
          onChange={(e) =>
            onChange({ price: e.target.value === "" ? undefined : Number(e.target.value) })
          }
          placeholder="Price"
        />
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-[11px] font-semibold whitespace-nowrap text-[color:var(--color-text-secondary)]">
          <input
            type="checkbox"
            checked={!!lensType.priceOnRequest}
            onChange={(e) => onChange({ priceOnRequest: e.target.checked })}
            className="h-3.5 w-3.5 rounded"
          />
          On request
        </label>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-border)]"
          aria-label="More details"
        >
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-danger)]/10 hover:text-[color:var(--color-danger)]"
          aria-label="Delete lens type"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid gap-2.5 border-t border-[color:var(--color-border)] p-2.5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  rows={2}
                  className={inputCls}
                  value={lensType.description || ""}
                  onChange={(e) => onChange({ description: e.target.value })}
                  placeholder="Shown under the lens name"
                />
              </div>
              <div>
                <label className={labelCls}>Hover text</label>
                <textarea
                  rows={2}
                  className={inputCls}
                  value={lensType.info || ""}
                  onChange={(e) => onChange({ info: e.target.value })}
                  placeholder="Shown when a customer hovers the info icon"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BrandsEditor({
  brands,
  onChange,
}: {
  brands: ApiLensBrand[];
  onChange: (v: ApiLensBrand[]) => void;
}) {
  const update = (i: number, patch: Partial<ApiLensBrand>) =>
    onChange(brands.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  const remove = (i: number) => onChange(brands.filter((_, idx) => idx !== i));
  const add = () => onChange([...brands, { slug: "", name: "", info: "", lensTypes: [] }]);

  return (
    <div className="space-y-2">
      {brands.map((b, i) => (
        <Collapsible
          key={i}
          title={b.name || `Brand ${i + 1}`}
          subtitle={b.info || "Add a name, then its lens types"}
          count={b.lensTypes?.length ?? 0}
          countLabel="lenses"
          onRemove={() => remove(i)}
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Name</label>
              <input
                className={inputCls}
                value={b.name}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder="e.g. ZEISS"
              />
            </div>
            <div>
              <label className={labelCls}>Hover text</label>
              <input
                className={inputCls}
                value={b.info || ""}
                onChange={(e) => update(i, { info: e.target.value })}
                placeholder="Shown when a customer hovers the info icon"
              />
            </div>
          </div>
          <div className="mt-3">
            <LensTypesEditor
              lensTypes={b.lensTypes || []}
              onChange={(lensTypes) => update(i, { lensTypes })}
            />
          </div>
        </Collapsible>
      ))}
      <Button variant="outline" className="text-xs" onClick={add} iconLeft={<Plus className="h-3.5 w-3.5" />}>
        Add Brand
      </Button>
    </div>
  );
}

function StrengthsEditor({
  strengths,
  onChange,
}: {
  strengths: { label: string; value: string }[];
  onChange: (v: { label: string; value: string }[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const next = draft.trim();
    if (!next) return;
    onChange([...strengths, { label: next, value: slugify(next) }]);
    setDraft("");
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      {strengths.map((s, i) => (
        <span
          key={i}
          className="flex items-center gap-1.5 rounded-lg bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-text-secondary)]"
        >
          {s.label}
          <button
            type="button"
            onClick={() => onChange(strengths.filter((_, idx) => idx !== i))}
            className="text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-danger)]"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        className={cn(inputCls, "w-40")}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
        placeholder="Add strength…"
      />
      <Button variant="outline" className="text-xs" onClick={add}>
        Add
      </Button>
    </div>
  );
}

function ColorsEditor({
  colors,
  onChange,
}: {
  colors: { label: string; value: string; hex?: string }[];
  onChange: (v: { label: string; value: string; hex?: string }[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const next = draft.trim();
    if (!next) return;
    onChange([...colors, { label: next, value: slugify(next) }]);
    setDraft("");
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      {colors.map((c, i) => (
        <span
          key={i}
          className="flex items-center gap-1.5 rounded-lg bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-text-secondary)]"
        >
          {c.label}
          <button
            type="button"
            onClick={() => onChange(colors.filter((_, idx) => idx !== i))}
            className="text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-danger)]"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        className={cn(inputCls, "w-40")}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
        placeholder="Add color…"
      />
      <Button variant="outline" className="text-xs" onClick={add}>
        Add
      </Button>
    </div>
  );
}

function CollectionsEditor({
  collections,
  onChange,
}: {
  collections: ApiLensCollection[];
  onChange: (v: ApiLensCollection[]) => void;
}) {
  const update = (i: number, patch: Partial<ApiLensCollection>) =>
    onChange(collections.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const remove = (i: number) => onChange(collections.filter((_, idx) => idx !== i));
  const add = () =>
    onChange([...collections, { slug: "", name: "", info: "", lensTypes: [], brands: [] }]);

  return (
    <div className="space-y-2.5">
      {collections.map((c, i) => {
        const hasBrands = !!c.brands && c.brands.length > 0;
        return (
          <Collapsible
            key={i}
            title={c.name || `Collection ${i + 1}`}
            subtitle={c.info || (hasBrands ? "Branded lens groups" : "Lens types with prices")}
            count={hasBrands ? (c.brands?.length ?? 0) : (c.lensTypes?.length ?? 0)}
            countLabel={hasBrands ? "brands" : "lenses"}
            defaultOpen={i === 0}
            onRemove={() => remove(i)}
          >
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Name</label>
                <input
                  className={inputCls}
                  value={c.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                  placeholder="e.g. Essential"
                />
              </div>
              <div>
                <label className={labelCls}>Hover text</label>
                <input
                  className={inputCls}
                  value={c.info || ""}
                  onChange={(e) => update(i, { info: e.target.value })}
                  placeholder="Shown when a customer hovers the info icon"
                />
              </div>
            </div>
            <div className="mt-3">
              {hasBrands ? (
                <BrandsEditor brands={c.brands} onChange={(brands) => update(i, { brands })} />
              ) : (
                <LensTypesEditor
                  lensTypes={c.lensTypes || []}
                  onChange={(lensTypes) => update(i, { lensTypes })}
                />
              )}
            </div>
          </Collapsible>
        );
      })}
      <Button variant="outline" className="text-xs" onClick={add} iconLeft={<Plus className="h-3.5 w-3.5" />}>
        Add Collection
      </Button>
    </div>
  );
}

function LensOptionEditor({
  option,
  isNew,
  nextOrder,
  onClose,
  onSaved,
}: {
  option: ApiLensOption;
  isNew: boolean;
  nextOrder: number;
  onClose: () => void;
  onSaved: (opt: ApiLensOption) => void;
}) {
  const [draft, setDraft] = useState<ApiLensOption>({ ...option });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const hasCollections = (draft.collections?.length ?? 0) > 0;

  const set = (patch: Partial<ApiLensOption>) => setDraft((d) => ({ ...d, ...patch }));

  const handleSave = async () => {
    setError("");
    if (!draft.name.trim()) {
      setError("Give this option a name before saving.");
      return;
    }
    const payload = ensureSlugs({
      ...draft,
      icon: autoIcon(draft),
      order: isNew ? nextOrder : draft.order,
    });
    setSaving(true);
    try {
      const saved = isNew
        ? await createLensOptionApi(payload)
        : await updateLensOptionApi(draft._id, payload);
      onSaved(saved);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="my-auto flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[color:var(--color-border)] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[color:var(--color-text-primary)]">
              {isNew ? "New Lens Option" : `Edit — ${option.name}`}
            </h2>
            <p className="mt-0.5 text-xs text-[color:var(--color-text-tertiary)]">
              What customers see and choose in Buy Lenses.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-surface-muted)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Basics */}
          <div className="rounded-2xl border border-[color:var(--color-border)] p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              Basics
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls}>Name</label>
                <input
                  className={inputCls}
                  value={draft.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder="e.g. Distance Vision"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Shown for</label>
                <select
                  className={inputCls}
                  value={draft.appliesTo}
                  onChange={(e) => set({ appliesTo: e.target.value as LensOptionAppliesTo })}
                >
                  <option value="eyeglasses">Eyeglasses</option>
                  <option value="sunglasses">Sunglasses</option>
                  <option value="common">Common (both)</option>
                </select>
              </div>
              {!hasCollections && !draft.delegatesToAppliesTo && (
                <div className="sm:col-span-2">
                  <label className={labelCls}>Price (Rs.)</label>
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    value={draft.price ?? ""}
                    onChange={(e) =>
                      set({ price: e.target.value === "" ? undefined : Number(e.target.value) })
                    }
                    placeholder="0"
                  />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className={labelCls}>Short description</label>
                <textarea
                  rows={2}
                  className={inputCls}
                  value={draft.description || ""}
                  onChange={(e) => set({ description: e.target.value })}
                  placeholder="Shown under the option name in Buy Lenses"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Hover text</label>
                <textarea
                  rows={2}
                  className={inputCls}
                  value={draft.info || ""}
                  onChange={(e) => set({ info: e.target.value })}
                  placeholder="Shown when a customer hovers the info icon"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2.5">
              <div>
                <p className="text-sm font-semibold text-[color:var(--color-text-secondary)]">Active</p>
                <p className="text-[11px] text-[color:var(--color-text-tertiary)]">Hidden from customers when off.</p>
              </div>
              <button
                type="button"
                onClick={() => set({ isActive: !draft.isActive })}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  draft.isActive ? "bg-[color:var(--color-brand-primary)]" : "bg-[color:var(--color-border)]"
                )}
                aria-pressed={!!draft.isActive}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                    draft.isActive && "translate-x-5"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Extras — sunglasses & common only */}
          {(draft.appliesTo === "sunglasses" || draft.appliesTo === "common") && (
            <div className="rounded-2xl border border-[color:var(--color-border)] p-4">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                Extras
              </h3>
              <div className="grid gap-2.5 sm:grid-cols-2">
                <Toggle
                  checked={!!draft.hasStrengthOptions}
                  onChange={(v) => set({ hasStrengthOptions: v })}
                  label="Strength options"
                  hint="e.g. light / dark tint density"
                />
                <Toggle
                  checked={!!draft.hasColorOptions}
                  onChange={(v) => set({ hasColorOptions: v })}
                  label="Color options"
                  hint="e.g. grey / brown / green tints"
                />
              </div>
              {draft.hasStrengthOptions && (
                <div className="mt-3">
                  <label className={labelCls}>Strengths</label>
                  <StrengthsEditor
                    strengths={draft.strengths || []}
                    onChange={(strengths) => set({ strengths })}
                  />
                </div>
              )}
              {draft.hasColorOptions && (
                <div className="mt-3">
                  <label className={labelCls}>Colors</label>
                  <ColorsEditor
                    colors={draft.colors || []}
                    onChange={(colors) => set({ colors })}
                  />
                </div>
              )}
            </div>
          )}

          {/* Collections & lens types */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              Collections & Lens Types
            </h3>
            <CollectionsEditor
              collections={draft.collections || []}
              onChange={(collections) => set({ collections })}
            />
          </div>

          {/* Advanced */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              Advanced
            </h3>
            <div className="rounded-2xl border border-[color:var(--color-border)] p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {(draft.slug === "sun" || !!draft.delegatesToAppliesTo) && (
                  <div>
                    <label className={labelCls}>Reuse another lens picker</label>
                    <select
                      className={inputCls}
                      value={draft.delegatesToAppliesTo ?? ""}
                      onChange={(e) =>
                        set({
                          delegatesToAppliesTo: e.target.value
                            ? (e.target.value as LensOptionAppliesTo)
                            : undefined,
                        })
                      }
                    >
                      <option value="">None (shows its own options)</option>
                      <option value="sunglasses">Sunglasses options</option>
                      <option value="eyeglasses">Eyeglasses options</option>
                      <option value="common">Common (both) options</option>
                    </select>
                    <p className="mt-1 text-[11px] text-[color:var(--color-text-tertiary)]">
                      “Sun” reuses the common tints (Basic Tint, Medium Premium Tint, Gradient, Polarized HD).
                    </p>
                  </div>
                )}
                <div className="rounded-xl bg-[color:var(--color-surface-muted)] px-3.5 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                    Internal link (auto)
                  </p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-[color:var(--color-text-secondary)]">
                    {draft.slug || slugify(draft.name) || "auto-generated"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-[color:var(--color-danger)]/10 px-3 py-2 text-xs font-medium text-[color:var(--color-danger)]">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[color:var(--color-border)] px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={saving} iconLeft={<Save className="h-4 w-4" />}>
            {isNew ? "Create Option" : "Save Changes"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LensConfigurationPage() {
  const [options, setOptions] = useState<ApiLensOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | LensOptionAppliesTo>("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<ApiLensOption | null>(null);
  const [deleting, setDeleting] = useState<ApiLensOption | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminLensOptionsApi();
      setOptions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load lens options.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return options.filter((o) => {
      if (tab !== "all" && o.appliesTo !== tab) return false;
      if (!q) return true;
      return (
        o.name.toLowerCase().includes(q) ||
        o.slug.toLowerCase().includes(q) ||
        (o.description || "").toLowerCase().includes(q)
      );
    });
  }, [options, search, tab]);

  const openCreate = () => {
    setEditing(blankDraft());
    setEditorOpen(true);
  };
  const openEdit = (o: ApiLensOption) => {
    setEditing(o);
    setEditorOpen(true);
  };

  const handleSaved = (saved: ApiLensOption) => {
    setOptions((prev) => {
      const exists = prev.some((o) => o._id === saved._id);
      return exists ? prev.map((o) => (o._id === saved._id ? saved : o)) : [...prev, saved];
    });
    setEditorOpen(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteLensOptionApi(deleting._id);
      setOptions((prev) => prev.filter((o) => o._id !== deleting._id));
      setDeleting(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete lens option.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-xl font-bold text-[color:var(--color-text-primary)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-brand-primary)] text-white">
              <Glasses className="h-5 w-5" />
            </span>
            Buy Lenses Configuration
          </h1>
          <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
            Categories, collections, brands and lens types shown in the Buy Lenses flow.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate} iconLeft={<Plus className="h-4 w-4" />}>
          New Lens Option
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
          <input
            className={cn(inputCls, "pl-9")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug or description…"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "eyeglasses", "common"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-3.5 py-2 text-xs font-semibold capitalize transition-colors",
                tab === t
                  ? "bg-[color:var(--color-brand-primary)] text-white"
                  : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-border)]"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-[color:var(--color-danger)]/10 px-3 py-2 text-xs font-medium text-[color:var(--color-danger)]">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-[color:var(--color-text-tertiary)]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--color-brand-primary)] border-t-transparent" />
          <p className="text-xs font-medium">Loading lens options…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[color:var(--color-border)] py-20 text-center">
          <Layers className="h-8 w-8 text-[color:var(--color-text-tertiary)]" />
          <p className="text-sm font-semibold text-[color:var(--color-text-secondary)]">
            No lens options found
          </p>
          <p className="text-xs text-[color:var(--color-text-tertiary)]">
            {search
              ? "Try a different search or tab."
              : "Create your first lens option to start configuring Buy Lenses."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => (
            <div
              key={o._id}
              className="group flex flex-col rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)]">
                    <Layers className="h-4 w-4 text-[color:var(--color-brand-primary)]" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[color:var(--color-text-primary)]">{o.name}</h3>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">
                      /{o.slug} · order {o.order ?? 0}
                    </p>
                  </div>
                </div>
                <StatusBadge status={o.isActive ? "active" : "inactive"} />
              </div>

              <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[color:var(--color-text-tertiary)]">
                {o.description || "No description"}
              </p>

              <div className="mt-auto space-y-1.5 border-t border-[color:var(--color-border)] pt-3 text-[11px] text-[color:var(--color-text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <Columns className="h-3 w-3 text-[color:var(--color-text-tertiary)]" />
                  {o.collections?.length ?? 0} collections · {countTypes(o)} lens types
                </div>
                <div className="flex items-center gap-1.5">
                  <Palette className="h-3 w-3 text-[color:var(--color-text-tertiary)]" />
                  {o.hasStrengthOptions ? `${o.strengths?.length ?? 0} strengths` : "No strengths"} ·{" "}
                  {o.hasColorOptions ? `${o.colors?.length ?? 0} colors` : "No colors"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Info className="h-3 w-3 text-[color:var(--color-text-tertiary)]" />
                  {o.info ? "Has hover info" : "No hover info"}
                </div>
                {o.delegatesToAppliesTo && (
                  <div className="flex items-start gap-1.5">
                    <Layers className="h-3 w-3 mt-0.5 text-[color:var(--color-text-tertiary)] flex-shrink-0" />
                    <span>
                      Reuses:{" "}
                      {options
                        .filter((d) => d.appliesTo === o.delegatesToAppliesTo && d._id !== o._id)
                        .map((d) => d.name)
                        .join(", ") || "—"}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button variant="ghost" className="flex-1 text-xs" onClick={() => openEdit(o)} iconLeft={<Edit3 className="h-3.5 w-3.5" />}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  className="text-xs text-[color:var(--color-danger)]"
                  onClick={() => setDeleting(o)}
                  iconLeft={<Trash2 className="h-3.5 w-3.5" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editorOpen && editing && (
          <LensOptionEditor
            option={editing}
            isNew={!editing._id}
            nextOrder={options.reduce((max, o) => Math.max(max, o.order ?? 0), -1) + 1}
            onClose={() => {
              setEditorOpen(false);
              setEditing(null);
            }}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete lens option"
        message={`Delete "${deleting?.name}"? This removes its collections, brands and lens types. This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
