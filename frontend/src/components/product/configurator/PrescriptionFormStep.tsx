import React, { useState, useEffect } from "react";
import { ChevronDown, ShieldAlert, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GenericDragDropUpload } from "./GenericDragDropUpload";
import { type PrescriptionData } from "./PrescriptionSummaryTable";

interface PrescriptionFormStepProps {
  data: PrescriptionData;
  selectedType: "none" | "manual" | "file" | "written";
  prescriptionFile: File | null;
  prescriptionText: string;
  onTypeChange: (type: "none" | "manual" | "file" | "written") => void;
  onDataChange: (data: PrescriptionData) => void;
  onFileChange: (file: File | null) => void;
  onTextChange: (text: string) => void;
}

export function PrescriptionFormStep({
  data,
  selectedType,
  prescriptionFile,
  prescriptionText,
  onTypeChange,
  onDataChange,
  onFileChange,
  onTextChange
}: PrescriptionFormStepProps) {
  const [openSection, setOpenSection] = useState<"none" | "manual" | "file" | "written">(selectedType);
  const [twoPdNumbers, setTwoPdNumbers] = useState(false);
  const [showCylInfoModal, setShowCylInfoModal] = useState(false);

  const odCylVal = Math.abs(parseFloat(data.od?.cyl || "0"));
  const osCylVal = Math.abs(parseFloat(data.os?.cyl || "0"));
  const isHighCyl = odCylVal >= 2.00 || osCylVal >= 2.00;

  useEffect(() => {
    setOpenSection(selectedType);
  }, [selectedType]);

  // Helper arrays for options
  const sphOptions = Array.from({ length: 65 }).map((_, i) => {
    const val = -10 + i * 0.25;
    return val === 0 ? "0.00" : val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
  });
  sphOptions.unshift("0.00");
  const uniqueSphOptions = Array.from(new Set(sphOptions));

  const cylOptions = Array.from({ length: 25 }).map((_, i) => {
    const val = -6 + i * 0.25;
    return val === 0 ? "0.00" : val.toFixed(2);
  });
  cylOptions.unshift("0.00");
  const uniqueCylOptions = Array.from(new Set(cylOptions));

  const axisOptions = Array.from({ length: 37 }).map((_, i) => String(i * 5));
  const addOptions = Array.from({ length: 13 }).map((_, i) => {
    const val = i * 0.25;
    return val === 0 ? "0.00" : `+${val.toFixed(2)}`;
  });

  const pdOptions = Array.from({ length: 35 }).map((_, i) => String(46 + i));
  const splitPdOptions = Array.from({ length: 35 }).map((_, i) => String(23.0 + i * 0.5));

  const handleFieldChange = (eye: "od" | "os", field: "sph" | "cyl" | "axis" | "add", val: string) => {
    const nextData = {
      ...data,
      [eye]: {
        ...data[eye],
        [field]: val
      }
    };
    onDataChange(nextData);
  };

  const handlePdChange = (val: string) => {
    onDataChange({
      ...data,
      pd: val
    });
  };

  const handlePdTwoChange = (eye: "od" | "os", val: string) => {
    onDataChange({
      ...data,
      pdTwo: {
        od: eye === "od" ? val : data.pdTwo?.od || "31.5",
        os: eye === "os" ? val : data.pdTwo?.os || "31.5"
      }
    });
  };

  const toggleSection = (section: "manual" | "file" | "written") => {
    const nextSection = openSection === section ? "none" : section;
    setOpenSection(nextSection);
    onTypeChange(nextSection);
  };

  const selectStyle = "w-full h-10 px-3.5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-xs font-semibold text-[color:var(--color-text-primary)] focus:border-[color:var(--color-brand-primary)] focus:ring-2 focus:ring-[color:var(--color-brand-primary)]/10 outline-none transition-all cursor-pointer";

  return (
    <div className="flex flex-col gap-4">
      {/* Permanent High CYL (>= 2.00) Price Warning Banner */}
      <div className={cn(
        "rounded-2xl border p-4 text-xs transition-all",
        isHighCyl
          ? "border-amber-500/60 bg-amber-500/15 text-amber-900 shadow-md ring-2 ring-amber-500/30"
          : "border-amber-500/30 bg-amber-500/10 text-amber-900"
      )}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 text-xs sm:text-sm">
                {isHighCyl ? "⚠️ High Cylinder Power (±2.00+) Selected" : "Notice: Cylinder (CYL) Power & Pricing"}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-amber-900/90">
                Cylinder (CYL) sizes of 2.00 or higher can have varying prices because glasses with a cylinder power of 2.00 or greater require specialized high-index custom optical surfacing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCylInfoModal(true)}
            className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold text-amber-900 hover:underline bg-amber-500/25 px-3 py-1.5 rounded-xl border border-amber-500/40 transition-all hover:bg-amber-500/40 shadow-xs"
          >
            <Info className="h-3.5 w-3.5 text-amber-700" /> Why is that?
          </button>
        </div>
      </div>

      {/* 1. MANUAL ENTRY ACCORDION */}
      <div className={cn(
        "rounded-2xl border transition-all overflow-hidden",
        openSection === "manual" 
          ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface)] shadow-sm" 
          : "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]",
        selectedType === "none" && "opacity-50 hover:opacity-100 hover:border-[color:var(--color-text-secondary)]"
      )}>
        <button
          type="button"
          onClick={() => toggleSection("manual")}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div>
            <p className="text-sm font-bold text-[color:var(--color-text-primary)]">Enter Eyekey / Manual Prescription</p>
            <p className="text-[11px] text-[color:var(--color-text-secondary)] mt-0.5">Fill SPH, CYL, Axis & PD numbers manually</p>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-[color:var(--color-text-tertiary)] transition-transform", openSection === "manual" && "rotate-180")} />
        </button>

        <AnimatePresence>
          {openSection === "manual" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1 border-t border-[color:var(--color-border)]">
                <div className="space-y-4">
                  {/* OD (Right Eye) Row */}
                  <div>
                    <h4 className="text-xs font-bold text-[color:var(--color-brand-primary)] mb-2">OD (Right Eye)</h4>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider mb-1">SPH</label>
                        <select
                          value={data.od.sph}
                          onChange={(e) => handleFieldChange("od", "sph", e.target.value)}
                          className={selectStyle}
                        >
                          {uniqueSphOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider mb-1">CYL</label>
                        <select
                          value={data.od.cyl}
                          onChange={(e) => handleFieldChange("od", "cyl", e.target.value)}
                          className={selectStyle}
                        >
                          {uniqueCylOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider mb-1">Axis</label>
                        <select
                          value={data.od.axis}
                          onChange={(e) => handleFieldChange("od", "axis", e.target.value)}
                          className={selectStyle}
                        >
                          <option value="">None</option>
                          {axisOptions.map((v) => <option key={v} value={v}>{v}°</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider mb-1">ADD</label>
                        <select
                          value={data.od.add}
                          onChange={(e) => handleFieldChange("od", "add", e.target.value)}
                          className={selectStyle}
                        >
                          <option value="">None</option>
                          {addOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* OS (Left Eye) Row */}
                  <div>
                    <h4 className="text-xs font-bold text-[color:var(--color-brand-primary)] mb-2">OS (Left Eye)</h4>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider mb-1">SPH</label>
                        <select
                          value={data.os.sph}
                          onChange={(e) => handleFieldChange("os", "sph", e.target.value)}
                          className={selectStyle}
                        >
                          {uniqueSphOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider mb-1">CYL</label>
                        <select
                          value={data.os.cyl}
                          onChange={(e) => handleFieldChange("os", "cyl", e.target.value)}
                          className={selectStyle}
                        >
                          {uniqueCylOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider mb-1">Axis</label>
                        <select
                          value={data.os.axis}
                          onChange={(e) => handleFieldChange("os", "axis", e.target.value)}
                          className={selectStyle}
                        >
                          <option value="">None</option>
                          {axisOptions.map((v) => <option key={v} value={v}>{v}°</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider mb-1">ADD</label>
                        <select
                          value={data.os.add}
                          onChange={(e) => handleFieldChange("os", "add", e.target.value)}
                          className={selectStyle}
                        >
                          <option value="">None</option>
                          {addOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* PD Section */}
                  <div className="border-t border-[color:var(--color-border)] pt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[color:var(--color-text-primary)]">Pupillary Distance (PD)</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          id="twoPdNumbers"
                          checked={twoPdNumbers}
                          onChange={(e) => {
                            setTwoPdNumbers(e.target.checked);
                            if (e.target.checked) {
                              onDataChange({
                                ...data,
                                pdTwo: { od: "31.5", os: "31.5" }
                              });
                            } else {
                              onDataChange({
                                ...data,
                                pdTwo: undefined
                              });
                            }
                          }}
                          className="rounded border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-[color:var(--color-brand-primary)] focus:ring-[color:var(--color-brand-primary)]"
                        />
                        <label htmlFor="twoPdNumbers" className="text-[11px] font-semibold text-[color:var(--color-text-secondary)]">I have two PD numbers</label>
                      </div>
                    </div>

                    <div className="mt-3">
                      {!twoPdNumbers ? (
                        <div className="w-1/2">
                          <label className="block text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider mb-1">Single PD</label>
                          <select
                            value={data.pd}
                            onChange={(e) => handlePdChange(e.target.value)}
                            className={selectStyle}
                          >
                            {pdOptions.map((v) => <option key={v} value={v}>{v} mm</option>)}
                          </select>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider mb-1">Right Eye (OD)</label>
                            <select
                              value={data.pdTwo?.od || "31.5"}
                              onChange={(e) => handlePdTwoChange("od", e.target.value)}
                              className={selectStyle}
                            >
                              {splitPdOptions.map((v) => <option key={v} value={v}>{v} mm</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider mb-1">Left Eye (OS)</label>
                            <select
                              value={data.pdTwo?.os || "31.5"}
                              onChange={(e) => handlePdTwoChange("os", e.target.value)}
                              className={selectStyle}
                            >
                              {splitPdOptions.map((v) => <option key={v} value={v}>{v} mm</option>)}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. UPLOAD ACCORDION */}
      <div className={cn(
        "rounded-2xl border transition-all overflow-hidden",
        openSection === "file" ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface)] shadow-sm" : "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]",
        selectedType === "none" && "opacity-50 hover:opacity-100 hover:border-[color:var(--color-text-secondary)]"
      )}>
        <button
          type="button"
          onClick={() => toggleSection("file")}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div>
            <p className="text-sm font-bold text-[color:var(--color-text-primary)]">Upload Prescription Photo</p>
            <p className="text-[11px] text-[color:var(--color-text-secondary)] mt-0.5">Drag-and-drop or upload a file</p>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-[color:var(--color-text-tertiary)] transition-transform", openSection === "file" && "rotate-180")} />
        </button>

        <AnimatePresence>
          {openSection === "file" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1 border-t border-[color:var(--color-border)]">
                <GenericDragDropUpload
                  selectedFile={prescriptionFile}
                  onFileSelect={onFileChange}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. WRITTEN TEXT ACCORDION */}
      <div className={cn(
        "rounded-2xl border transition-all overflow-hidden",
        openSection === "written" ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface)] shadow-sm" : "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]",
        selectedType === "none" && "opacity-50 hover:opacity-100 hover:border-[color:var(--color-text-secondary)]"
      )}>
        <button
          type="button"
          onClick={() => toggleSection("written")}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div>
            <p className="text-sm font-bold text-[color:var(--color-text-primary)]">Write Eyesight Details</p>
            <p className="text-[11px] text-[color:var(--color-text-secondary)] mt-0.5">Type your prescription details here</p>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-[color:var(--color-text-tertiary)] transition-transform", openSection === "written" && "rotate-180")} />
        </button>

        <AnimatePresence>
          {openSection === "written" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1 border-t border-[color:var(--color-border)]">
                <textarea
                  value={prescriptionText}
                  onChange={(e) => onTextChange(e.target.value)}
                  placeholder="e.g. SPH OD: -2.25, SPH OS: -2.50, CYL OD: -0.50, Axis: 95..."
                  rows={4}
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-xs font-semibold text-[color:var(--color-text-primary)] placeholder-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-brand-primary)] focus:ring-2 focus:ring-[color:var(--color-brand-primary)]/10 outline-none transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* High CYL Information Modal */}
      {showCylInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-3">
              <div className="flex items-center gap-2 text-amber-600">
                <Info className="h-5 w-5" />
                <h3 className="font-display text-base font-bold text-[color:var(--color-text-primary)]">Why High CYL Lenses Vary in Price?</h3>
              </div>
              <button type="button" onClick={() => setShowCylInfoModal(false)}>
                <X className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
              <p>
                <strong>Astigmatism Correction:</strong> A Cylinder (CYL) value of <strong>2.00 or higher</strong> indicates significant astigmatism, meaning your eyes require asymmetrical light bending across perpendicular axes.
              </p>
              <p>
                <strong>Lens Thickness & Edge Surfacing:</strong> Standard stock optical lenses become <em>very thick at the edges</em> when cut to a high cylinder power of 2.00+.
              </p>
              <p>
                <strong>High-Index Custom Manufacturing:</strong> To prevent heavy, thick "coca-cola bottle" lenses and ensure lightweight comfort, high-cylinder glasses require specialized 1.61, 1.67, or 1.74 high-index custom optical surfacing and edge-thinning processes. Our opticians will verify your frame and select the optimal thin lens option.
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowCylInfoModal(false)}
                className="rounded-xl bg-[color:var(--color-brand-primary)] px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity"
              >
                Understood
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
