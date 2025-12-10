import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extract a plain video ID from multiple possible URL formats
const extractVideoId = (raw) => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);

    // Standard watch URL: https://www.youtube.com/watch?v=VIDEOID
    const watchId = url.searchParams.get("v");
    if (watchId && /^[a-zA-Z0-9_-]{11}$/.test(watchId)) return watchId;

    // Short/other formats: youtu.be/VIDEOID, /embed/VIDEOID, /shorts/VIDEOID, studio links
    const pathMatch = url.pathname.match(/(?:\/embed\/|\/shorts\/|\/video\/|\/)([a-zA-Z0-9_-]{11})/);
    if (pathMatch?.[1]) return pathMatch[1];
  } catch {
    // Not a URL, fall through
  }

  return null;
};

// Read and normalize video IDs from videoids file
const videoidsPath = path.join(__dirname, "videoids");
const videoIds = Array.from(
  new Set(
    fs
      .readFileSync(videoidsPath, "utf-8")
      .split("\n")
      .map(extractVideoId)
      .filter(Boolean)
  )
);

console.log(`Found ${videoIds.length} video IDs to fetch`);

// Function to fetch video metadata from YouTube
async function fetchVideoMetadata(videoId) {
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    // First, try oEmbed API for basic info (no API key needed)
    let oEmbedData = null;
    try {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const oEmbedResponse = await fetch(oEmbedUrl);
      if (oEmbedResponse.ok) {
        oEmbedData = await oEmbedResponse.json();
      }
    } catch (e) {
      // oEmbed failed, continue with HTML scraping
    }

    // Fetch the video page for detailed info
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Extract JSON-LD structured data (most reliable)
    let title = oEmbedData?.title || "";
    let description = "";
    let publishDate = "";
    let thumbnail =
      oEmbedData?.thumbnail_url ||
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    const jsonLdMatches = html.matchAll(
      /<script type="application\/ld\+json">(.*?)<\/script>/gs
    );
    for (const match of jsonLdMatches) {
      try {
        const jsonData = JSON.parse(match[1]);
        const videoData = Array.isArray(jsonData)
          ? jsonData.find((item) => item["@type"] === "VideoObject")
          : jsonData["@type"] === "VideoObject"
            ? jsonData
            : null;

        if (videoData) {
          title = videoData.name || title;
          description = videoData.description || description;
          publishDate =
            videoData.uploadDate || videoData.datePublished || publishDate;
          thumbnail = videoData.thumbnailUrl || thumbnail;
          break;
        }
      } catch (e) {
        // Continue to next match
      }
    }

    // Fallback: Extract from ytInitialPlayerResponse
    if (!description || !publishDate) {
      const ytInitialPlayerResponseMatch = html.match(
        /var ytInitialPlayerResponse = ({.*?});/s
      );
      if (ytInitialPlayerResponseMatch) {
        try {
          const data = JSON.parse(ytInitialPlayerResponseMatch[1]);
          const videoDetails = data?.videoDetails;

          if (videoDetails) {
            title = videoDetails.title || title;
            description = videoDetails.shortDescription || description;
            if (videoDetails.thumbnail?.thumbnails?.length > 0) {
              thumbnail =
                videoDetails.thumbnail.thumbnails[
                  videoDetails.thumbnail.thumbnails.length - 1
                ].url || thumbnail;
            }
          }
        } catch (e) {
          // Continue to fallback
        }
      }
    }

    // Extract publish date from various sources in HTML
    if (!publishDate) {
      const dateMatches = [
        html.match(/"uploadDate":"([^"]+)"/),
        html.match(/"datePublished":"([^"]+)"/),
        html.match(/uploadDate["']:\s*["']([^"']+)["']/),
        html.match(/<meta itemprop="uploadDate" content="([^"]+)"/),
      ];
      for (const match of dateMatches) {
        if (match && match[1]) {
          publishDate = match[1];
          break;
        }
      }
    }

    // Last resort: Extract title from page title if still missing
    if (!title) {
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      title = titleMatch
        ? titleMatch[1].replace(/\s*-\s*YouTube$/, "").trim()
        : `Video ${videoId}`;
    }

    return {
      title: title || `Video ${videoId}`,
      description: description || "",
      publishDate: publishDate || "",
      thumbnail:
        thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  } catch (error) {
    console.error(`Error fetching ${videoId}:`, error.message);
    return {
      title: `Video ${videoId}`,
      description: "",
      publishDate: "",
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  }
}

// Function to format date and calculate end date
function formatDates(publishDate) {
  if (!publishDate) {
    return { startDate: null, endDate: null };
  }

  // Parse various date formats
  let date;
  if (publishDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // Already in YYYY-MM-DD format
    date = new Date(publishDate + "T00:00:00");
  } else if (publishDate.match(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/)) {
    // Format: "Jan 1, 2024"
    date = new Date(publishDate);
  } else {
    // Try parsing as-is
    date = new Date(publishDate);
  }

  if (isNaN(date.getTime())) {
    return { startDate: null, endDate: null };
  }

  const startDate = date.toISOString().split("T")[0];

  // Calculate end date (one month later)
  const endDate = new Date(date);
  endDate.setMonth(endDate.getMonth() + 1);
  const endDateStr = endDate.toISOString().split("T")[0];

  return { startDate, endDate: endDateStr };
}

// Fetch all videos with rate limiting
async function fetchAllVideos() {
  const results = [];

  for (let i = 0; i < videoIds.length; i++) {
    const videoId = videoIds[i];
    console.log(`Fetching ${i + 1}/${videoIds.length}: ${videoId}`);

    const metadata = await fetchVideoMetadata(videoId);
    const { startDate, endDate } = formatDates(metadata.publishDate);

    results.push({
      videoId,
      ...metadata,
      startDate,
      endDate,
    });

    // Rate limiting: wait 1 second between requests
    if (i < videoIds.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

// Generate project entries
function generateProjectEntries(videoData) {
  const existingProjects = 12; // Count existing projects in timelineData.js
  const projects = [];

  videoData.forEach((video, index) => {
    if (!video.startDate) {
      console.warn(`Skipping ${video.videoId} - no valid publish date`);
      return;
    }

    const project = {
      id: `project-video-${index + 1}`,
      type: "project",
      title: video.title || `Video ${video.videoId}`,
      description: video.description || "",
      image: video.thumbnail,
      link: `https://www.youtube.com/watch?v=${video.videoId}`,
      startDate: video.startDate,
      endDate: video.endDate,
      milestones: [],
    };

    projects.push(project);
  });

  return projects;
}

// Main execution
async function main() {
  console.log("Starting to fetch YouTube video metadata...\n");

  const videoData = await fetchAllVideos();
  const projects = generateProjectEntries(videoData);

  // Write results to a JSON file for review
  const outputPath = path.join(__dirname, "youtube-videos-data.json");
  fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));

  console.log(`\nFetched ${projects.length} videos`);
  console.log(`Results saved to ${outputPath}`);
  console.log("\nNext step: Review the data and update timelineData.js");

  return projects;
}

main().catch(console.error);
