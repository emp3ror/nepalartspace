// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
var postComputedFields = {
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
var eventComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.replace(/^events\//, "")
  },
  url: {
    type: "string",
    resolve: (doc) => `/events/${doc._raw.flattenedPath.replace(/^events\//, "")}`
  }
};
var getArtCollegeSlug = (doc) => {
  const flattenedPath = doc._raw.flattenedPath.replace(/^art-college\/?/, "");
  const withoutIndex = flattenedPath.replace(/\/index$/, "");
  return withoutIndex === "index" ? "" : withoutIndex;
};
var artCollegeComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => getArtCollegeSlug(doc)
  },
  url: {
    type: "string",
    resolve: (doc) => {
      const slug = getArtCollegeSlug(doc);
      return slug ? `/art-college/${slug}` : "/art-college";
    }
  }
};
var Post = defineDocumentType(() => ({
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
      required: true
    },
    tags: { type: "list", of: { type: "string" }, required: true },
    cover: { type: "string", required: false },
    featured: { type: "boolean", required: false },
    template: { type: "string", required: false },
    gpx: { type: "string", required: false },
    checkpoints: { type: "json", required: false }
  },
  computedFields: postComputedFields
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
var Event = defineDocumentType(() => ({
  name: "Event",
  filePathPattern: "events/**/!(*index).mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    endDate: { type: "date", required: false },
    startTime: { type: "string", required: false },
    endTime: { type: "string", required: false },
    category: { type: "string", required: false },
    location: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    cover: { type: "string", required: false },
    registrationUrl: { type: "string", required: false }
  },
  computedFields: eventComputedFields
}));
var EventsOverview = defineDocumentType(() => ({
  name: "EventsOverview",
  filePathPattern: "events/index.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    intro: { type: "string", required: false },
    description: { type: "string", required: false },
    updated: { type: "date", required: false }
  }
}));
var ArtCollegeOverview = defineDocumentType(() => ({
  name: "ArtCollegeOverview",
  filePathPattern: "art-college/index.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    intro: { type: "string", required: false },
    description: { type: "string", required: false },
    updated: { type: "date", required: false }
  },
  computedFields: artCollegeComputedFields
}));
var ArtCollegeSection = defineDocumentType(() => ({
  name: "ArtCollegeSection",
  filePathPattern: "art-college/*/**/index.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    intro: { type: "string", required: false },
    description: { type: "string", required: false },
    order: { type: "number", required: false }
  },
  computedFields: artCollegeComputedFields
}));
var ArtCollegeLesson = defineDocumentType(() => ({
  name: "ArtCollegeLesson",
  filePathPattern: "art-college/**/!(*index).mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    date: { type: "date", required: false },
    updated: { type: "date", required: false }
  },
  computedFields: artCollegeComputedFields
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [
    Post,
    PostsOverview,
    Event,
    EventsOverview,
    ArtCollegeOverview,
    ArtCollegeSection,
    ArtCollegeLesson
  ],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]
  }
});
export {
  ArtCollegeLesson,
  ArtCollegeOverview,
  ArtCollegeSection,
  Event,
  EventsOverview,
  Post,
  PostsOverview,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-WHWSYSNJ.mjs.map
