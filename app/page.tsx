"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Heart,
  MapPin,
  Search,
} from "lucide-react";
import { useState } from "react";
import { getSportImage } from "@/lib/sport-images";

const events = [
  {
    id: "noida-night-league",
    title: "Noida Night Basketball League",
    sport: "Basketball",
    date: "Oct 4",
    time: "7:00 PM",
    venue: "Noida Sports Complex",
    location: "Sector 21, Noida",
    price: "₹299",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "delhi-five-a-side",
    title: "Delhi Five-a-Side Football",
    sport: "Football",
    date: "Oct 5",
    time: "6:30 PM",
    venue: "PlayAll Arena",
    location: "Sector 62, Noida",
    price: "₹399",
    image: "hero-football.jpeg",
  },
  {
    id: "ncr-cricket-open",
    title: "NCR Cricket Open",
    sport: "Cricket",
    date: "Oct 6",
    time: "8:00 AM",
    venue: "Jaypee Greens Ground",
    location: "Greater Noida",
    price: "₹499",
    image: "hero-cricket.jpeg",
  },
  {
    id: "noida-badminton-open",
    title: "Noida Badminton Open",
    sport: "Badminton",
    date: "Oct 7",
    time: "10:00 AM",
    venue: "Smash Arena",
    location: "Sector 137, Noida",
    price: "₹199",
    image: "hero-badminton.jpeg",
  },
];

const categories = [
  { name: "Football", image: getSportImage("Football") },
  { name: "Basketball", image: getSportImage("Basketball") },
  { name: "Cricket", image: getSportImage("Cricket") },
  { name: "Badminton", image: getSportImage("Badminton") },
  { name: "Running", image: getSportImage("Running") },
  { name: "Fitness", image: getSportImage("Fitness") },
  { name: "Esports", image: getSportImage("Esports") },
  { name: "More" },
];

export default function HomePage() {
  const [search, setSearch] = useState("");

  const searchEvents = events.filter((event) => {
    const text = search.toLowerCase().trim();

    if (!text) {
      return true;
    }

    return (
      event.title.toLowerCase().includes(text) ||
      event.sport.toLowerCase().includes(text) ||
      event.venue.toLowerCase().includes(text)
    );
  });

  function goToEvents() {
    const eventsSection = document.getElementById("events");

    if (eventsSection) {
      eventsSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto max-w-[1400px] px-6 pt-4 md:px-10">
        <div
          className="relative min-h-[510px] overflow-hidden rounded-2xl bg-black bg-cover bg-center"
          style={{
            backgroundImage: "url(/hero-basketball.jpeg.jpg)",
          }}
        >
          <div className="absolute inset-0 bg-black/65" />

          <div className="relative flex min-h-[510px] items-center px-8 py-12 md:px-16">
            <div className="max-w-3xl text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
                Sports & more near you
              </p>

              <h1 className="mt-5 text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
                Play.
                <br />
                What you play best.
              </h1>

              <p className="mt-6 text-lg text-white/85">
                Find events, join them, enjoy.
              </p>

              <div className="mt-7 flex max-w-2xl overflow-hidden rounded-xl bg-white p-1">
                <Search className="ml-4 mt-3 h-5 w-5 shrink-0 text-zinc-500" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Try a event near you"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-black outline-none"
                />

                <button
                  onClick={goToEvents}
                  className="rounded-lg bg-[var(--brand)] px-6 font-semibold text-white"
                >
                  Search
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/30 px-4 py-2 text-sm">
                  Nearby You
                </span>

                <span className="rounded-full border border-white/30 px-4 py-2 text-sm">
                  Any time
                </span>

                <span className="rounded-full border border-white/30 px-4 py-2 text-sm">
                  All sports and events 
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 pt-4 md:px-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={
                category.name === "More"
                  ? "/explore"
                  : `/explore?sport=${category.name}`
              }
              className="group flex flex-col items-center justify-center"
            >
              {category.name === "More" ? (
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-100 text-2xl font-bold">
                  •••
                </div>
              ) : (
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-24 w-24 rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}

              <span className="mt-2 text-sm font-medium">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="events"
        className="mx-auto max-w-[1320px] px-6 py-12 md:px-10"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_315px]">
          <div>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">Popular near Noida</h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Checkout events happening near you.
                </p>
              </div>

              <Link
                href="/explore"
                className="flex items-center gap-1 text-sm font-semibold text-[var(--brand)]"
              >
                See all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {searchEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition hover:shadow-md"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-semibold text-white">
                      {event.sport}
                    </span>

                    <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white">
                      <Heart className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold leading-snug">{event.title}</h3>

                    <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {event.date} · {event.time}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.venue}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
                      <div>
                        <p className="text-xs text-[var(--subtle)]">
                          Starting from
                        </p>

                        <p className="font-bold">{event.price}</p>
                      </div>

                      <span className="rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white">
                        View event
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-[var(--border)] bg-white">
            <div className="border-b border-[var(--border)] p-5">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[var(--brand)]" />

                <h2 className="font-bold">Events upcoming</h2>
              </div>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {events.slice(0, 3).map((event) => (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  className="block p-5 transition hover:bg-[var(--surface-soft)]"
                >
                  <p className="text-sm font-bold">{event.title}</p>

                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {event.date} · {event.time}
                  </p>

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {event.location}
                  </p>
                </Link>
              ))}
            </div>

            <Link
              href="/explore"
              className="flex items-center justify-between p-5 text-sm font-semibold text-[var(--brand)]"
            >
              Explore all events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 pb-14 md:px-10">
        <div className="rounded-2xl bg-[var(--foreground)] px-7 py-10 text-white md:flex md:items-center md:justify-between md:px-10">
          <div>
            <p className="text-sm text-white/60">Have a game coming up?</p>

            <h2 className="mt-1 text-3xl font-bold">
              Host it on EventMade.
            </h2>

            <p className="mt-2 max-w-xl text-sm text-white/65">
              Create your event, invite players and manage everything in one
              place.
            </p>
          </div>

          <Link
            href="/create"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] md:mt-0"
          >
            Host an event
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}