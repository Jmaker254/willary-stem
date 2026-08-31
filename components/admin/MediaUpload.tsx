"use client";

import { useRef, useState } from "react";

export interface Uploaded {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  filename: string;
}

export default function MediaUpload({
  accept = "image/*,video/*",
  label = "Upload file",
  multiple = false,
  onUploaded,
}: {
  accept?: string;
  label?: string;
  multiple?: boolean;
  onUploaded: (file: Uploaded) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  async function send(files: FileList | File[]) {
    setError(null);
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/admin/media/upload", { method: "POST", body });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Upload failed");
        onUploaded(json as Uploaded);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div
        className={`dropzone${drag ? " is-drag" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files.length) send(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={(e) => e.target.files && e.target.files.length && send(e.target.files)}
        />
        {busy ? "Uploading…" : drag ? "Drop to upload" : `${label} — click or drag & drop`}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
