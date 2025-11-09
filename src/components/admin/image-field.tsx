"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";

interface ImageFieldProps {
  name: string;
  label: string;
  initialValue?: string | null;
  helperText?: string;
}

export function ImageField({ name, label, initialValue, helperText }: ImageFieldProps) {
  const [preview, setPreview] = useState<string>(initialValue ?? "");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setPreview(dataUrl);
  }

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor={`${name}-file`}>
        {label}
      </label>
      {preview ? (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <Image
            src={preview}
            alt={label}
            width={600}
            height={320}
            className="h-40 w-full object-cover"
            unoptimized={preview.startsWith("data:")}
          />
        </div>
      ) : null}
      <input
        id={`${name}-file`}
        type="file"
        name={`${name}-file`}
        accept="image/*"
        onChange={handleFileChange}
        className="w-full text-sm text-slate-200"
      />
      {helperText ? <p className="text-xs text-slate-400">{helperText}</p> : null}
      <input type="hidden" name={name} value={preview} />
    </div>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
