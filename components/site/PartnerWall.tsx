import Image from "next/image";
import type { Partner } from "@/lib/types";

function initials(name: string) {
  return name.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase();
}

export default function PartnerWall({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;
  return (
    <div className="partner-wall">
      {partners.map((p) => {
        const inner = p.logoUrl ? (
          <Image
            src={p.logoUrl}
            alt={p.name}
            width={140}
            height={60}
            sizes="140px"
            style={{ objectFit: "contain", width: "auto", height: 40 }}
          />
        ) : (
          <span className="partner-name">{initials(p.name)}</span>
        );
        return p.url ? (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            title={p.name}
          >
            {inner}
          </a>
        ) : (
          <div key={p.name} title={p.name}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
