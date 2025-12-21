import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export type Post = {
  _id: string;
  slug: string;
  url: string;
  title: string;
  description?: string;
  date: string;
  category?: string;
  tags?: string[];
  readingTime?: string;
  body?: string;
  template?: string;
  gpx?: string;
  checkpoints?: unknown;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

const toArray = (value: unknown): string[] | undefined => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
};

const parsePost = (slug: string, raw: string): Post | null => {
  const { data, content } = matter(raw);
  if (!data.title || !data.date) return null;

  return {
    _id: slug,
    slug,
    url: `/posts/${slug}`,
    title: String(data.title),
    description: data.description ? String(data.description) : undefined,
    date: String(data.date),
    category: data.category ? String(data.category) : undefined,
    tags: toArray(data.tags),
    readingTime: data.readingTime ? String(data.readingTime) : undefined,
    template: data.template ? String(data.template) : undefined,
    gpx: data.gpx ? String(data.gpx) : undefined,
    checkpoints: data.checkpoints,
    body: content,
  };
};

export const getPostSlugs = async () => {
  try {
    const entries = await fs.readdir(POSTS_DIR);
    return entries.filter((entry) => entry.endsWith(".mdx") && entry !== "index.mdx").map((entry) => entry.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
};

export const getAllPosts = async (): Promise<Post[]> => {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const raw = await fs.readFile(path.join(POSTS_DIR, `${slug}.mdx`), "utf8");
        return parsePost(slug, raw);
      } catch {
        return null;
      }
    }),
  );

  return posts
    .filter((post): post is Post => Boolean(post))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export type PostsOverview = {
  title: string;
  intro?: string;
  description?: string;
  updated?: string;
  body: string;
};

export const getPostsOverview = async (): Promise<PostsOverview | null> => {
  try {
    const raw = await fs.readFile(path.join(POSTS_DIR, "index.mdx"), "utf8");
    const { data, content } = matter(raw);
    return {
      title: data.title ? String(data.title) : "Posts and updates",
      intro: data.intro ? String(data.intro) : undefined,
      description: data.description ? String(data.description) : undefined,
      updated: data.updated ? String(data.updated) : undefined,
      body: content,
    };
  } catch {
    return null;
  }
};
