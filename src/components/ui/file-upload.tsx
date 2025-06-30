"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, AlertCircle } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value: (File | string)[];
  onChange: (files: (File | string)[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
  error?: string;
}

export function FileUpload({
  value = [],
  onChange,
  accept = "image/*",
  maxFiles = 5,
  maxSize = 5,
  className,
  disabled = false,
  error,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "File phải là ảnh";
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `Kích thước file phải nhỏ hơn ${maxSize}MB`;
    }
    return null;
  };

  const handleFiles = useCallback(
    (files: FileList) => {
      setUploadErrors([]);
      const newErrors: string[] = [];
      const validFiles: File[] = [];

      Array.from(files).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (value.length + validFiles.length > maxFiles) {
        newErrors.push(`Số lượng file tối đa là ${maxFiles}`);
        setUploadErrors(newErrors);
        return;
      }

      if (newErrors.length > 0) {
        setUploadErrors(newErrors);
        return;
      }

      onChange([...value, ...validFiles]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, onChange, maxFiles, maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files?.length) {
        handleFiles(files);
      }
    },
    [disabled, handleFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setDragActive(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files?.length) {
        handleFiles(files);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = value.filter((_, i) => i !== index);
      onChange(newFiles);
    },
    [value, onChange]
  );

  const getPreviewUrl = (file: File | string): string => {
    if (typeof file === "string") {
      return file;
    }
    return URL.createObjectURL(file);
  };

  const getFileName = (file: File | string): string => {
    if (typeof file === "string") {
      return file.split("/").pop() || "Image URL";
    }
    return file.name;
  };

  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      value.forEach((file) => {
        if (file instanceof File) {
          URL.revokeObjectURL(getPreviewUrl(file));
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasError = error || uploadErrors.length > 0;

  return (
    <div className={cn("w-full", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : hasError
            ? "border-red-300 bg-red-50/50"
            : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="text-center">
          <Upload
            className={cn(
              "mx-auto h-12 w-12",
              hasError ? "text-red-400" : "text-gray-400"
            )}
          />
          <div className="mt-2">
            <p
              className={cn(
                "text-sm",
                hasError ? "text-red-600" : "text-gray-600"
              )}
            >
              <span className="font-medium text-primary">Nhấn để tải lên</span>{" "}
              hoặc kéo thả
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF tối đa {maxSize}MB (tối đa {maxFiles} file)
            </p>
            {value.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {value.length} trong số {maxFiles} file đã chọn
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {uploadErrors.length > 0 && (
        <div className="mt-2 space-y-1">
          {uploadErrors.map((uploadError, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-red-600"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{uploadError}</span>
            </div>
          ))}
        </div>
      )}

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Ảnh đã chọn ({value.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {value.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getPreviewUrl(file)}
                    alt={getFileName(file)}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Handle broken images
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDMuOTk5OThMMy4wMDAwMSAyMS45OTk4IiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMy4wMDAwMSAzLjk5OTk4TDIxIDIxLjk5OTgiIHN0cm9rZT0iI2NjYyIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=";
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
                <p className="mt-1 text-xs text-gray-500 truncate">
                  {getFileName(file)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
