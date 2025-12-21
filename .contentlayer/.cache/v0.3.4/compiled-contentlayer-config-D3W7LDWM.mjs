// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
var computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.replace(/^posts\//, "")
  },
  url: {
    type: "string",
    resolve: (doc) => `/posts/${doc._raw.flattenedPath.replace(/^posts\//, "")}`
  },
  readingTime: {
    type: "string",
    resolve: (doc) => readingTime(doc.body.raw).text
  }
};
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "posts/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    category: {
      type: "enum",
      options: ["tech", "art", "politics", "art-study", "personal", "hike"],
      required: true
    },
    tags: { type: "list", of: { type: "string" }, required: true },
    cover: { type: "string", required: false },
    featured: { type: "boolean", required: false },
    template: { type: "string", required: false },
    gpx: { type: "string", required: false },
    checkpoints: { type: "json", required: false }
  },
  computedFields
}));
var PostsOverview = defineDocumentType(() => ({
  name: "PostsOverview",
  filePathPattern: "posts/index.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    intro: { type: "string", required: false },
    description: { type: "string", required: false },
    updated: { type: "date", required: false }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Post, PostsOverview],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]
  }
});
export {
  Post,
  PostsOverview,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-D3W7LDWM.mjs.map
