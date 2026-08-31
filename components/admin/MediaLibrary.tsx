"use client";

/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import { useState } from "react";
import MediaUpload from "./MediaUpload";
import { deleteMedia } from "@/actions/admin/media";

export interface Asset {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  filename: string;
  size: number;
  createdAt: string;
}

export default function MediaLibrary({ assets }: { assets: Asset[] }) {
  const router = useRouter();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (url: string) => {
    const full =
      url.startsWith("http") || typeof window === "undefined"
        ? url
        : window.location.origin + url;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <div className="panel">
        <h2>Upload</h2>
        <MediaUpload
          multiple
          label="Add images or videos"
          onUploaded={() => router.refresh()}
        />
        <p className="hint">
          Images up to 8&nbsp;MB, videos up to 64&nbsp;MB. In production, set
          <code> BLOB_READ_WRITE_TOKEN</code> so uploads go to Vercel Blob.
        </p>
      </div>

      <div className="panel">
        <h2>Library ({assets.length})</h2>
        {assets.length === 0 ? (
          <p>Nothing uploaded yet.</p>
        ) : (
          <div className="media-grid">
            {assets.map((a) => (
              <figure className="media-tile" key={a.id}>
                {a.type === "VIDEO" ? (
                  <video src={a.url} muted playsInline />
                ) : (
                  <img src={a.url} alt={a.filename} />
                )}
                <figcaption>
                  <span className="media-name" title={a.filename}>
                    {a.filename}
                  </span>
                  <span className="inline-actions">
                    <button className="btn-link" type="button" onClick={() => copy(a.url)}>
                      {copied === a.url ? "copied!" : "copy URL"}
                    </button>
                    <form
                      action={async () => {
                        await deleteMedia(a.id);
                        router.refresh();
                      }}
                    >
                      <button
                        className="btn-link"
                        type="submit"
                        onClick={(e) => {
                          if (!confirm("Delete this file?")) e.preventDefault();
                        }}
                      >
                        delete
                      </button>
                    </form>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
