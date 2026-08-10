import React from "react";
import { Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export type LensNodeKind = "category" | "collection" | "brand" | "type";

// Normalized lens tree node. "category" is the top-level coating/tint option;
// "collection"/"brand" are intermediate grouping levels; "type" is the selectable leaf.
export interface LensTypeOption {
  kind?: LensNodeKind;
  id: string;
  name: string;
  price: number | null;
  priceOnRequest?: boolean;
  description: string;
  info: string;
  strengths?: string[];
  colors?: { name: string; hex: string }[];
  delegatesToAppliesTo?: "sunglasses" | "eyeglasses" | "common";
  collections?: LensTypeOption[];
}

// The resolved drill-down path + price for the currently selected lens type.
export interface LensSelection {
  categoryId: string;
  collectionSlug?: string;
  brandSlug?: string;
  typeSlug?: string;
  price: number | null;
  priceOnRequest: boolean;
}

interface LensTypeStepProps {
  options: LensTypeOption[];
  selection: LensSelection | null;
  onSelect: (selection: Partial<LensSelection>) => void;
  selectedStrength: string;
  selectedColorName: string;
  onSelectStrength: (strength: string) => void;
  onSelectColor: (colorName: string) => void;
  delegatedOptions?: LensTypeOption[];
  delegatedSelection?: LensSelection | null;
  delegatedStrength?: string;
  delegatedColorName?: string;
  onSelectDelegated?: (selection: Partial<LensSelection>) => void;
  onSelectDelegatedStrength?: (strength: string) => void;
  onSelectDelegatedColor?: (colorName: string) => void;
}

interface StepCtx {
  options: LensTypeOption[];
  selection: LensSelection | null;
  onSelect: (selection: Partial<LensSelection>) => void;
  strength: string;
  colorName: string;
  onStrength: (strength: string) => void;
  onColor: (colorName: string) => void;
}

// Auto-resolve the first available priced path (used to preselect a sensible default).
export function getDefaultSelection(nodes: LensTypeOption[]): LensSelection | null {
  for (const node of nodes) {
    if (node.delegatesToAppliesTo) continue;
    if (node.collections && node.collections.length > 0) {
      const sub = getDefaultSelection(node.collections);
      if (sub) {
        return {
          ...sub,
          categoryId: node.kind === "category" ? node.id : sub.categoryId,
          collectionSlug: node.kind === "collection" ? node.id : sub.collectionSlug,
          brandSlug: node.kind === "brand" ? node.id : sub.brandSlug,
        };
      }
      continue;
    }
    return {
      categoryId: node.kind === "category" ? node.id : undefined,
      collectionSlug: node.kind === "collection" ? node.id : undefined,
      brandSlug: node.kind === "brand" ? node.id : undefined,
      typeSlug: node.kind === "type" ? node.id : undefined,
      price: node.price,
      priceOnRequest: !!node.priceOnRequest,
    };
  }
  return null;
}

// Resolve the selected nodes by walking the path through the tree.
// A leaf category (no collections — e.g. a sunglasses tint) resolves to itself as `type`.
export function resolveSelection(options: LensTypeOption[], selection: LensSelection | null) {
  const category = options.find((o) => o.id === selection?.categoryId);
  const collection = category?.collections?.find((c) => c.id === selection?.collectionSlug);
  const brand = collection?.collections?.find((b) => b.id === selection?.brandSlug);
  const type =
    brand?.collections?.find((t) => t.id === selection?.typeSlug) ||
    collection?.collections?.find((t) => t.id === selection?.typeSlug) ||
    (!collection && !selection?.typeSlug ? category : undefined);
  return { category, collection, brand, type };
}

const isNodeSelected = (node: LensTypeOption, selection: LensSelection | null): boolean => {
  if (node.kind === "category") return selection?.categoryId === node.id;
  if (node.kind === "collection") return selection?.collectionSlug === node.id;
  if (node.kind === "brand") return selection?.brandSlug === node.id;
  return selection?.typeSlug === node.id;
};

const isLeafNode = (node: LensTypeOption) =>
  !node.delegatesToAppliesTo && !(node.collections && node.collections.length > 0);

// A node that is itself the final pick (a lens type, or a category with no children).
const isLeafPick = (node: LensTypeOption) =>
  node.kind === "type" || (node.kind === "category" && isLeafNode(node));

function useSelectNode(node: LensTypeOption, ctx: StepCtx) {
  const isSelected = isNodeSelected(node, ctx.selection);

  const handleSelect = () => {
    const partial: Partial<LensSelection> = {
      price: node.price,
      priceOnRequest: !!node.priceOnRequest,
    };

    if (node.kind === "category") {
      Object.assign(partial, {
        categoryId: node.id,
        collectionSlug: undefined,
        brandSlug: undefined,
        typeSlug: undefined,
      });
    } else if (node.kind === "collection") {
      Object.assign(partial, {
        collectionSlug: node.id,
        brandSlug: undefined,
        typeSlug: undefined,
      });
    } else if (node.kind === "brand") {
      Object.assign(partial, {
        brandSlug: node.id,
        collectionSlug: ctx.selection?.collectionSlug,
        typeSlug: undefined,
      });
    } else {
      Object.assign(partial, { typeSlug: node.id });
    }

    if (node.collections && node.collections.length > 0) {
      // Auto-drill into the first available leaf so a lens price is always resolved.
      // Preserve the path segments the node itself owns (e.g. a brand's brandSlug and
      // the collection it lives under); only inherit deeper leaf slugs from the sub.
      const sub = getDefaultSelection(node.collections);
      if (sub) {
        partial.collectionSlug = sub.collectionSlug ?? partial.collectionSlug;
        partial.brandSlug = sub.brandSlug ?? partial.brandSlug;
        partial.typeSlug = sub.typeSlug ?? partial.typeSlug;
        partial.price = sub.price;
        partial.priceOnRequest = sub.priceOnRequest;
      }
    } else if (!node.delegatesToAppliesTo && isLeafNode(node)) {
      if (node.strengths && node.strengths.length > 0) ctx.onStrength(node.strengths[0]);
      if (node.colors && node.colors.length > 0) ctx.onColor(node.colors[0].name);
    }

    ctx.onSelect(partial);
  };

  return { isSelected, handleSelect };
}

function NodeInfoButton({ node }: { node: LensTypeOption }) {
  const [tooltip, setTooltip] = React.useState<{ left: number; top: number } | null>(null);
  if (!node.info) return null;
  return (
    <span
      className="relative inline-flex shrink-0 cursor-help text-[color:var(--color-text-tertiary)] transition-colors hover:text-[color:var(--color-brand-primary)]"
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
          left: Math.max(8, Math.min(rect.left, window.innerWidth - 272)),
          top: rect.bottom + 8,
        });
      }}
      onMouseLeave={() => setTooltip(null)}
      aria-label={`More about ${node.name}`}
    >
      <Info className="h-3.5 w-3.5" />
      {tooltip && (
        <span
          role="tooltip"
          className="pointer-events-none fixed z-[100] w-64 rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-panel)] p-3 text-[11px] font-medium leading-relaxed text-[color:var(--color-text-secondary)] shadow-[var(--shadow-strong)]"
          style={{ left: tooltip.left, top: tooltip.top }}
        >
          {node.info}
        </span>
      )}
    </span>
  );
}

function renderExpandedContent(node: LensTypeOption, ctx: StepCtx, delegated: StepCtx) {
  if (node.delegatesToAppliesTo) {
    return (
      <div className="space-y-3">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)] mb-1">
          Select Tint Type & Color
        </span>
        <LensTypeStep
          options={delegated.options}
          selection={delegated.selection}
          onSelect={delegated.onSelect}
          selectedStrength={delegated.strength}
          selectedColorName={delegated.colorName}
          onSelectStrength={delegated.onStrength}
          onSelectColor={delegated.onColor}
        />
      </div>
    );
  }

  if (node.collections && node.collections.length > 0) {
    return (
      <LensTypeStep
        options={node.collections}
        selection={ctx.selection}
        onSelect={ctx.onSelect}
        selectedStrength={ctx.strength}
        selectedColorName={ctx.colorName}
        onSelectStrength={ctx.onStrength}
        onSelectColor={ctx.onColor}
      />
    );
  }

  return (
    <>
      {/* Strength Toggles */}
      {node.strengths && node.strengths.length > 0 && (
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)] mb-2">
            Tint Density / Strength
          </span>
          <div className="flex flex-wrap gap-2">
            {node.strengths.map((str) => (
              <button
                key={str}
                type="button"
                onClick={() => ctx.onStrength(str)}
                className={cn(
                  "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
                  ctx.strength === str
                    ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]/5 text-[color:var(--color-brand-primary)]"
                    : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-text-secondary)]"
                )}
              >
                {str}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors Toggles */}
      {node.colors && node.colors.length > 0 && (
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)] mb-2">
            Lens Tint Color
          </span>
          <div className="flex flex-wrap gap-2.5">
            {node.colors.map((c) => {
              const isColorSelected = ctx.colorName === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => ctx.onColor(c.name)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
                    isColorSelected
                      ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]/5 text-[color:var(--color-brand-primary)]"
                      : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-text-secondary)]"
                  )}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-black/10"
                    style={{ background: c.hex }}
                  />
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

function LensNodeCard({
  node,
  ctx,
  delegated
}: {
  node: LensTypeOption;
  ctx: StepCtx;
  delegated: StepCtx;
}) {
  const { isSelected, handleSelect } = useSelectNode(node, ctx);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const leafPick = isLeafPick(node);

  // Browser scroll anchoring can scroll the page down when expanded content
  // above/below the click shifts layout — snap the opened option back into view.
  const handleClick = () => {
    handleSelect();
    requestAnimationFrame(() => {
      rootRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  };

  let status: React.ReactNode;
  if (node.delegatesToAppliesTo) {
    status = (
      <span className="text-xs font-semibold text-[color:var(--color-text-secondary)] bg-[color:var(--color-border)]/50 px-2.5 py-1 rounded-lg">
        Choose tint below
      </span>
    );
  } else if (node.collections && node.collections.length > 0) {
    status = (
      <span className="text-xs font-semibold text-[color:var(--color-text-secondary)] bg-[color:var(--color-border)]/50 px-2.5 py-1 rounded-lg">
        Choose option below
      </span>
    );
  } else if (node.priceOnRequest || node.price === null) {
    status = (
      <span className="text-xs font-semibold text-amber-900 bg-amber-500/15 px-2.5 py-1 rounded-lg">
        Price on request
      </span>
    );
  } else {
    status = (
      <span className="text-sm font-bold text-[color:var(--color-brand-primary)]">
        +Rs. {node.price!.toLocaleString()}
      </span>
    );
  }

  // ---- Category level (outermost / primary choice): full card -------------
  if (node.kind === "category") {
    return (
      <div
        ref={rootRef}
        onClick={handleClick}
        className={cn(
          "relative overflow-hidden rounded-2xl border p-5 transition-all cursor-pointer",
          isSelected
            ? leafPick
              ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface)] shadow-sm"
              : "border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] shadow-sm"
            : "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] hover:border-[color:var(--color-text-secondary)]"
        )}
      >
        {isSelected && !leafPick && (
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-[color:var(--color-brand-primary)]" />
        )}

        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-1.5">
              <h4
                className={cn(
                  "text-sm font-bold text-[color:var(--color-text-primary)]",
                  isSelected && !leafPick && "text-[color:var(--color-brand-primary)]"
                )}
              >
                {node.name}
              </h4>
              <NodeInfoButton node={node} />
            </div>
            {node.description && (
              <p className="text-xs text-[color:var(--color-text-secondary)] mt-1">
                {node.description}
              </p>
            )}
          </div>

          <div className="text-right shrink-0">{status}</div>
        </div>

        {/* Expanded content */}
        <AnimatePresence initial={false}>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4 border-t border-[color:var(--color-border)] pt-4"
              onClick={(e) => e.stopPropagation()}
            >
              {renderExpandedContent(node, ctx, delegated)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ---- Collection level (Essential/Comfort/Exclusive): light indented row --
  if (node.kind === "collection") {
    return (
      <div ref={rootRef}>
        <div
          onClick={handleClick}
          className={cn(
            "flex items-center gap-2 rounded-xl border-l-2 py-2 pl-3 pr-2 transition-all cursor-pointer",
            isSelected
              ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]/5"
              : "border-[color:var(--color-border)] hover:border-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]"
          )}
        >
          <span
            className={cn(
              "text-[13px] font-semibold transition-colors",
              isSelected ? "text-[color:var(--color-brand-primary)]" : "text-[color:var(--color-text-primary)]"
            )}
          >
            {node.name}
          </span>
          <NodeInfoButton node={node} />
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            {node.collections?.length ?? 0} options
          </span>
        </div>

        <AnimatePresence initial={false}>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ml-[5px] border-l-2 border-[color:var(--color-border)] pl-3 mt-1">
                {renderExpandedContent(node, ctx, delegated)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ---- Brand level (A.B.C/Privo/ZEISS/Japanese): lightest sub-filter ------
  if (node.kind === "brand") {
    return (
      <div ref={rootRef}>
        <div
          onClick={handleClick}
          className={cn(
            "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors cursor-pointer",
            isSelected ? "bg-[color:var(--color-brand-primary)]/5" : "hover:bg-[color:var(--color-surface-muted)]"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors shrink-0",
              isSelected ? "bg-[color:var(--color-brand-primary)]" : "bg-[color:var(--color-text-tertiary)]"
            )}
          />
          <span
            className={cn(
              "text-xs font-semibold",
              isSelected ? "text-[color:var(--color-brand-primary)]" : "text-[color:var(--color-text-secondary)]"
            )}
          >
            {node.name}
          </span>
          <NodeInfoButton node={node} />
          {isSelected && <Check className="h-3 w-3 text-[color:var(--color-brand-primary)] shrink-0" />}
          <span className="ml-auto text-[10px] font-medium text-[color:var(--color-text-tertiary)]">
            {node.collections?.length ?? 0}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ml-3 border-l-2 border-[color:var(--color-border)] pl-3 mt-1">
                {renderExpandedContent(node, ctx, delegated)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ---- Lens type level (the actual priced pick): most prominent ----------
  return (
    <div
      ref={rootRef}
      onClick={handleClick}
      className={cn(
        "rounded-2xl border p-4 transition-all cursor-pointer",
        isSelected
          ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface)] shadow-sm"
          : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:border-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {isSelected && <Check className="h-4 w-4 shrink-0 text-[color:var(--color-brand-primary)]" />}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h5
                className={cn(
                  "text-sm font-bold",
                  isSelected ? "text-[color:var(--color-brand-primary)]" : "text-[color:var(--color-text-primary)]"
                )}
              >
                {node.name}
              </h5>
              <NodeInfoButton node={node} />
            </div>
            {node.description && (
              <p className="text-xs text-[color:var(--color-text-secondary)] mt-0.5 leading-relaxed">
                {node.description}
              </p>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">{status}</div>
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-3 border-t border-[color:var(--color-border)] pt-3"
            onClick={(e) => e.stopPropagation()}
          >
            {renderExpandedContent(node, ctx, delegated)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LensTypeStep({
  options,
  selection,
  onSelect,
  selectedStrength,
  selectedColorName,
  onSelectStrength,
  onSelectColor,
  delegatedOptions,
  delegatedSelection,
  delegatedStrength,
  delegatedColorName,
  onSelectDelegated,
  onSelectDelegatedStrength,
  onSelectDelegatedColor,
}: LensTypeStepProps) {
  const ctx: StepCtx = {
    options,
    selection,
    onSelect,
    strength: selectedStrength,
    colorName: selectedColorName,
    onStrength: onSelectStrength,
    onColor: onSelectColor,
  };
  const delegated: StepCtx = {
    options: delegatedOptions ?? [],
    selection: delegatedSelection ?? null,
    onSelect: onSelectDelegated ?? (() => {}),
    strength: delegatedStrength ?? "",
    colorName: delegatedColorName ?? "",
    onStrength: onSelectDelegatedStrength ?? (() => {}),
    onColor: onSelectDelegatedColor ?? (() => {}),
  };

  return (
    <div className="flex flex-col gap-3" style={{ overflowAnchor: "none" }}>
      {options.map((node) => (
        <LensNodeCard key={node.id} node={node} ctx={ctx} delegated={delegated} />
      ))}
    </div>
  );
}
