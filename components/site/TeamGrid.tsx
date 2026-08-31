import Image from "next/image";
import type { TeamMember } from "@/lib/types";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function TeamGrid({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;
  return (
    <div className="grid grid--4">
      {members.map((m) => (
        <article className="card team-card" key={m.name}>
          <div className="avatar">
            {m.photoUrl ? (
              <Image
                src={m.photoUrl}
                alt={m.name}
                width={96}
                height={96}
                sizes="96px"
              />
            ) : (
              initials(m.name)
            )}
          </div>
          <h3>{m.name}</h3>
          <p className="role">{m.role}</p>
          {m.bio && (
            <p style={{ fontSize: "0.9rem", marginTop: 10 }}>{m.bio}</p>
          )}
        </article>
      ))}
    </div>
  );
}
