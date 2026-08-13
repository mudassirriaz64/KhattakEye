import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Plus, X } from "lucide-react";
import { adminGetBrandsApi, adminCreateBrandApi } from "@/lib/api/admin";
import { useToastStore } from "@/lib/stores/toast-store";
import { isAxiosError } from "axios";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
}

interface BrandSelectProps {
  value: string;
  onChange: (brand: string) => void;
  required?: boolean;
}

const selectClass =
  "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]";

export function BrandSelect({ value, onChange, required }: BrandSelectProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    adminGetBrandsApi()
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch(() => {});
  }, []);

  const knownBrands = useMemo(() => brands.filter((b) => b.name.trim().length > 0), [brands]);
  const currentIsKnown = knownBrands.some((b) => b.name === value);

  const handleSelect = (selected: string) => {
    if (selected === "__add__") {
      setIsAdding(true);
      return;
    }
    onChange(selected);
  };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    setIsCreating(true);
    try {
      const created = await adminCreateBrandApi({ name });
      setBrands((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      onChange(name);
      setIsAdding(false);
      setNewName("");
      addToast({ title: "Brand created", description: `${name} added successfully.`, type: "success" });
    } catch (err) {
      let message = "Failed to create brand";
      if (isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      addToast({ title: "Error", description: message, type: "error" });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={(e) => handleSelect(e.target.value)}
        required={required}
        className={selectClass}
      >
        {!value && <option value="">Select Brand...</option>}
        {knownBrands.map((b) => (
          <option key={b._id} value={b.name}>
            {b.name}
          </option>
        ))}
        {!currentIsKnown && value && <option value={value}>{value}</option>}
        <option value="__add__">+ Add New Brand</option>
      </select>

      {isAdding && (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
            }}
            placeholder="Enter new brand name..."
            className={selectClass}
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={isCreating || !newName.trim()}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[color:var(--color-brand-primary)] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setNewName("");
            }}
            disabled={isCreating}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] px-3 py-2.5 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
