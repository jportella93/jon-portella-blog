import postsMetadataJson from "./postsMetadata.json";

export interface PostMetadata {
  slug: string;
  frontmatter: {
    title?: string;
    spoiler?: string;
    date?: string;
  };
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

// Helper function to search posts by title or spoiler
export function searchPosts(query: string): PostMetadata[] {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();
  return postsMetadata.filter((post) => {
    const title = post.frontmatter.title?.toLowerCase() || "";
    const spoiler = post.frontmatter.spoiler?.toLowerCase() || "";
    return title.includes(searchTerm) || spoiler.includes(searchTerm);
  });
}
