import React, { useState, useRef } from "react";
import { Upload, X, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenericDragDropUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  maxSizeMB?: number;
  className?: string;
}

export function GenericDragDropUpload({
  onFileSelect,
  selectedFile,
  maxSizeMB = 10,
  className
}: GenericDragDropUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
      file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
    if (isHeic) {
      console.warn('HEIC format detected - will be auto-converted to JPEG on upload');
    }
    // Check if image
    if (!file.type.startsWith("image/") && !isHeic) {
      alert("Only image files are supported (JPG, PNG, WebP, HEIC).");
      return;
    }
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    onFileSelect(file);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />

      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer",
            isDragActive
              ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]/5"
              : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:border-[color:var(--color-text-secondary)]"
          )}
        >
          <Upload className="h-8 w-8 text-[color:var(--color-text-tertiary)] mb-2" />
          <p className="text-xs font-semibold text-[color:var(--color-text-primary)]">
            Drag & drop prescription photo here, or <span className="text-[color:var(--color-brand-primary)] hover:underline">browse</span>
          </p>
          <p className="text-[10px] text-[color:var(--color-text-tertiary)] mt-1.5">
            Supports JPG, PNG, WebP (Max {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-brand-primary)]/10 text-[color:var(--color-brand-primary)]">
            <FileImage className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[color:var(--color-text-primary)] truncate">
              {selectedFile.name}
            </p>
            <p className="text-[10px] text-[color:var(--color-text-secondary)] mt-0.5">
              {formatBytes(selectedFile.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[color:var(--color-border)] transition-colors text-[color:var(--color-text-secondary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
