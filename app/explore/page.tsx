"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const sports = [
  "All",
  "Football",
  "Basketball",
  "Cricket",
  "Badminton",
  "Running",
  "Fitness",
  "Esports",
];

type Event = {
  id: string;
  sport: string;
  title: string;
  date: string;
  venue: string;
  price: string;
  image: string;
};

const events: Event[] = [
  {
    id: "noida-night-league",
    sport: "Football",
    title: "Noida Night League",
    date: "Sat, 3 Oct · 7:00 PM",
    venue: "Noida Stadium",
    price: "₹299",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "delhi-five-a-side",
    sport: "Football",
    title: "Delhi Five-a-Side",
    date: "Sun, 4 Oct · 5:30 PM",
    venue: "Thyagaraj Sports Complex",
    price: "₹399",
    image:
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ncr-cricket-open",
    sport: "Cricket",
    title: "NCR Cricket Open",
    date: "Sat, 10 Oct · 8:00 AM",
    venue: "Greater Noida",
    price: "₹499",
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "noida-badminton-open",
    sport: "Badminton",
    title: "Noida Badminton Open",
    date: "Sun, 11 Oct · 9:00 AM",
    venue: "Sector 62 Sports Club",
    price: "₹249",
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
  },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const selectedSport = searchParams.get("sport") || "All";

  const [searchInput, setSearchInput] = useState(search);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSport =
        selectedSport === "All" || event.sport === selectedSport;

      const searchableText = [
        event.title,
        event.sport,
        event.venue,
        event.date,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        query === "" || searchableText.includes(query);

      return matchesSport && matchesSearch;
    });
  }, [search, selectedSport]);

  const handleSportChange = (sport: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sport === "All") {
      params.delete("sport");
    } else {
      params.set("sport", sport);
    }

    router.push(
      params.toString() ? `/explore?${params.toString()}` : "/explore"
    );
  };

  const clearFilters = () => {
    setSearchInput("");
    router.push("/explore");
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <section className="border-b border-[#e5e5e2] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <p className="mb-2 text-sm font-medium text-[#e94352]">
            Discover
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-[#15171b] sm:text-4xl">
            Find your next game
          </h1>

          <p className="mt-2 max-w-2xl text-[#686c74]">
            Discover sports, tournaments and activities happening around you.
          </p>

          {search && (
            <p className="mt-4 text-sm text-[#686c74]">
              Showing results for{" "}
              <span className="font-semibold text-[#15171b]">
                “{search}”
              </span>
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-2">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => handleSportChange(sport)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedSport === sport
                  ? "bg-[#15171b] text-white"
                  : "border border-[#e0e0dc] bg-white text-[#555960] hover:border-[#c9c9c5]"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#15171b]">
              Upcoming events
            </h2>

            <p className="mt-1 text-sm text-[#686c74]">
              {filteredEvents.length} event
              {filteredEvents.length === 1 ? "" : "s"} found
            </p>
          </div>

          {(search || selectedSport !== "All") && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-[#e94352] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="group overflow-hidden rounded-2xl border border-[#e5e5e2] bg-white transition hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className="event-image h-52"
                  style={{
                    backgroundImage: `url(${event.image})`,
                  }}
                />

                <div className="p-4">
                  <p className="text-xs font-medium text-[#e94352]">
                    {event.sport}
                  </p>

                  <h3 className="mt-1 font-semibold text-[#15171b]">
                    {event.title}
                  </h3>

                  <p className="mt-3 text-sm text-[#686c74]">
                    {event.date}
                  </p>

                  <p className="mt-1 text-sm text-[#686c74]">
                    {event.venue}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#15171b]">
                      {event.price}
                    </span>

                    <span className="text-sm font-medium text-[#e94352]">
                      View event →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[#e5e5e2] bg-white px-6 py-14 text-center">
            <h3 className="text-lg font-semibold text-[#15171b]">
              No events found
            </h3>

            <p className="mt-2 text-sm text-[#686c74]">
              Try a different search or sport.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-[#15171b] px-4 py-2.5 text-sm font-medium text-white"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f7f5] px-5 py-20 text-center">
          <p className="text-sm text-[#686c74]">Loading events...</p>
        </main>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}