/**
 * Fixed image slots on otherwise-static pages, editable from
 * /admin/images. Each `slot` maps to a `PageImage` row.
 */
export const PAGE_IMAGE_SLOTS: { slot: string; label: string; hint: string }[] = [
  { slot: "home_hero", label: "Home — hero image", hint: "Tall portrait. Students building / a workshop scene." },
  { slot: "home_philosophy", label: "Home — approach section", hint: "A reverse-engineering / hands-on session." },
  { slot: "about_founder", label: "About — founder & workbench", hint: "William at the bench, or the workspace." },
  { slot: "programs_hero", label: "Programs — hero image", hint: "A class in session — coding or robotics." },
  { slot: "programs_offer_bg", label: "Programs — 'what we offer' background", hint: "Wide workshop shot. Sits behind the programs grid." },
  { slot: "buildfest_hero", label: "BuildFest — hero (when no poster set)", hint: "Used only if the BuildFest event has no full-screen poster." },
  { slot: "buildfest_cleaner", label: "BuildFest — 'a cleaner Nairobi'", hint: "Environment / clean-tech image for the challenge section." },
  { slot: "buildfest_exhibitor_bg", label: "BuildFest — exhibitor section background", hint: "Wide shot of exhibitor booths / a busy hall." },
  { slot: "contact_map", label: "Contact — map / location", hint: "A map screenshot or a photo of the area." },
];

export const PAGE_IMAGE_SLOT_KEYS = PAGE_IMAGE_SLOTS.map((s) => s.slot);
