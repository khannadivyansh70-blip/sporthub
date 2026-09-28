"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

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
  },
  "delhi-five-a-side": {
    id: "delhi-five-a-side",
    eventName: "Delhi Five-a-Side",
    sport: "Football",
    location: "Thyagaraj Sports Complex",
    date: "2026-10-04",
    format: "League",
    teams: "10",
  },
  "ncr-cricket-open": {
    id: "ncr-cricket-open",
    eventName: "NCR Cricket Open",
    sport: "Cricket",
    location: "Greater Noida",
    date: "2026-10-10",
    format: "Knockout",
    teams: "16",
  },
  "noida-badminton-open": {
    id: "noida-badminton-open",
    eventName: "Noida Badminton Open",
    sport: "Badminton",
    location: "Sector 62 Sports Club",
    date: "2026-10-11",
    format: "Knockout",
    teams: "32",
  },
};

const sportImages: Record<string, string> = {
  Football:
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1600&q=85",
  Basketball:
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=85",
  Cricket:
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1600&q=85",
  Badminton:
    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1600&q=85",
  Running:
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=85",
  Fitness:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=85",
  Esports:
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=85",
};

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joined, setJoined] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    const demoEvent = demoEvents[id];

    if (demoEvent) {
      setEvent({
        ...demoEvent,
        image: sportImages[demoEvent.sport],
      });
      setLoading(false);
      return;
    }

    try {
      const savedEvent = sessionStorage.getItem("sporthub-event");

      if (savedEvent) {
        const parsedEvent: EventData = JSON.parse(savedEvent);

        if (parsedEvent.id === id) {
          setEvent({
            ...parsedEvent,
            image:
              parsedEvent.image ||
              sportImages[parsedEvent.sport] ||
              sportImages.Football,
          });
        }
      }
    } catch {
      console.error("Could not load event.");
    }

    setLoading(false);
  }, [id]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      return;
    }

    const participant = {
      name: name.trim(),
      phone: phone.trim(),
      teamName: teamName.trim(),
      eventId: id,
      joinedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(
      `sporthub-participant-${id}`,
      JSON.stringify(participant)
    );

    setJoined(true);
    setShowJoinForm(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-5 py-20 text-center">
        <p className="text-sm text-[#686c74]">Loading event...</p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-5 py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#e5e5e2] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-[#15171b]">
            Event not found
          </h1>

          <p className="mt-2 text-sm text-[#686c74]">
            This event may have been removed or is no longer available.
          </p>

          <Link
            href="/explore"
            className="mt-6 inline-flex rounded-lg bg-[#15171b] px-5 py-3 text-sm font-medium text-white"
          >
            Explore events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#15171b]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${event.image || sportImages.Football})`,
          }}
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <Link
            href="/explore"
            className="inline-flex text-sm font-medium text-white/80 transition hover:text-white"
          >
            ← Back to events
          </Link>

          <div className="mt-12 max-w-3xl">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {event.sport}
            </span>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              {event.eventName}
            </h1>

            <p className="mt-5 text-base text-white/80 sm:text-lg">
              {formatDate(event.date)} · {event.location}
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* About */}
          <div className="rounded-2xl border border-[#e5e5e2] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#15171b]">
              About this event
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-[#686c74]">
              Join the action and compete with other players in this
              {` ${event.sport.toLowerCase()}`} event. Check the event details
              below and register your spot.
            </p>
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-[#e5e5e2] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#15171b]">
              Event details
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#92969d]">
                  Date
                </p>
                <p className="mt-1 font-medium text-[#15171b]">
                  {formatDate(event.date)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#92969d]">
                  Sport
                </p>
                <p className="mt-1 font-medium text-[#15171b]">
                  {event.sport}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#92969d]">
                  Format
                </p>
                <p className="mt-1 font-medium text-[#15171b]">
                  {event.format}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#92969d]">
                  Teams / slots
                </p>
                <p className="mt-1 font-medium text-[#15171b]">
                  {event.teams}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-[#e5e5e2] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#15171b]">Location</h2>

            <p className="mt-3 text-[#686c74]">{event.location}</p>

            <div className="mt-5 flex h-48 items-center justify-center rounded-xl bg-[#f1f1ef]">
              <span className="text-sm text-[#92969d]">
                Map preview coming soon
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-[#e5e5e2] bg-white p-6">
            {joined ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf7ef] text-xl text-[#258a55]">
                  ✓
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[#15171b]">
                  You’re in!
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#686c74]">
                  Your spot for <strong>{event.eventName}</strong> has been
                  registered on this device.
                </p>

                <button
                  onClick={() => setJoined(false)}
                  className="mt-6 w-full rounded-lg border border-[#d6d6d2] px-4 py-3 text-sm font-medium text-[#15171b] transition hover:bg-[#f7f7f5]"
                >
                  View registration
                </button>
              </>
            ) : (
              <>
                <p className="text-xs font-medium uppercase tracking-wide text-[#92969d]">
                  Want to play?
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#15171b]">
                  Join this event
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#686c74]">
                  Register your interest and get your spot in the event.
                </p>

                <button
                  onClick={() => setShowJoinForm(true)}
                  className="mt-6 w-full rounded-lg bg-[#e94352] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d93645]"
                >
                  Join event
                </button>

                <p className="mt-3 text-center text-xs text-[#92969d]">
                  Free registration
                </p>
              </>
            )}

            <div className="my-6 h-px bg-[#e5e5e2]" />

            <Link
              href="/explore"
              className="block text-center text-sm font-medium text-[#15171b] hover:underline"
            >
              Browse more events
            </Link>

            {!demoEvents[id] && (
              <Link
                href="/event"
                className="mt-4 block text-center text-sm font-medium text-[#e94352]"
              >
                Manage event →
              </Link>
            )}
          </div>
        </aside>
      </section>

      {/* Join modal */}
      {showJoinForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 py-8">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#e94352]">
                  Join event
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-[#15171b]">
                  {event.eventName}
                </h2>
              </div>

              <button
                onClick={() => setShowJoinForm(false)}
                className="rounded-lg px-2 py-1 text-xl text-[#686c74] hover:bg-[#f1f1ef]"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleJoin} className="mt-7 space-y-5">
              <div>
                <label className="text-sm font-medium text-[#15171b]">
                  Your name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-2 w-full rounded-lg border border-[#d6d6d2] px-3 py-3 text-sm outline-none focus:border-[#e94352]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#15171b]">
                  Phone number
                </label>

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="Enter your phone number"
                  className="mt-2 w-full rounded-lg border border-[#d6d6d2] px-3 py-3 text-sm outline-none focus:border-[#e94352]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#15171b]">
                  Team name
                  <span className="ml-1 font-normal text-[#92969d]">
                    (optional)
                  </span>
                </label>

                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Noida Strikers"
                  className="mt-2 w-full rounded-lg border border-[#d6d6d2] px-3 py-3 text-sm outline-none focus:border-[#e94352]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#e94352] px-4 py-3 font-semibold text-white transition hover:bg-[#d93645]"
              >
                Confirm registration
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}