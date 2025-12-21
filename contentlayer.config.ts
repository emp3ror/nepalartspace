import { defineDocumentType, makeSource } from "contentlayer/source-files";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const postComputedFields = {
  slug: {
    type: "string" as const,
    resolve: (doc: { _raw: { flattenedPath: string } }) =>
      doc._raw.flattenedPath.replace(/^posts\//, ""),
  },
  url: {
    type: "string" as const,
    resolve: (doc: { _raw: { flattenedPath: string } }) =>
      `/posts/${doc._raw.flattenedPath.replace(/^posts\//, "")}`,
  },
  readingTime: {
    type: "string" as const,
    resolve: (doc: { body: { raw: string } }) => readingTime(doc.body.raw).text,
  },
};

const getArtCollegeSlug = (doc: { _raw: { flattenedPath: string } }) => {
  const flattenedPath = doc._raw.flattenedPath.replace(/^art-college\/?/, "");
  const withoutIndex = flattenedPath.replace(/\/index$/, "");
  return withoutIndex === "index" ? "" : withoutIndex;
};

const artCollegeComputedFields = {
  slug: {
    type: "string" as const,
    resolve: (doc: { _raw: { flattenedPath: string } }) =>
      getArtCollegeSlug(doc),
  },
  url: {
    type: "string" as const,
    resolve: (doc: { _raw: { flattenedPath: string } }) => {
      const slug = getArtCollegeSlug(doc);
      return slug ? `/art-college/${slug}` : "/art-college";
    },
  },
};

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "posts/**/!(*index).mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    category: {
      type: "enum",
      options: ["tech", "art", "politics", "art-study", "personal", "hike"],
      required: true,
    },
    tags: { type: "list", of: { type: "string" }, required: true },
    cover: { type: "string", required: false },
    featured: { type: "boolean", required: false },
    template: { type: "string", required: false },
    gpx: { type: "string", required: false },
    checkpoints: { type: "json", required: false },
  },
  computedFields: postComputedFields,
}));

export const PostsOverview = defineDocumentType(() => ({
  name: "PostsOverview",
  filePathPattern: "posts/index.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    intro: { type: "string", required: false },
    description: { type: "string", required: false },
    updated: { type: "date", required: false },
  },
}));

export const ArtCollegeOverview = defineDocumentType(() => ({
  name: "ArtCollegeOverview",
  filePathPattern: "art-college/index.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    intro: { type: "string", required: false },
    description: { type: "string", required: false },
    updated: { type: "date", required: false },
  },
  computedFields: artCollegeComputedFields,
}));

export const ArtCollegeSection = defineDocumentType(() => ({
  name: "ArtCollegeSection",
  filePathPattern: "art-college/*/**/index.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    intro: { type: "string", required: false },
    description: { type: "string", required: false },
    order: { type: "number", required: false },
  },
  computedFields: artCollegeComputedFields,
}));

export const ArtCollegeLesson = defineDocumentType(() => ({
  name: "ArtCollegeLesson",
  filePathPattern: "art-college/**/!(*index).mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    date: { type: "date", required: false },
    updated: { type: "date", required: false },
  },
  computedFields: artCollegeComputedFields,
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [
    Post,
    PostsOverview,
    ArtCollegeOverview,
    ArtCollegeSection,
    ArtCollegeLesson,
  ],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  },
});
