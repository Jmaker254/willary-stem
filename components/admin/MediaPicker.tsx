"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import MediaUpload, { type Uploaded } from "./MediaUpload";
import { isVideoUrl } from "@/lib/media";

function Preview({ url }: { url: string }) {
  if (!url) return null;
  return isVideoUrl(url) ? (
    <video className="media-thumb" src={url} muted playsInline />
  ) : (
    <img className="media-thumb" src={url} alt="" />
  );
}

/** Single image/video URL with an upload helper. */
export function MediaPicker({
  name,
  defaultValue = "",
  accept = "image/*,video/*",
}: {
  name: string;
  defaultValue?: string;
  accept?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="media-picker">
      <input
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="https://…  (or upload below)"
      />
      <div className="media-picker-row">
        <Preview url={value} />
        <MediaUpload
          accept={accept}
          label="Upload"
          onUploaded={(f: Uploaded) => setValue(f.url)}
        />
        {value && (
          <button type="button" className="btn-link" onClick={() => setValue("")}>
            clear
          </button>
        )}
      </div>
    </div>
  );
}

/** Ordered list of image/video URLs (used for the past-event slideshow). */
export function MediaListPicker({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [items, setItems] = useState<string[]>(
    defaultValue
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean),
  );

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };

  return (
    <div className="media-picker">
      <textarea name={name} hidden readOnly value={items.join("\n")} />
      <MediaUpload
        accept="image/*,video/*"
        label="Add photos / videos"
        multiple
        onUploaded={(f: Uploaded) => setItems((cur) => [...cur, f.url])}
      />
      {items.length > 0 && (
        <ul className="media-list">
          {items.map((url, i) => (
            <li key={`${i}-${url}`}>
              <Preview url={url} />
              <input
                value={url}
                onChange={(e) =>
                  setItems((cur) => cur.map((u, k) => (k === i ? e.target.value : u)))
                }
              />
              <span className="inline-actions">
                <button type="button" className="btn-link" onClick={() => move(i, -1)}>
                  ▲
                </button>
                <button type="button" className="btn-link" onClick={() => move(i, 1)}>
                  ▼
                </button>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setItems((cur) => cur.filter((_, k) => k !== i))}
                >
                  remove
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
