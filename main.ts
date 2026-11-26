import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The entry: a one-star review of the Moon, at most 120 characters.
const ENTRY =
  "★☆☆☆☆ Turned my boyfriend into a wolf once a month and acted like that was my problem.";

const OUT_DIR = "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

function main(): void {
  // The gate counts characters (code points), not bytes.
  const length = [...ENTRY].length;
  if (length < 1 || length > 120) {
    throw new Error(`entry is ${length} characters, must be 1-120`);
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (ENTRY.trim() === "") {
    throw new Error("entry must not be only whitespace");
  }
  if (ENTRY !== ENTRY.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }

  mkdirSync(OUT_DIR, { recursive: true });
  // No trailing newline: exactly one line of UTF-8 text.
  writeFileSync(OUT_FILE, ENTRY, "utf8");

  // Read back and verify byte-for-byte before reporting success.
  const back = readFileSync(OUT_FILE, "utf8");
  if (back !== ENTRY) {
    throw new Error("read-back mismatch: /output/entry.txt does not match the entry");
  }
  // The gate counts characters; also confirm the byte length is the
  // exact UTF-8 encoding of the entry (no BOM, no newline added).
  const bytes = Buffer.from(back, "utf8");
  if (!bytes.equals(Buffer.from(ENTRY, "utf8"))) {
    throw new Error("byte mismatch: /output/entry.txt is not the exact UTF-8 encoding of the entry");
  }
  console.log(`wrote ${length} characters to ${OUT_FILE}`);
}

main();
