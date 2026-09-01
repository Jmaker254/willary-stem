/**
 * Fixed image slots on otherwise-static pages, editable from
 * /admin/images. Each `slot` maps to a `PageImage` row.
 */
export const PAGE_IMAGE_SLOTS: { slot: string; label: string; hint: string }[] = [
  { slot: "home_hero", label: "Home — hero background, slide 1", hint: "Full-screen rotating background behind the tagline. Set 2–4 slides for it to cycle; one alone still works as a static background." },
  { slot: "home_hero_2", label: "Home — hero background, slide 2 (optional)", hint: "Leave empty to skip." },
  { slot: "home_hero_3", label: "Home — hero background, slide 3 (optional)", hint: "Leave empty to skip." },
  { slot: "home_hero_4", label: "Home — hero background, slide 4 (optional)", hint: "Leave empty to skip." },
  { slot: "home_philosophy", label: "Home — approach section", hint: "A reverse-engineering / hands-on session." },
  { slot: "about_hero", label: "About — hero banner background", hint: "Wide shot — team, workspace, or an event. Sits behind the dark page-hero banner." },
  { slot: "about_founder", label: "About — founder & workbench", hint: "William at the bench, or the workspace." },
  { slot: "programs_hero", label: "Programs — hero banner background", hint: "Wide shot of a class in session. Sits behind the dark page-hero banner (text stays white over a dark overlay)." },
  { slot: "programs_offer_bg", label: "Programs — 'what we offer' background", hint: "Wide workshop shot. Sits behind the programs grid." },
  { slot: "lab_hero", label: "Lab — hero banner background", hint: "Upload an image, or a short looping video/clip of a robot in motion — it autoplays muted behind the banner text." },
  { slot: "events_hero", label: "Events — hero banner background", hint: "Wide event photo (Coffee & Solder, WRO). Sits behind the dark page-hero banner." },
  { slot: "impact_hero", label: "Impact — hero banner background", hint: "Wide photo from a community robot visit. Sits behind the dark page-hero banner." },
  { slot: "buildfest_hero", label: "BuildFest — hero (when no poster set)", hint: "Used only if the BuildFest event has no full-screen poster." },
  { slot: "buildfest_cleaner", label: "BuildFest — 'a cleaner Nairobi'", hint: "Environment / clean-tech image for the challenge section." },
  { slot: "buildfest_exhibitor_bg", label: "BuildFest — exhibitor section background", hint: "Wide shot of exhibitor booths / a busy hall." },
  { slot: "contact_map", label: "Contact — map / location", hint: "A map screenshot or a photo of the area." },
];

export const PAGE_IMAGE_SLOT_KEYS = PAGE_IMAGE_SLOTS.map((s) => s.slot);
