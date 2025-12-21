// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkCodeTitles from "remark-code-titles";
import remarkGfm from "remark-gfm";
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
      options: ["tech", "personal", "art"],
      required: true
    },
    tags: { type: "list", of: { type: "string" }, required: true },
    cover: { type: "string", required: false }
  },
  computedFields
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm, remarkCodeTitles],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]
  }
});
export {
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-PYQAQQPJ.mjs.map
