
import React, { useCallback, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

// Define allowed file types and max file size (5MB)
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png"
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// File extensions for user display
const ALLOWED_EXTENSIONS = ["PDF", "DOCX", "PNG"];

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = useCallback(
    (selectedFile: File | null) => {
      if (!selectedFile) {
        setFile(null);
        setPreview(null);
        onFileChange(null);
        return;
      }

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: `Please upload a ${ALLOWED_EXTENSIONS.join(", ")} file.`,
          variant: "destructive",
        });
        return;
      }

      // Validate file size
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Set file and create preview if it's an image
      setFile(selectedFile);
      onFileChange(selectedFile);

      if (selectedFile.type === "image/png") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    },
    [onFileChange, toast]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileChange(selectedFile);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0] || null;
    handleFileChange(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    onFileChange(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-colors duration-200 text-center ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-soft-blue rounded-full">
              <Upload size={32} className="text-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Drag and drop your file here</h3>
              <p className="text-sm text-muted-foreground">
                or click to browse from your computer
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: {ALLOWED_EXTENSIONS.join(", ")} (max 5MB)
              </p>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                Select File
              </Button>
              <input
                type="file"
                id="file-input"
                className="hidden"
                onChange={handleInputChange}
                accept=".pdf,.docx,.png"
              />
            </div>
          </div>
        </div>
      ) : (
        <FilePreview 
          file={file} 
          preview={preview} 
          onRemove={removeFile} 
          onReplace={() => document.getElementById("file-input")?.click()} 
        />
      )}

      {/* Hidden input for file selection */}
      <input
        type="file"
        id="file-input"
        className="hidden"
        onChange={handleInputChange}
        accept=".pdf,.docx,.png"
      />
    </div>
  );
};

interface FilePreviewProps {
  file: File;
  preview: string | null;
  onRemove: () => void;
  onReplace: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ 
  file, 
  preview, 
  onRemove, 
  onReplace 
}) => {
  // Get file extension for icon display
  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || "";
  };

  const fileExtension = getFileExtension(file.name);
  
  // Format file size
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-card shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {preview ? (
            <div className="h-16 w-16 rounded-md overflow-hidden">
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-16 w-16 flex items-center justify-center bg-soft-gray rounded-md">
              <span className="text-lg font-bold">{fileExtension}</span>
            </div>
          )}
          <div>
            <h4 className="text-base font-medium text-foreground line-clamp-1">{file.name}</h4>
            <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
        </div>

        <button
          onClick={onRemove}
          className="p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="Remove file"
        >
          <X size={18} className="text-muted-foreground" />
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={onReplace}>
          Replace
        </Button>
        <Button variant="destructive" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
