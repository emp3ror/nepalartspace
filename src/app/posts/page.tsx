import { cache } from "react";

import { compileMDX } from "next-mdx-remote/rsc";

import { Badge } from "@/components/badge";
import { DoodleDivider } from "@/components/doodle-divider";
import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";
import { SectionHeading } from "@/components/section-heading";
import { PostCard } from "@/components/post-card";
import { getAllPosts, getPostsOverview, type Post, type PostsOverview } from "@/lib/mdx-posts";

const renderOverview = cache(async (source: string) => {
  const { content } = await compileMDX<{ [key: string]: unknown }>({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [],
      },
    },
    components: mdxComponents,
  });

  return content;
});

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

const getCategories = (items: Post[]) =>
  Array.from(new Set(items.map((item) => item.category))).sort();

export default async function PostsPage() {
  const posts = await getAllPosts();
  const overview = await getPostsOverview();
  const categories = getCategories(posts);

  const overviewContent = overview ? await renderOverview(overview.body) : null;

  return (
    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-20 px-6 pb-24 pt-24">
      <section className="space-y-6">
        <Badge className="bg-white/85 text-[color:var(--accent)]">Blog</Badge>
        <SectionHeading
          title={overview?.title ?? "Posts and updates"}
          description={overview?.description ?? "Add MDX files under `content/posts` to populate this page."}
        />

        {overview?.intro ? (
          <p className="max-w-3xl text-sm text-[color:var(--ink)]/70">{overview.intro}</p>
        ) : null}

        {overviewContent ? <MdxContainer>{overviewContent}</MdxContainer> : null}

        {overview?.updated ? (
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Updated {formatDate(overview.updated)}
          </p>
        ) : null}

        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/60">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-[color:var(--muted)]/50 bg-white/80 px-4 py-2"
              >
                {category}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <DoodleDivider variant="cloud" colorClassName="text-[color:var(--muted)]/50" />

      {posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              className="h-full"
              titleClassName="text-xl"
              showTags
              showReadingTime
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[2.5rem] border border-dashed border-[color:var(--muted)]/60 bg-white/70 px-8 py-16 text-center text-sm text-[color:var(--ink)]/60">
          <p className="text-lg font-semibold text-[color:var(--ink)]">Nothing published yet</p>
          <p className="mt-2">Drop your first MDX file into `content/posts` to publish it automatically.</p>
        </div>
      )}
    </div>
  );
}
