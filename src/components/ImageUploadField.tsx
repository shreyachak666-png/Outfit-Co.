"use client";

import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";

export default function ImageUploadField({
  name = "image",
  existingImageUrl,
  required = false,
}: {
  name?: string;
  existingImageUrl?: string | null;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existingImageUrl ?? null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    setError(null);
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    setIsCompressing(true);
    try {
      // Compress/resize large phone photos client-side before upload,
      // so the site stays fast without any manual optimisation step.
      const compressed = await imageCompression(file, {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
        fileType: file.type,
      });

      const namedFile = new File([compressed], file.name, {
        type: compressed.type,
      });

      // Push the compressed file back into the real <input type="file">
      // so it's the one included when the form is submitted.
      if (inputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(namedFile);
        inputRef.current.files = dataTransfer.files;
      }

      setPreview(URL.createObjectURL(namedFile));
    } catch (err) {
      console.error(err);
      setError("Couldn't process that image — try a different file.");
    } finally {
      setIsCompressing(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl2 border-2 border-dashed border-beige bg-soft-white transition-colors hover:border-burgundy/50"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Outfit preview"
            className="max-h-[420px] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="text-2xl">📷</span>
            <span className="text-sm text-chocolate/60">
              Click to upload, or drag an image here
            </span>
            <span className="text-xs text-chocolate/35">
              JPG or PNG, from your computer or phone
            </span>
          </div>
        )}

        {preview && (
          <div className="absolute inset-0 flex items-center justify-center bg-chocolate/0 text-sm font-medium text-ivory opacity-0 transition-opacity group-hover:bg-chocolate/40 group-hover:opacity-100">
            Change image
          </div>
        )}

        {isCompressing && (
          <div className="absolute inset-0 flex items-center justify-center bg-ivory/80 text-sm text-chocolate">
            Optimising image…
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="mt-2 text-xs text-burgundy">{error}</p>}
      {!error && existingImageUrl && (
        <p className="mt-2 text-xs text-chocolate/40">
          Uploading a new image will replace the current one.
        </p>
      )}
    </div>
  );
}
