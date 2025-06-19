import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { Controller, Control, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useEffect, useState, useCallback, useMemo } from "react";

interface ImageUploaderProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  label: string;
  name?: string;
  maxFiles?: number;
  existingImages?: string[];
  disabled?: boolean;
}

interface ImagePreview {
  url: string;
  isFile: boolean;
  file?: File;
}

const ImageUploader = ({
  control,
  errors,
  watch,
  setValue,
  label,
  name = "images",
  maxFiles = 10,
  existingImages = [],
  disabled = false,
}: ImageUploaderProps) => {
  const watchedImages = watch(name) || [];
  const [previews, setPreviews] = useState<ImagePreview[]>([]);

  // Memoize the preview generation logic to prevent unnecessary recalculations
  const generatedPreviews = useMemo(() => {
    const newPreviews: ImagePreview[] = [];

    // Add existing images (URLs from server)
    if (existingImages.length > 0) {
      existingImages.forEach(url => {
        if (url && typeof url === 'string' && url.trim() !== '') {
          newPreviews.push({ url, isFile: false });
        }
      });
    }

    // Add file previews
    if (watchedImages.length > 0) {
      watchedImages.forEach((item: any) => {
        if (item instanceof File) {
          const url = URL.createObjectURL(item);
          newPreviews.push({ url, isFile: true, file: item });
        } else if (typeof item === 'string' && item.trim() !== '') {
          // Handle string URLs that might be in the form data
          newPreviews.push({ url: item, isFile: false });
        }
      });
    }

    return newPreviews;
  }, [watchedImages, existingImages]);

  // Update previews only when the generated previews actually change
  useEffect(() => {
    // Check if previews have actually changed to prevent unnecessary updates
    const previewsChanged =
      generatedPreviews.length !== previews.length ||
      generatedPreviews.some((preview, index) =>
        previews[index]?.url !== preview.url ||
        previews[index]?.isFile !== preview.isFile
      );

    if (previewsChanged) {
      // Cleanup old blob URLs before setting new previews
      previews.forEach(preview => {
        if (preview.isFile && preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url);
        }
      });

      setPreviews(generatedPreviews);
    }

    // Cleanup function for blob URLs when component unmounts
    return () => {
      generatedPreviews.forEach(preview => {
        if (preview.isFile && preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [generatedPreviews]); // Only depend on the memoized previews

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const currentImages = watchedImages || [];
    const remainingSlots = maxFiles - currentImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length < files.length) {
      alert(`Only ${remainingSlots} more files can be added. Maximum ${maxFiles} files allowed.`);
    }

    setValue(name, [...currentImages, ...filesToAdd]);

    // Clear the input
    e.target.value = '';
  }, [watchedImages, setValue, name, maxFiles]);

  const removeImage = useCallback((index: number) => {
    const currentImages = [...(watchedImages || [])];
    const preview = previews[index];

    // Revoke blob URL if it's a file
    if (preview?.isFile && preview.url.startsWith('blob:')) {
      URL.revokeObjectURL(preview.url);
    }

    currentImages.splice(index, 1);
    setValue(name, currentImages);
  }, [watchedImages, previews, setValue, name]);

  const canAddMore = previews.length < maxFiles;
  const errorMessage = errors[name]?.message as string;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {maxFiles > 1 && (
          <span className="text-gray-500 text-xs ml-1">
            ({previews.length}/{maxFiles})
          </span>
        )}
      </label>

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {previews.map((preview, index) => (
            <div
              key={`${preview.url}-${index}`}
              className="relative group aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Image
                src={preview.url}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={disabled}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Remove image"
              >
                <Trash2 size={14} />
              </button>

              {/* File indicator */}
              {preview.isFile && (
                <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                  New
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* File Input */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              multiple={maxFiles > 1}
              onChange={handleFileUpload}
              disabled={disabled || !canAddMore}
              className="hidden"
              id={`file-input-${name}`}
            />
            <label
              htmlFor={`file-input-${name}`}
              className={`
                flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${disabled || !canAddMore
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                }
              `}
            >
              <Upload size={24} className={disabled || !canAddMore ? 'text-gray-400' : 'text-gray-500'} />
              <p className={`mt-2 text-sm ${disabled || !canAddMore ? 'text-gray-400' : 'text-gray-600'}`}>
                {!canAddMore
                  ? `Maximum ${maxFiles} files reached`
                  : 'Click to upload images or drag and drop'
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB each
              </p>
            </label>
          </div>
        )}
      />

      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <span className="text-red-500">⚠</span>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;