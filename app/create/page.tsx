"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

    const event = {
      eventName,
      sport,
      location,
      date,
      format,
      teams: Number(teams),
    };

    sessionStorage.setItem("sporthub-event", JSON.stringify(event));

    router.push("/event");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">

        <div className="mb-10">
          <a
            href="/"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to SportHub
          </a>

          <h1 className="mt-6 text-4xl font-bold">
            Create an Event 🏆
          </h1>

          <p className="mt-3 text-slate-400">
            Set up your sports event and start managing your tournament.
          </p>
        </div>

        <form
          onSubmit={handleCreateEvent}
          className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-8"
        >

          {/* Event Name */}
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
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-blue-500"
            />
          </div>

          {/* Sport */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Sport
            </label>

            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
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

          {/* Location */}
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
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Event Date
            </label>

            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Format */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Tournament Format
            </label>

            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option>Knockout</option>
              <option>League</option>
              <option>Group Stage + Knockout</option>
            </select>
          </div>

          {/* Teams */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Number of Teams
            </label>

            <select
              value={teams}
              onChange={(e) => setTeams(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option>4</option>
              <option>6</option>
              <option>8</option>
              <option>12</option>
              <option>16</option>
              <option>32</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold transition hover:bg-blue-500"
          >
            Create Event 🚀
          </button>

        </form>
      </div>
    </main>
  );
}