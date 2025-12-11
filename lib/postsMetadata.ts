import type { PostFrontmatter } from "./markdown";
import postsMetadataJson from "./postsMetadata.json";

export type ClientPostFrontmatter = Pick<
  PostFrontmatter,
  "title" | "spoiler" | "date" | "hasNewsletterBeenSent"
> & {
  readingTimeMinutes: number;
};

export interface PostMetadata {
  slug: string;
  frontmatter: ClientPostFrontmatter;
}

export const postsMetadata: PostMetadata[] =
  postsMetadataJson as PostMetadata[];

// Helper function to get a random post
export function getRandomPost(currentSlug?: string): PostMetadata | null {
  if (postsMetadata.length === 0) return null;

  let availablePosts = postsMetadata;
  if (currentSlug) {
    availablePosts = postsMetadata.filter((post) => post.slug !== currentSlug);
  }

  if (availablePosts.length === 0) {
    // Fallback to all posts if filtering removed everything
    availablePosts = postsMetadata;
  }

  const randomIndex = Math.floor(Math.random() * availablePosts.length);
  return availablePosts[randomIndex];
}
