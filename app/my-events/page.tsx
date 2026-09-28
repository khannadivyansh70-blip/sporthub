"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Participant = {
  name: string;
  phone: string;
  teamName?: string;
  eventId: string;
  joinedAt: string;
};

type EventData = {
  id: string;
  eventName: string;
  sport: string;
  location: string;
  date: string;
  format: string;
  teams: string;
  image?: string;
};

const demoEvents: Record<string, EventData> = {
  "noida-night-league": {
    id: "noida-night-league",
    eventName: "Noida Night League",
    sport: "Football",
    location: "Noida Stadium",
    date: "2026-10-03",
    format: "Knockout",
    teams: "8",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
  },

  "delhi-five-a-side": {
    id: "delhi-five-a-side",
    eventName: "Delhi Five-a-Side",
    sport: "Football",
    location: "Thyagaraj Sports Complex",
    date: "2026-10-04",
    format: "League",
    teams: "10",
    image:
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=1200&q=80",
  },

  "ncr-cricket-open": {
    id: "ncr-cricket-open",
    eventName: "NCR Cricket Open",
    sport: "Cricket",
    location: "Greater Noida",
    date: "2026-10-10",
    format: "Knockout",
    teams: "16",
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80",
  },

  "noida-badminton-open": {
    id: "noida-badminton-open",
    eventName: "Noida Badminton Open",
    sport: "Badminton",
    location: "Sector 62 Sports Club",
    date: "2026-10-11",
    format: "Knockout",
    teams: "32",
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
  },
};

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyEventsPage() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const joinedEvents: EventData[] = [];

    Object.keys(sessionStorage).forEach((key) => {
      if (!key.startsWith("sporthub-participant-")) {
        return;
      }

      try {
        const savedParticipant = sessionStorage.getItem(key);

        if (!savedParticipant) {
          return;
        }

        const parsedParticipant: Participant =
          JSON.parse(savedParticipant);

        if (!participant) {
          setParticipant(parsedParticipant);
        }

        const demoEvent = demoEvents[parsedParticipant.eventId];

        if (demoEvent) {
          joinedEvents.push(demoEvent);
        } else {
          const savedEvent = sessionStorage.getItem("sporthub-event");

          if (savedEvent) {
            const parsedEvent: EventData = JSON.parse(savedEvent);

            if (parsedEvent.id === parsedParticipant.eventId) {
              joinedEvents.push(parsedEvent);
            }
          }
        }
      } catch {
        console.error("Could not load joined event.");
      }
    });

    const uniqueEvents = joinedEvents.filter(
      (event, index, self) =>
        index === self.findIndex((item) => item.id === event.id)
    );

    setEvents(uniqueEvents);
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      {/* Header */}
      <section className="border-b border-[#e5e5e2] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <Link
            href="/explore"
            className="text-sm font-medium text-[#686c74] hover:text-[#15171b]"
          >
            ← Explore events
          </Link>

          <div className="mt-7">
            <p className="text-sm font-medium text-[#e94352]">
              Your activity
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#15171b] sm:text-4xl">
              My Events
            </h1>

            <p className="mt-2 max-w-2xl text-[#686c74]">
              Keep track of the events you’ve joined.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {events.length > 0 ? (
          <>
            {participant && (
              <div className="mb-8 rounded-2xl border border-[#e5e5e2] bg-white p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[#92969d]">
                  Registered as
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-semibold text-[#15171b]">
                    {participant.name}
                  </span>

                  {participant.teamName && (
                    <>
                      <span className="text-[#c4c4c0]">•</span>

                      <span className="text-sm text-[#686c74]">
                        {participant.teamName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#15171b]">
                  Joined events
                </h2>

                <p className="mt-1 text-sm text-[#686c74]">
                  {events.length} event{events.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  className="group overflow-hidden rounded-2xl border border-[#e5e5e2] bg-white transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className="h-52 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${event.image})`,
                    }}
                  />

                  <div className="p-5">
                    <p className="text-xs font-medium text-[#e94352]">
                      {event.sport}
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-[#15171b]">
                      {event.eventName}
                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-[#686c74]">
                      <p>{formatDate(event.date)}</p>

                      <p>{event.location}</p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#e5e5e2] pt-4">
                      <span className="text-sm font-medium text-[#258a55]">
                        ✓ Joined
                      </span>

                      <span className="text-sm font-medium text-[#e94352]">
                        View event →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-xl rounded-2xl border border-[#e5e5e2] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fdecef] text-2xl">
              ✦
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#15171b]">
              No events yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#686c74]">
              Once you join an event, it will appear here so you can easily
              find it again.
            </p>

            <Link
              href="/explore"
              className="mt-6 inline-flex rounded-lg bg-[#15171b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2a2c31]"
            >
              Explore events
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}