// Ensures the local Prisma Postgres server ("willary") is running before
// `next dev`. Runs as npm's `predev` hook. Never blocks the dev server —
// worst case it prints how to start the DB by hand.
import { spawnSync, spawn } from "node:child_process";
import net from "node:net";

const PORT = 51214; // raw TCP port used by `prisma dev`

function portOpen(port) {
  return new Promise((resolve) => {
    const sock = net.connect({ host: "127.0.0.1", port }, () => {
      sock.destroy();
      resolve(true);
    });
    sock.on("error", () => resolve(false));
    sock.setTimeout(1000, () => {
      sock.destroy();
      resolve(false);
    });
  });
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

if (await portOpen(PORT)) {
  console.log("[db] local Prisma Postgres already running");
  process.exit(0);
}

console.log("[db] starting local Prisma Postgres (willary)…");

// Restart an existing (stopped) server; if there is none, create + run detached.
const started = spawnSync("npx", ["prisma", "dev", "start", "willary"], {
  stdio: "ignore",
  shell: true,
  timeout: 60_000,
});
if (started.status !== 0) {
  const child = spawn("npx", ["prisma", "dev", "-n", "willary", "-d"], {
    detached: true,
    stdio: "ignore",
    shell: true,
  });
  child.unref();
}

for (let i = 0; i < 45; i++) {
  if (await portOpen(PORT)) {
    console.log("[db] up");
    process.exit(0);
  }
  await wait(1000);
}

console.warn(
  "[db] could not confirm the database started.\n" +
    "     Run it in another terminal:  npx prisma dev -n willary",
);
process.exit(0);
