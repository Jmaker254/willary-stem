import "server-only";
import net from "node:net";
import { spawnSync, spawn } from "node:child_process";

const PORT = 51214; // raw TCP port used by `prisma dev`
let starting: Promise<void> | null = null;

function portOpen(port: number, timeout = 800): Promise<boolean> {
  return new Promise((resolve) => {
    const sock = net.connect({ host: "127.0.0.1", port }, () => {
      sock.destroy();
      resolve(true);
    });
    sock.on("error", () => resolve(false));
    sock.setTimeout(timeout, () => {
      sock.destroy();
      resolve(false);
    });
  });
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Best-effort: make sure the local `prisma dev` Postgres is listening.
 * Dev + local-URL only; no-op everywhere else. Safe to call concurrently.
 */
export async function ensureLocalDb(): Promise<void> {
  if (process.env.NODE_ENV === "production") return;
  const url = process.env.DATABASE_URL ?? "";
  if (!/localhost|127\.0\.0\.1/.test(url)) return;
  if (await portOpen(PORT)) return;
  if (starting) return starting;

  starting = (async () => {
    try {
      spawnSync("npx", ["prisma", "dev", "start", "willary"], {
        stdio: "ignore",
        shell: true,
        timeout: 45_000,
      });
      if (!(await portOpen(PORT))) {
        const child = spawn("npx", ["prisma", "dev", "-n", "willary", "-d"], {
          detached: true,
          stdio: "ignore",
          shell: true,
        });
        child.unref();
      }
      for (let i = 0; i < 30; i++) {
        if (await portOpen(PORT)) return;
        await wait(1000);
      }
    } finally {
      starting = null;
    }
  })();

  return starting;
}
