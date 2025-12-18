export interface ArticleSchema {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
}

export interface WebsiteSchema {
  name: string;
  description: string;
  url: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

export interface CollectionPageSchema {
  name: string;
  description: string;
  url: string;
  mainEntity: {
    "@type": "ItemList";
    numberOfItems: number;
    itemListElement: Array<{
      "@type": "ListItem";
      position: number;
      url: string;
      name: string;
      description?: string;
    }>;
  };
}

export function generateArticleSchema(article: ArticleSchema): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.headline,
    description: article.description,
    image: article.image ? [article.image] : undefined,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: article.author,
    publisher: article.publisher,
    mainEntityOfPage: article.mainEntityOfPage,
  };

  return JSON.stringify(schema, null, 0);
}

export function generateWebsiteSchema(website: WebsiteSchema): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: website.name,
    description: website.description,
    url: website.url,
    potentialAction: website.potentialAction,
  };

  return JSON.stringify(schema, null, 0);
}

export function generateCollectionPageSchema(
  collection: CollectionPageSchema
): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: collection.description,
    url: collection.url,
    mainEntity: collection.mainEntity,
  };

  return JSON.stringify(schema, null, 0);
}
