import { cache } from "react";

import { compileMDX } from "next-mdx-remote/rsc";

import { EventList } from "@/components/events/event-list";
import { EventSubmissionModalTrigger } from "@/components/events/event-submission-modal-trigger";
import { MdxContainer, mdxComponents } from "@/components/mdx/mdx";
import { SectionHeading } from "@/components/section-heading";
import { getAllEvents, getEventsOverview } from "@/lib/mdx-events";
import { safeRemarkGfm } from "@/lib/mdx-plugins";

const renderOverview = cache(async (source: string) => {
  const { content } = await compileMDX<{ [key: string]: unknown }>({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [safeRemarkGfm],
      },
    },
    components: mdxComponents,
  });

  return content;
});

export default async function EventsPage() {
  const [events, overview] = await Promise.all([getAllEvents(), getEventsOverview()]);
  const overviewContent = overview ? await renderOverview(overview.body) : null;

  return (
    <main className="min-h-screen bg-[#fffcf8] text-[#1a1a1a]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-10 pt-16">
        <div className="flex justify-end">
          <EventSubmissionModalTrigger />
        </div>

        <SectionHeading
          title={overview?.title ?? "Events and milestones"}
          description={overview?.description ?? "Add MDX entries under `content/events` to list upcoming or past items."}
        />

        {overview?.intro ? (
          <p className="max-w-3xl text-sm text-[color:var(--ink)]/70">{overview.intro}</p>
        ) : null}

        {overviewContent ? <MdxContainer>{overviewContent}</MdxContainer> : null}

        {overview?.updated ? (
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Updated {overview.updated}</p>
        ) : null}
      </div>

      <EventList events={events} />
    </main>
  );
}
