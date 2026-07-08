import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import pkg from "../../package.json";

function resolveCommit(): string {
  // CI-provided commit (Netlify sets COMMIT_REF; others use GIT_COMMIT/SOURCE_COMMIT)
  const fromEnv =
    process.env.COMMIT_REF ?? process.env.GIT_COMMIT ?? process.env.SOURCE_COMMIT;
  if (fromEnv) return fromEnv.slice(0, 7);

  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  } catch {
    // no git binary (e.g. node:alpine Docker build) — fall through to reading .git directly
  }

  try {
    const head = readFileSync(".git/HEAD", "utf8").trim();
    if (!head.startsWith("ref: ")) return head.slice(0, 7);
    const ref = head.slice(5);
    try {
      return readFileSync(`.git/${ref}`, "utf8").trim().slice(0, 7);
    } catch {
      const packed = readFileSync(".git/packed-refs", "utf8");
      const line = packed
        .split("\n")
        .find((l) => !l.startsWith("#") && l.endsWith(` ${ref}`));
      if (line) return line.slice(0, 7);
    }
  } catch {
    // no .git in the build context
  }

  return "unknown";
}

export const version: string = pkg.version;
export const commit: string = resolveCommit();
export const buildInfo = `v${version} (${commit})`;
