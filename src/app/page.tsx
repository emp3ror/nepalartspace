import { EventList } from "@/components/events/event-list";
import { getAllEvents } from "@/lib/mdx-events";

export default async function Home() {
  const events = await getAllEvents();

  return (
    <main className="min-h-screen bg-[#fffcf8] text-[#1a1a1a]">
      <EventList events={events} showBreadcrumb={false} />
    </main>
  );
}
