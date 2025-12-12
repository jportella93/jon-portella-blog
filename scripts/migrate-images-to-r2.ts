import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
dotenv.config();

type ImageEntry = {
  absPath: string;
  relPath: string;
  key: string;
  size: number;
  url: string;
};

type RewriteResult = {
  filePath: string;
  replacements: number;
};

const imageExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
]);
const textExtensions = new Set([
  ".md",
  ".mdx",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".css",
  ".json",
]);
const ignoredDirs = new Set([
  "node_modules",
  ".git",
  ".next",
  ".npm-cache",
  "out",
]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

function posixify(p: string): string {
  return p.split(path.sep).join("/");
}

function stripQueryAndHash(input: string): string {
  const idx = input.search(/[?#]/);
  return idx === -1 ? input : input.slice(0, idx);
}

async function collectFiles(
  startDirs: string[],
  allowedExts: Set<string>,
  includeFiles: boolean
): Promise<string[]> {
  const results: string[] = [];
  const stack = [...startDirs];
  while (stack.length) {
    const current = stack.pop();
    if (!current) continue;
    const stat = await fs.stat(current);
    if (stat.isDirectory()) {
      const dirName = path.basename(current);
      if (ignoredDirs.has(dirName)) continue;
      const entries = await fs.readdir(current);
      for (const entry of entries) {
        stack.push(path.join(current, entry));
      }
    } else if (includeFiles) {
      const ext = path.extname(current).toLowerCase();
      if (allowedExts.has(ext)) {
        results.push(current);
      }
    }
  }
  return results.sort();
}

async function loadEnvFromFile(filePath: string): Promise<void> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const lines = raw.split(/\r?\n/);
    for (const line of lines) {
      if (!line || line.trim().startsWith("#")) continue;
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const key = match[1];
      let value = match[2] ?? "";
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return;
    throw err;
  }
}

async function collectReferencedImages(
  publicBase: string
): Promise<ImageEntry[]> {
  const textFiles = await collectTextFiles();
  const referencedPaths = new Set<string>();

  // Scan all text files for image references
  for (const filePath of textFiles) {
    const content = await fs.readFile(filePath, "utf8");
    const matches = collectMatches(content);

    for (const match of matches) {
      const target = match.value;
      const resolved = resolveLocalTarget(target, filePath);
      if (resolved) {
        const absPath = stripQueryAndHash(resolved);
        // Only include if it's an image extension and the file actually exists
        const ext = path.extname(absPath).toLowerCase();
        if (imageExtensions.has(ext)) {
          try {
            await fs.access(absPath);
            referencedPaths.add(absPath);
          } catch {
            // File doesn't exist, skip it
            console.warn(`Referenced image not found: ${absPath}`);
          }
        }
      }
    }
  }

  // Convert referenced paths to ImageEntry objects
  const images: ImageEntry[] = [];
  for (const absPath of referencedPaths) {
    try {
      const stat = await fs.stat(absPath);
      if (!stat.isFile()) continue;

      const relPath = path.relative(projectRoot, absPath);
      const key = generateR2Key(relPath);
      const url = `${publicBase}/${key}`;
      images.push({ absPath, relPath, key, size: stat.size, url });
    } catch (error) {
      console.warn(`Failed to stat referenced image ${absPath}:`, error);
    }
  }

  return images;
}

function generateR2Key(relPath: string): string {
  // Strip "public/" prefix for files in public/ to align with site paths
  if (relPath.startsWith("public/")) {
    return posixify(relPath.slice("public/".length));
  }
  // Keep other prefixes (like content/blog/...)
  return posixify(relPath);
}

function canDeleteLocalImage(relPath: string): boolean {
  // Only allow deletion of content images in specific directories
  return (
    relPath.startsWith("public/assets/") ||
    relPath.startsWith("public/content/blog/") ||
    relPath.startsWith("content/blog/")
  );
}

async function uploadImage(
  image: ImageEntry,
  client: S3Client,
  bucket: string
): Promise<void> {
  const body = await fs.readFile(image.absPath);
  const contentType = guessContentType(image.absPath);
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: image.key,
      Body: body,
      ContentType: contentType,
    })
  );
}

function guessContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

function isRemote(url: string): boolean {
  return (
    /^https?:\/\//i.test(url) || url.startsWith("//") || url.startsWith("data:")
  );
}

function resolveLocalTarget(target: string, filePath: string): string | null {
  const cleaned = stripQueryAndHash(target.trim());
  if (!cleaned || isRemote(cleaned)) return null;
  const fileDir = path.dirname(filePath);

  if (cleaned.startsWith("/")) {
    const withoutSlash = cleaned.replace(/^\/+/, "");
    const publicCandidate = path.join(projectRoot, "public", withoutSlash);
    if (
      path.extname(publicCandidate) &&
      imageExtensions.has(path.extname(publicCandidate).toLowerCase())
    ) {
      return publicCandidate;
    }
    const rootCandidate = path.join(projectRoot, withoutSlash);
    return rootCandidate;
  }

  return path.resolve(fileDir, cleaned);
}

function collectMatches(
  content: string
): { start: number; end: number; value: string }[] {
  const patterns = [
    /!\[[^\]]*?\]\(([^)]+)\)/g, // markdown image
    /<img[^>]+src=["']([^"']+)["'][^>]*>/gi, // img tag
    /src=["']([^"']+\.(?:png|jpg|jpeg|gif|webp|svg)[^"']*)["']/gi, // src attribute
    /url\(["']?([^)"']+\.(?:png|jpg|jpeg|gif|webp|svg)[^)"']*)["']?\)/gi, // css url()
    /"((?!(?:https?|data):)[^"]*\.(?:png|jpg|jpeg|gif|webp|svg)[^"]*)"/g, // JSON strings containing local image paths
  ];
  const matches: { start: number; end: number; value: string }[] = [];
  for (const pattern of patterns) {
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(content)) !== null) {
      const fullMatch = m[0];
      const rawValue = m[1];
      if (!rawValue) continue;
      const start = m.index + fullMatch.indexOf(rawValue);
      matches.push({ start, end: start + rawValue.length, value: rawValue });
    }
  }
  return matches;
}

async function rewriteFile(
  filePath: string,
  imageMapByAbs: Map<string, ImageEntry>,
  dryRun: boolean
): Promise<RewriteResult | null> {
  const content = await fs.readFile(filePath, "utf8");
  const matches = collectMatches(content);
  if (!matches.length) return null;

  let updated = content;
  let replacements = 0;

  // Process matches from end to start to avoid index shift.
  const sorted = matches.sort((a, b) => b.start - a.start);
  for (const match of sorted) {
    const target = match.value;
    const resolved = resolveLocalTarget(target, filePath);
    if (!resolved) continue;
    const absPath = stripQueryAndHash(resolved);
    const image = imageMapByAbs.get(absPath);
    if (!image) continue;

    // Handle JSON files differently - the match already includes quotes, so don't add more
    const isJsonFile = filePath.endsWith(".json");
    const replacement = isJsonFile ? image.url : image.url;

    replacements += 1;
    updated =
      updated.slice(0, match.start) + replacement + updated.slice(match.end);
  }

  if (replacements === 0) return null;

  if (!dryRun) {
    await fs.writeFile(filePath, updated, "utf8");
  }

  return { filePath, replacements };
}

async function collectTextFiles(): Promise<string[]> {
  return collectFiles([projectRoot], textExtensions, true);
}

async function main(): Promise<void> {
  await loadEnvFromFile(path.join(projectRoot, ".env.local"));

  const accessKeyId = process.env.R2_ACCESS_KEY;
  const secretAccessKey = process.env.R2_SECRET_KEY;
  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET || "j-img";
  const publicBaseRaw = process.env.R2_PUBLIC_BASE;

  if (!accessKeyId || !secretAccessKey || !endpoint || !publicBaseRaw) {
    console.error(
      "Missing env vars. Required: R2_ACCESS_KEY, R2_SECRET_KEY, R2_ENDPOINT, R2_PUBLIC_BASE."
    );
    process.exit(1);
  }

  const publicBase = publicBaseRaw.replace(/\/+$/, "");
  const s3 = new S3Client({
    region: "auto",
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });

  const dryRun =
    process.argv.includes("--dry-run") || !process.argv.includes("--apply");
  const deleteLocal = process.argv.includes("--delete-local");

  // Validate flags
  if (deleteLocal && dryRun) {
    console.error(
      "--delete-local can only be used with --apply (not in dry-run mode)"
    );
    process.exit(1);
  }

  console.log(`Running migrate-images-to-r2 (${dryRun ? "dry-run" : "apply"})`);
  if (deleteLocal) {
    console.log("Will delete local image files after successful migration.");
  }
  console.log(`Project root: ${projectRoot}`);
  console.log(`Public base: ${publicBase}`);

  const images = await collectReferencedImages(publicBase);
  const imageMapByAbs = new Map<string, ImageEntry>(
    images.map((img) => [img.absPath, img])
  );

  console.log(`Discovered ${images.length} images to upload.`);
  const uploadCandidates = images.map(
    (img) => `${img.key} (${img.size} bytes)`
  );
  console.log(
    uploadCandidates
      .slice(0, 10)
      .map((i) => `  - ${i}`)
      .join("\n")
  );
  if (images.length > 10) console.log(`  ...and ${images.length - 10} more`);

  if (!dryRun) {
    for (const image of images) {
      const exists = await objectExists(image.key, s3, bucket);
      if (exists) continue;
      await uploadImage(image, s3, bucket);
    }
  }

  const textFiles = await collectTextFiles();
  const rewrites: RewriteResult[] = [];
  for (const file of textFiles) {
    const result = await rewriteFile(file, imageMapByAbs, dryRun);
    if (result) rewrites.push(result);
  }

  const totalReplacements = rewrites.reduce(
    (sum, r) => sum + r.replacements,
    0
  );
  console.log(
    `Rewrites touched ${rewrites.length} files with ${totalReplacements} replacements.`
  );
  for (const r of rewrites.slice(0, 10)) {
    console.log(
      `  - ${path.relative(projectRoot, r.filePath)} (${r.replacements} updates)`
    );
  }
  if (rewrites.length > 10) {
    console.log(`  ...and ${rewrites.length - 10} more`);
  }

  if (dryRun) {
    console.log("Dry-run complete. No uploads or file writes were performed.");
  } else {
    console.log("Apply complete. Uploads finished and references rewritten.");

    if (deleteLocal) {
      console.log("Deleting local image files...");
      let deletedCount = 0;

      // Find all local images in allowed directories
      const localImages = await collectFiles(
        [projectRoot],
        imageExtensions,
        true
      );

      for (const absPath of localImages) {
        const relPath = path.relative(projectRoot, absPath);
        if (canDeleteLocalImage(relPath)) {
          try {
            await fs.unlink(absPath);
            deletedCount++;
            if (dryRun) {
              console.log(`  - Would delete ${relPath}`);
            } else {
              console.log(`  - Deleted ${relPath}`);
            }
          } catch (error) {
            console.warn(`Failed to delete ${relPath}:`, error);
          }
        }
      }

      console.log(`Deleted ${deletedCount} local image files.`);
    }
  }
}

async function objectExists(
  key: string,
  client: S3Client,
  bucket: string
): Promise<boolean> {
  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    return true;
  } catch (err: unknown) {
    return false;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
