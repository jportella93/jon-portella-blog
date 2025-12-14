import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main(): Promise<void> {
  console.log("🚀 Starting blog post image processing...");

  try {
    // Step 1: Upload images to R2 and replace local references with remote URLs
    console.log("\n📤 Uploading images to R2 and updating references...");
    execSync("npx tsx scripts/migrate-images-to-r2.ts --apply", {
      stdio: "inherit",
      cwd: path.resolve(__dirname, ".."),
    });

    // Step 2: Generate image metadata for blog posts
    console.log("\n📊 Generating image metadata...");
    execSync("npx tsx scripts/generate-image-meta.ts", {
      stdio: "inherit",
      cwd: path.resolve(__dirname, ".."),
    });

    console.log("\n✅ Blog post image processing complete!");
    console.log(
      "Your images have been uploaded to R2 and are ready for deployment."
    );
  } catch (error) {
    console.error("\n❌ Error during image processing:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exitCode = 1;
});
