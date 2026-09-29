"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSportImage, sportImages } from "@/lib/sport-images";





function getEventImage(sport: string, eventName: string) {
  // First preference: selected sport
  if (sportImages[sport]) {
    return sportImages[sport];
  }

  // Fallback: try to understand the event name
  const name = eventName.toLowerCase();

  if (name.includes("basketball") || name.includes("hoops")) {
    return sportImages.Basketball;
  }

  if (name.includes("football") || name.includes("soccer")) {
    return sportImages.Football;
  }

  if (name.includes("cricket")) {
    return sportImages.Cricket;
  }

  if (name.includes("badminton")) {
    return sportImages.Badminton;
  }

  if (name.includes("running") || name.includes("run") || name.includes("marathon")) {
    return sportImages.Running;
  }

  if (name.includes("fitness") || name.includes("gym")) {
    return sportImages.Fitness;
  }

  if (name.includes("esports") || name.includes("gaming")) {
    return sportImages.Esports;
  }

  // Safe fallback
  return sportImages.Football;
}

export default function CreateEventPage() {
  const router = useRouter();

  const [eventName, setEventName] = useState("");
  const [sport, setSport] = useState("Basketball");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [format, setFormat] = useState("Knockout");
  const [teams, setTeams] = useState("8");

  const eventImage = getEventImage(sport, eventName);

  function handleCreateEvent() {
    if (!eventName.trim() || !location.trim() || !date) {
      alert("Please fill in the event name, location and date.");
      return;
    }

    const eventId = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const event = {
      id: eventId,
      eventName: eventName.trim(),
      sport,
      location: location.trim(),
      date,
      format,
      teams,
      image: eventImage,
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem("sporthub-event", JSON.stringify(event));

    sessionStorage.removeItem("sporthub-teams");
    sessionStorage.removeItem("sporthub-matches");

    router.push(`/event/${eventId}`);
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* Form */}
          <div>
            <p className="text-sm font-medium text-[#e94352]">
              Host an event
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#15171b] sm:text-4xl">
              Create your event
            </h1>

            <p className="mt-2 max-w-xl text-[#686c74]">
              Set up your game, tournament or activity and invite people to
              join.
            </p>

            <div className="mt-8 rounded-2xl border border-[#e5e5e2] bg-white p-6 sm:p-8">
              <div className="space-y-6">
                {/* Event name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#15171b]">
                    Event name
                  </label>

                  <input
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Noida Basketball Night"
                    className="w-full rounded-xl border border-[#d6d6d2] px-4 py-3 text-sm outline-none focus:border-[#e94352]"
                  />
                </div>

                {/* Sport */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#15171b]">
                    Sport
                  </label>

                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full rounded-xl border border-[#d6d6d2] bg-white px-4 py-3 text-sm outline-none focus:border-[#e94352]"
                  >
                    <option>Basketball</option>
                    <option>Football</option>
                    <option>Cricket</option>
                    <option>Badminton</option>
                    <option>Running</option>
                    <option>Fitness</option>
                    <option>Esports</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#15171b]">
                    Location
                  </label>

                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Noida Stadium"
                    className="w-full rounded-xl border border-[#d6d6d2] px-4 py-3 text-sm outline-none focus:border-[#e94352]"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#15171b]">
                    Date
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-[#d6d6d2] px-4 py-3 text-sm outline-none focus:border-[#e94352]"
                  />
                </div>

                {/* Format + teams */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#15171b]">
                      Format
                    </label>

                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full rounded-xl border border-[#d6d6d2] bg-white px-4 py-3 text-sm outline-none focus:border-[#e94352]"
                    >
                      <option>Knockout</option>
                      <option>League</option>
                      <option>League + Knockout</option>
                      <option>Friendly</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#15171b]">
                      Teams / players
                    </label>

                    <input
                      type="number"
                      min="2"
                      value={teams}
                      onChange={(e) => setTeams(e.target.value)}
                      className="w-full rounded-xl border border-[#d6d6d2] px-4 py-3 text-sm outline-none focus:border-[#e94352]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCreateEvent}
                  className="w-full rounded-xl bg-[#15171b] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2a2c30]"
                >
                  Create event
                </button>
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div>
            <p className="mb-3 text-sm font-medium text-[#686c74]">
              Live preview
            </p>

            <div className="overflow-hidden rounded-2xl border border-[#e5e5e2] bg-white">
              <div
                className="event-image h-64"
                style={{
                  backgroundImage: `url(${eventImage})`,
                }}
              />

              <div className="p-5">
                <p className="text-xs font-medium text-[#e94352]">
                  {sport}
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#15171b]">
                  {eventName || "Your event name"}
                </h2>

                <p className="mt-3 text-sm text-[#686c74]">
                  {date || "Choose a date"}
                </p>

                <p className="mt-1 text-sm text-[#686c74]">
                  {location || "Add a location"}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#eeeeeb] pt-4 text-sm">
                  <span className="text-[#686c74]">
                    {format}
                  </span>

                  <span className="font-medium text-[#15171b]">
                    {teams} teams
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}