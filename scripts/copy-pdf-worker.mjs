// Copies pdfjs-dist's legacy worker build into public/pdfjs/ so the browser
// can load it as a plain static file (see the comment next to
// GlobalWorkerOptions.workerSrc in lib/document-parsing/parse-document.ts
// for why it's served this way instead of via `new URL(..., import.meta.url)`).
//
// Runs on `npm install` (see package.json's "postinstall") so the copy
// always matches the installed pdfjs-dist version and never has to be
// committed or hand-updated.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const source = join(
  projectRoot,
  "node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs"
);
const destinationDir = join(projectRoot, "public/pdfjs");
const destination = join(destinationDir, "pdf.worker.min.mjs");

mkdirSync(destinationDir, { recursive: true });
copyFileSync(source, destination);

console.log(`Copied pdfjs worker to ${destination}`);
