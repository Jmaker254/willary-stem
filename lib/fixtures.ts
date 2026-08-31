import type {
  Project,
  SiteEvent,
  CommunityVisit,
  School,
  SponsorTier,
  SiteStat,
  SiteSettings,
  TeamMember,
  Testimonial,
  Partner,
  Post,
  Cohort,
} from "./types";

/**
 * Seed / fallback content. Used by lib/content.ts when a table is empty, and by
 * prisma/seed.ts to populate the database. Keep this the single source of the
 * initial copy.
 */

export const SETTINGS: SiteSettings = {
  siteName: "Willary STEM",
  tagline: "Building Problem-Solvers, Not Certificate Holders",
  phone: "0796 815 446",
  email: "willarystemrobotics@gmail.com",
  location: "Nairobi, Kenya",
  regNo: "BN-J9S6M6VR",
  announceText:
    "Willary BuildFest 2026 — Building a Cleaner Future · Sat 21 November · Nairobi",
  announceLink: "/build-fest",
  announceLinkLabel: "See the 8 tracks & register →",
  buildFestDate: "Saturday, 21 November 2026",
  buildFestCapacity: 300,
  buildFestTime: "8:00 AM – 5:30 PM",
  buildFestVenue: "Nairobi, Kenya — university venue to be confirmed",
  buildFestTicketKes: "500",
  logoUrl: "",
  photosAlbumUrl: "",
  social: {
    tiktok: "https://www.tiktok.com/@willarystemrobotics1",
    instagram: "https://www.instagram.com/willarystemrobotics1",
    linkedin: "",
    youtube: "",
    x: "",
    facebook: "",
  },
};

export const STATS: SiteStat[] = [
  { key: "schools", num: "6+", label: "Schools & academies reached", group: "home", order: 1 },
  { key: "children_first", num: "66", label: "Children at first community visit", group: "home", order: 2 },
  { key: "coffee_solder_signups", num: "267", label: "Coffee & Solder sign-ups (Edition I)", group: "home", order: 3 },
  { key: "build_fest_target", num: "150–300+", label: "BuildFest 2026 participants expected", group: "home", order: 4 },
  { key: "schools_about", num: "6+", label: "Schools & academies", group: "about", order: 1 },
  { key: "children_about", num: "66", label: "Children at first robot visit", group: "about", order: 2 },
  { key: "signups_about", num: "267", label: "Coffee & Solder sign-ups", group: "about", order: 3 },
  { key: "wro_about", num: "150–200", label: "WRO Nairobi attendees", group: "about", order: 4 },
  { key: "schools_partner", num: "6+", label: "Schools & academies", group: "partner", order: 1 },
  { key: "children_partner", num: "66 → 1,000+", label: "Children reached & goal", group: "partner", order: 2 },
  { key: "events_partner", num: "3", label: "Event series", group: "partner", order: 3 },
  { key: "target_partner", num: "150–300+", label: "BuildFest 2026 participants", group: "partner", order: 4 },
];

export const PROJECTS: Project[] = [
  {
    slug: "willarybot",
    title: "WillaryBot",
    category: "ROBOT",
    summary:
      "A WiFi-connected robot with Claude AI voice control and animated OLED “eyes”. Speak to it, and it reasons about the request and responds — a demonstration platform for conversational robotics on low-cost hardware.",
    tech: ["ESP32", "WiFi", "Claude AI voice control", "OLED animation"],
    featured: true,
    order: 1,
  },
  {
    slug: "willary-v3",
    title: "Willary V3",
    category: "ROBOT",
    summary:
      "A multi-robot platform using ESP-NOW for low-latency peer-to-peer communication and an onboard IMU for orientation — the base for swarm and coordinated-movement experiments.",
    tech: ["ESP-NOW swarm", "IMU", "Multi-robot"],
    featured: false,
    order: 2,
  },
  {
    slug: "shgr",
    title: "SHGR",
    category: "ROBOT",
    summary:
      "A line-following and maze-solving robot built together with a student as a World Robot Olympiad project — mentorship and competition engineering in one build.",
    tech: ["Line following", "Maze solving", "WRO project", "Student build"],
    featured: true,
    order: 3,
  },
  {
    slug: "follow-me-robot",
    title: "Follow-Me Robot",
    category: "ROBOT",
    summary:
      "A robot that tracks and follows a paired device over Bluetooth Low Energy — a compact demo of proximity sensing and motor control.",
    tech: ["BLE", "Proximity tracking", "Motor control"],
    featured: false,
    order: 4,
  },
  {
    slug: "willary-base-board",
    title: "WILLARY BASE BOARD",
    category: "PCB",
    summary:
      "An in-house carrier board that standardises the wiring for Willary robot and workshop builds — power, microcontroller, and I/O breakout on one designed PCB.",
    tech: ["PCB design", "Power & I/O", "Workshop-ready"],
    featured: false,
    order: 5,
  },
  {
    slug: "esp32-control-boards",
    title: "ESP32 Relay / MOSFET Control Boards",
    category: "PCB",
    summary:
      "Home-etched control boards pairing an ESP32 with relay and MOSFET switching for driving mains and DC loads — used across the IoT deployments.",
    tech: ["Home-etched", "Relay + MOSFET", "ESP32"],
    featured: false,
    order: 6,
  },
  {
    slug: "adano-farm-irrigation",
    title: "Adano Farm Smart Irrigation",
    category: "IOT",
    summary:
      "Sensor-driven irrigation deployed on a farm in Wajir. Exhibited at the Madaraka Day presidential exhibition.",
    tech: ["Wajir", "Presidential exhibition", "Soil & weather sensing"],
    featured: true,
    order: 7,
  },
  {
    slug: "vape-detection",
    title: "Vape Detection System",
    category: "IOT",
    summary:
      "Air-quality sensing that flags vaping in school washrooms, with a Firebase + Netlify dashboard. Deployed at St Mary’s Nairobi.",
    tech: ["Firebase", "Netlify dashboard", "St Mary’s Nairobi"],
    featured: true,
    order: 8,
  },
  {
    slug: "aquavend",
    title: "AquaVend",
    category: "IOT",
    summary:
      "RFID-based water vending — tap a card, dispense a measured volume, track balance and usage.",
    tech: ["RFID", "Metered dispensing"],
    featured: false,
    order: 9,
  },
  {
    slug: "securelock-sentinel",
    title: "SecureLock Sentinel",
    category: "IOT",
    summary:
      "GSM-connected door security that alerts and can be controlled remotely over the cellular network.",
    tech: ["GSM", "Remote alerts"],
    featured: false,
    order: 10,
  },
  {
    slug: "drought-monitoring",
    title: "Drought Monitoring Dashboard",
    category: "IOT",
    summary:
      "Field sensor data aggregated into a dashboard for tracking drought-relevant conditions over time.",
    tech: ["Sensor network", "Dashboard"],
    featured: false,
    order: 11,
  },
  {
    slug: "glucose-monitor",
    title: "Glucose Monitor",
    category: "IOT",
    summary:
      "A prototype glucose-monitoring build — exploring low-cost health sensing hardware.",
    tech: ["Health sensing", "Prototype"],
    featured: false,
    order: 12,
  },
];

export const EVENTS: SiteEvent[] = [
  {
    slug: "coffee-and-solder",
    title: "Coffee & Solder",
    dateText: "Monthly",
    status: "PAST",
    summary:
      "An informal monthly meetup for makers, students, and engineers — bring a project, a problem, or just turn up. Part show-and-tell, part workbench.",
    stats: [
      { num: "267", label: "Sign-ups, Edition I" },
      { num: "100+", label: "Attendees, Edition I" },
      { num: "Monthly", label: "Cadence" },
    ],
    photos: [],
    order: 1,
  },
  {
    slug: "wro-nairobi",
    title: "World Robot Competition — Nairobi",
    dateText: "Edition I complete",
    status: "PAST",
    summary:
      "A local robotics competition bringing student and hobbyist teams together to build, program, and race their robots against a shared challenge.",
    stats: [
      { num: "Edition I", label: "Complete" },
      { num: "150–200", label: "Attendees" },
    ],
    photos: [],
    order: 2,
  },
  {
    slug: "build-fest-2026",
    title: "Willary BuildFest 2026",
    dateText: "Sat 21 November 2026",
    status: "UPCOMING",
    summary:
      "Kenya's first multidisciplinary clean-technology innovation event. Students, engineers, developers, designers and entrepreneurs spend one day in one room answering a single challenge: how can technology help build a cleaner Kenya and Africa? Eight tracks, two levels, real solutions.",
    stats: [
      { num: "8", label: "Challenge tracks" },
      { num: "150–300+", label: "Participants" },
      { num: "KES 500", label: "Per attendee" },
    ],
    photos: [],
    order: 3,
  },
];

export const VISITS: CommunityVisit[] = [
  {
    label: "Visit I",
    place: "Smile Community Centre — Soweto, Kayole",
    childrenCount: 66,
    summary:
      "66 children. Robot demos, hands-on stations, and Q&A. Our first community robot visit.",
    photos: [],
    order: 1,
  },
  {
    label: "Next",
    place: "More estates & community centres across Nairobi",
    summary:
      "Booking further visits now. Sponsorship covers transport, equipment wear, and materials for each visit.",
    photos: [],
    order: 2,
  },
];

export const SCHOOLS: School[] = [
  { name: "Royal Palace School", note: "Coding and robotics workshop delivery.", order: 1 },
  { name: "St Mary’s Nairobi", note: "Robotics workshops — and home to a deployed Willary vape-detection system.", order: 2 },
  { name: "Senior Chief Adano Schools — Wajir", note: "STEM and robotics sessions reaching students in northern Kenya.", order: 3 },
  { name: "MPESA Foundation Academy / AWIT", note: "Robotics workshop delivered to a group of 30 students.", order: 4 },
];

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    name: "Title Sponsor",
    price: "KES TBC",
    featured: true,
    benefits: [
      "Event named with your brand",
      "Logo on all branding & stage",
      "Opening remarks slot",
      "Prime exhibitor space",
      "Named prize category",
      "Full social & press coverage",
    ],
    order: 1,
  },
  {
    name: "Gold",
    price: "KES TBC",
    featured: false,
    benefits: [
      "Logo on branding & website",
      "Large exhibitor stand",
      "Track or prize sponsorship",
      "Social media features",
    ],
    order: 2,
  },
  {
    name: "Silver",
    price: "KES TBC",
    featured: false,
    benefits: ["Logo on website & signage", "Standard exhibitor stand", "Shared social mention"],
    order: 3,
  },
  {
    name: "Community / In-kind",
    price: "Product or services",
    featured: false,
    benefits: [
      "For schools, makerspaces & suppliers",
      "Logo on community partners board",
      "Materials, prizes, venue or catering support",
    ],
    order: 4,
  },
];

export const TEAM: TeamMember[] = [
  {
    name: "William Otwola",
    role: "Founder & Robotics Engineer",
    bio: "Runs Willary STEM end to end — school programs, hardware builds, and the events. Believes in building with what's on hand.",
    order: 1,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Coffee & Solder attendee",
    role: "Attendee, Edition I",
    quote:
      "I came with a half-working robot and left with three new friends and a fix. This is the room Nairobi's builders needed.",
    eventTag: "coffee-and-solder",
    order: 1,
  },
  {
    name: "Panelist",
    role: "Panelist, Coffee & Solder",
    quote:
      "What stood out was how many students turned up ready to demo real work — not slides, working hardware.",
    eventTag: "coffee-and-solder",
    order: 2,
  },
  {
    name: "Student, Robotics Club",
    role: "Age 14 · Royal Palace School",
    quote:
      "I used to think robots were only on TV. Now I've built one that follows a line, and I fixed it myself when it broke.",
    eventTag: "students",
    order: 1,
  },
  {
    name: "Bootcamp graduate",
    role: "Holiday robotics bootcamp",
    quote:
      "Two weeks in and I could wire a sensor, read the data, and make a motor react to it. That felt like real engineering.",
    eventTag: "students",
    order: 2,
  },
];

export const PARTNERS: Partner[] = [
  { name: "ALX", url: "https://www.alxafrica.com", order: 1 },
];

export const POSTS: Post[] = [
  {
    slug: "building-with-what-we-have",
    title: "Building with what we have",
    category: "blog",
    excerpt:
      "Why every Willary project starts from parts a Kenyan student can actually source — and what that changes about how people learn.",
    body: [
      "## Start from the shelf, not the catalogue",
      "",
      "The fastest way to lose a student is to hand them a lesson that depends on a part they can't buy. So every Willary build starts from what's on the shelf at the local electronics shop.",
      "",
      "It changes the engineering. It changes the confidence. And it means the thing they built on Saturday still works on Monday.",
      "",
      "More build notes and tech news to follow here.",
    ].join("\n"),
    author: "William Otwola",
    publishedAt: "2026-08-01T09:00:00+03:00",
  },
];

export const COHORTS: Cohort[] = [
  {
    id: "seed-coding-jan",
    title: "Scratch & PictoBlocks Coding — Beginners",
    program: "Coding",
    mode: "PHYSICAL",
    startText: "Starts Saturday, 10 January 2026",
    scheduleText: "Saturdays, 9:00–11:00 AM · 8 weeks",
    location: "Willary STEM, Nairobi",
    ageRange: "Ages 8–13",
    priceKes: "KES 6,000",
    capacity: 16,
    summary:
      "Block-based coding from first principles — logic, loops, events — ending with a game each learner builds and explains.",
    status: "OPEN",
    order: 1,
  },
  {
    id: "seed-robotics-online",
    title: "ESP32 / Arduino Robotics — Online",
    program: "Robotics",
    mode: "ONLINE",
    startText: "Starts Monday, 3 February 2026",
    scheduleText: "Tue & Thu, 5:00–6:30 PM · 6 weeks (live online)",
    ageRange: "Ages 13+ and adults",
    priceKes: "KES 9,000",
    capacity: 20,
    summary:
      "Build and program a microcontroller robot from home: sensors, motors, wireless control, and an autonomous behaviour you design.",
    status: "OPEN",
    order: 2,
  },
];
