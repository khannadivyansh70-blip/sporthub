"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

function generateEventId() {
  return Math.random().toString(36).substring(2, 8);
}

export default function CreateEvent() {
  const router = useRouter();

  const [eventName, setEventName] = useState("");
  const [sport, setSport] = useState("Basketball");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [format, setFormat] = useState("Knockout");
  const [teams, setTeams] = useState("8");

  function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();

    const eventId = generateEventId();

    const event = {
      id: eventId,
      eventName,
      sport,
      location,
      date,
      format,
      teams: Number(teams),
    };

    sessionStorage.setItem(
      "sporthub-event",
      JSON.stringify(event)
    );

    sessionStorage.removeItem("sporthub-teams");
    sessionStorage.removeItem("sporthub-matches");

    router.push(`/event/${eventId}`);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">

        <div className="mb-10">
          <a
            href="/"
            className="flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to SportHub
          </a>

          <h1 className="mt-6 text-3xl font-bold">
            Create an event
          </h1>

          <p className="mt-3 text-zinc-400">
            Set up your sports event and start managing your tournament.
          </p>
        </div>

        <form
          onSubmit={handleCreateEvent}
          className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8"
        >

          <div>
            <label className="mb-2 block text-sm font-medium">
              Event Name
            </label>

            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Noida Basketball Cup 2026"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Sport
            </label>

            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-amber-500"
            >
              <option>Basketball</option>
              <option>Football</option>
              <option>Cricket</option>
              <option>Volleyball</option>
              <option>Badminton</option>
              <option>Table Tennis</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Location
            </label>

            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Noida Sports Complex"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Event Date
            </label>

            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Tournament Format
            </label>

            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-amber-500"
            >
              <option>Knockout</option>
              <option>League</option>
              <option>Group Stage + Knockout</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Number of Teams
            </label>

            <select
              value={teams}
              onChange={(e) => setTeams(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-amber-500"
            >
              <option>4</option>
              <option>6</option>
              <option>8</option>
              <option>12</option>
              <option>16</option>
              <option>32</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-amber-500 px-6 py-4 font-semibold text-zinc-950 transition hover:bg-amber-400"
          >
            Create Event
          </button>

        </form>
      </div>
    </main>
  );
}
