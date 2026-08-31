"use client";

import { useActionState } from "react";
import { savePageImages } from "@/actions/admin/content";
import { IDLE } from "@/lib/form";
import { PAGE_IMAGE_SLOTS } from "@/lib/page-images";
import { MediaPicker } from "@/components/admin/MediaPicker";
import SubmitButton from "@/components/forms/SubmitButton";
import FormMessage from "@/components/forms/FormMessage";
import type { PageImageMap } from "@/lib/types";

export default function PageImagesForm({ images }: { images: PageImageMap }) {
  const [state, action] = useActionState(savePageImages, IDLE);
  return (
    <form action={action} className="admin-form">
      {PAGE_IMAGE_SLOTS.map((s) => (
        <div className="panel" key={s.slot}>
          <h2>{s.label}</h2>
          <p className="hint" style={{ marginTop: 0 }}>
            {s.hint}
          </p>
          <MediaPicker
            name={`url:${s.slot}`}
            defaultValue={images[s.slot]?.url ?? ""}
          />
          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor={`alt:${s.slot}`}>Alt text (describe the image)</label>
            <input
              id={`alt:${s.slot}`}
              name={`alt:${s.slot}`}
              defaultValue={images[s.slot]?.alt ?? ""}
            />
          </div>
        </div>
      ))}
      <div className="inline-actions">
        <SubmitButton className="btn btn--primary">Save page images</SubmitButton>
      </div>
      <FormMessage state={state} />
    </form>
  );
}
