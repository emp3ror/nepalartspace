import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown, gfmToMarkdown } from "mdast-util-gfm";
import type { Options as GfmOptions } from "remark-gfm";

type HandlerMap = Record<string, (...args: unknown[]) => unknown>;

const ensureDataApi = (context: any) => {
  const store = context.data || (context.data = {});

  if (typeof context.getData !== "function") {
    context.getData = (key: string) => store[key];
  }

  if (typeof context.setData !== "function") {
    context.setData = (key: string, value?: unknown) => {
      if (typeof value === "undefined") {
        const previous = store[key];
        delete store[key];
        return previous;
      }
      store[key] = value;
      return value;
    };
  }
};

const wrapHandlers = (handlers?: HandlerMap) =>
  handlers
    ? Object.fromEntries(
        Object.entries(handlers).map(([key, handler]) => [
          key,
          function wrapped(this: unknown, ...args: unknown[]) {
            ensureDataApi(this);
            return handler.apply(this as any, args);
          },
        ]),
      )
    : undefined;

// remark-gfm pulls in a version of `mdast-util-from-markdown` that does not
// expose `getData`/`setData` helpers on the compile context, which the GFM
// table handlers expect. We manually register the same extensions but wrap
// their handlers so the data helpers always exist, preventing
// `this.setData is not a function` runtime errors when compiling MDX.
export function safeRemarkGfm(this: any, options: GfmOptions = {}) {
  const data = this.data();

  const patchedFromMarkdown = gfmFromMarkdown().map((extension) => ({
    ...extension,
    enter: wrapHandlers(extension.enter as HandlerMap | undefined),
    exit: wrapHandlers(extension.exit as HandlerMap | undefined),
  }));

  const add = (field: string, value: unknown) => {
    const list = data[field] ?? (data[field] = []);
    list.push(value);
  };

  add("micromarkExtensions", gfm(options));
  add("fromMarkdownExtensions", patchedFromMarkdown);
  add("toMarkdownExtensions", gfmToMarkdown(options));
}
