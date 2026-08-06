import { cn } from "@/lib/utils";

export interface PrescriptionData {
  od: { sph: string; cyl: string; axis: string; add: string };
  os: { sph: string; cyl: string; axis: string; add: string };
  pd: string;
  pdTwo?: { od: string; os: string };
}

interface PrescriptionSummaryTableProps {
  data: PrescriptionData;
  prescriptionType?: "none" | "manual" | "file" | "written";
  className?: string;
}

export function PrescriptionSummaryTable({ data, prescriptionType, className }: PrescriptionSummaryTableProps) {
  if (prescriptionType === "none") {
    return (
      <div className={cn("overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 text-center", className)}>
        <p className="font-bold text-[color:var(--color-text-primary)]">No Prescription</p>
        <p className="text-[10px] text-[color:var(--color-text-secondary)] mt-1">Lens tint / color customization only</p>
      </div>
    );
  }

  const hasTwoPd = !!data.pdTwo?.od;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]", className)}>
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-secondary)]">
            <th className="px-4 py-2">Eye</th>
            <th className="px-4 py-2">SPH</th>
            <th className="px-4 py-2">CYL</th>
            <th className="px-4 py-2">Axis</th>
            <th className="px-4 py-2">ADD</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--color-border)] font-medium text-[color:var(--color-text-primary)]">
          <tr>
            <td className="px-4 py-2.5 font-bold text-[color:var(--color-brand-primary)]">OD (Right)</td>
            <td className="px-4 py-2.5">{data.od.sph || "0.00"}</td>
            <td className="px-4 py-2.5">{data.od.cyl || "0.00"}</td>
            <td className="px-4 py-2.5">{data.od.axis || "—"}</td>
            <td className="px-4 py-2.5">{data.od.add || "—"}</td>
          </tr>
          <tr>
            <td className="px-4 py-2.5 font-bold text-[color:var(--color-brand-primary)]">OS (Left)</td>
            <td className="px-4 py-2.5">{data.os.sph || "0.00"}</td>
            <td className="px-4 py-2.5">{data.os.cyl || "0.00"}</td>
            <td className="px-4 py-2.5">{data.os.axis || "—"}</td>
            <td className="px-4 py-2.5">{data.os.add || "—"}</td>
          </tr>
        </tbody>
      </table>
      
      <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2 text-xs font-semibold text-[color:var(--color-text-secondary)]">
        {hasTwoPd ? (
          <span>Pupillary Distance (PD): <strong className="text-[color:var(--color-text-primary)]">R: {data.pdTwo?.od}mm, L: {data.pdTwo?.os}mm</strong></span>
        ) : (
          <span>Pupillary Distance (PD): <strong className="text-[color:var(--color-text-primary)]">{data.pd}mm</strong></span>
        )}
      </div>
    </div>
  );
}
