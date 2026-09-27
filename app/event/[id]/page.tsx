"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Trophy,
  Search,
  MapPin,
  CalendarDays,
  Users,
  Settings,
  Link as LinkIcon,
  Check,
} from "lucide-react";

type EventData = {
  id: string;
  eventName: string;
  sport: string;
  location: string;
  date: string;
  format: string;
  teams: number;
};

type Team = {
  id: number;
  name: string;
  captain: string;
};

type Match = {
  id: number;
  round: string;
  team1: string;
  team2: string;
  score1: number | null;
  score2: number | null;
  status: "Upcoming" | "Completed";
  winner: string | null;
};

const ROUND_ORDER = [
  "Round of 32",
  "Round of 16",
  "Quarterfinals",
  "Semifinals",
  "Final",
];

export default function SharedEventPage() {
  const params = useParams();

  const eventId = params.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedEvent = sessionStorage.getItem("sporthub-event");
    const savedTeams = sessionStorage.getItem("sporthub-teams");
    const savedMatches = sessionStorage.getItem("sporthub-matches");

    if (!savedEvent) {
      setLoading(false);
      return;
    }

    try {
      const parsedEvent: EventData = JSON.parse(savedEvent);

      if (parsedEvent.id === eventId) {
        setEvent(parsedEvent);
      }

      if (savedTeams) {
        setTeams(JSON.parse(savedTeams));
      }

      if (savedMatches) {
        setMatches(JSON.parse(savedMatches));
      }
    } catch (error) {
      console.error("Could not load event:", error);
    }

    setLoading(false);
  }, [eventId]);

  async function copyEventLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Could not copy event link:", error);
    }
  }

  function getMatchesForRound(round: string) {
    return matches.filter((match) => match.round === round);
  }

  const completedMatches = matches.filter(
    (match) => match.status === "Completed"
  );

  const finalMatch = matches.find(
    (match) => match.round === "Final"
  );

  const champion =
    finalMatch?.status === "Completed"
      ? finalMatch.winner
      : null;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <Trophy className="mx-auto h-10 w-10 text-zinc-600" />

          <p className="mt-4 text-zinc-400">
            Loading event...
          </p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <div className="text-center">
          <Search className="mx-auto h-12 w-12 text-zinc-600" />

          <h1 className="mt-6 text-3xl font-bold">
            Event not found
          </h1>

          <p className="mt-3 text-zinc-400">
            This event could not be found in this browser.
          </p>

          <a
            href="/create"
            className="mt-7 inline-block rounded-lg bg-amber-500 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-amber-400"
          >
            Create an Event
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HEADER */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <a
            href="/"
            className="text-xl font-bold"
          >
            Sport<span className="text-amber-500">Hub</span>
          </a>

          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Event Active
          </span>

        </div>
      </header>

      {/* MAIN */}
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* EVENT HERO */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center sm:p-12">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-amber-500/10">
            <Trophy className="h-8 w-8 text-amber-400" />
          </div>

          <div className="mt-6 inline-flex rounded-full bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
            {event.sport}
          </div>

          <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
            {event.eventName}
          </h1>

          <div className="mt-6 flex flex-col justify-center gap-3 text-zinc-400 sm:flex-row sm:gap-8">

            <span className="flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>

            <span className="flex items-center justify-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {event.date}
            </span>

          </div>

        </section>

        {/* EVENT INFO */}
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">
            <p className="text-sm text-zinc-400">
              Sport
            </p>

            <p className="mt-2 text-xl font-bold">
              {event.sport}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">
            <p className="text-sm text-zinc-400">
              Format
            </p>

            <p className="mt-2 text-xl font-bold">
              {event.format}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">
            <p className="text-sm text-zinc-400">
              Teams
            </p>

            <p className="mt-2 text-xl font-bold">
              {teams.length || event.teams}
            </p>
          </div>

        </section>

        {/* TOURNAMENT STATUS */}
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">
            <p className="text-sm text-zinc-400">
              Registered Teams
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-400">
              {teams.length}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">
            <p className="text-sm text-zinc-400">
              Matches
            </p>

            <p className="mt-2 text-3xl font-bold">
              {completedMatches.length}
              <span className="text-lg text-zinc-500">
                /{matches.length}
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">
            <p className="text-sm text-zinc-400">
              Status
            </p>

            <p className="mt-2 text-xl font-bold">
              {champion ? "Completed" : "In Progress"}
            </p>
          </div>

        </section>

        {/* CHAMPION */}
        {champion && (
          <section className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">

            <Trophy className="mx-auto h-12 w-12 text-amber-400" />

            <p className="mt-4 text-sm uppercase tracking-widest text-amber-400">
              Tournament Champion
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {champion}
            </h2>

            <p className="mt-3 text-zinc-400">
              Congratulations to the tournament winner!
            </p>

          </section>
        )}

        {/* TEAMS */}
        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">

          <div className="mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-zinc-400" />
            <h2 className="text-2xl font-bold">
              Teams
            </h2>
          </div>

          <p className="-mt-4 mb-6 text-zinc-400">
            Teams registered for this tournament.
          </p>

          {teams.length === 0 ? (
            <p className="rounded-lg bg-zinc-950 p-6 text-center text-zinc-500">
              No teams have been added yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {teams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                >
                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/10">
                      <Users className="h-5 w-5 text-amber-500" />
                    </div>

                    <div>
                      <h3 className="font-bold">
                        {team.name}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        Captain: {team.captain}
                      </p>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </section>

        {/* TOURNAMENT BRACKET */}
        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">

          <div className="mb-8 text-center">

            <Trophy className="mx-auto h-9 w-9 text-zinc-600" />

            <h2 className="mt-4 text-2xl font-bold">
              Tournament Bracket
            </h2>

            <p className="mt-2 text-zinc-400">
              Live tournament matches and results.
            </p>

          </div>

          {matches.length === 0 ? (
            <div className="rounded-xl bg-zinc-950 p-8 text-center">

              <p className="text-zinc-400">
                Tournament fixtures have not been generated yet.
              </p>

              <a
                href="/event"
                className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-amber-400"
              >
                Manage Tournament
              </a>

            </div>
          ) : (
            <div className="space-y-8">

              {ROUND_ORDER.map((round) => {

                const roundMatches = getMatchesForRound(round);

                if (roundMatches.length === 0) {
                  return null;
                }

                return (
                  <div key={round}>

                    <div className="mb-4 flex items-center gap-3">

                      <div className="h-px flex-1 bg-zinc-800" />

                      <h3 className="rounded-full bg-amber-500/10 px-5 py-2 text-sm font-bold text-amber-400">
                        {round}
                      </h3>

                      <div className="h-px flex-1 bg-zinc-800" />

                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                      {roundMatches.map((match) => (

                        <div
                          key={match.id}
                          className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                        >

                          <div className="mb-4 flex items-center justify-between">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                match.status === "Completed"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-amber-500/10 text-amber-400"
                              }`}
                            >
                              {match.status}
                            </span>

                            <span className="text-xs text-zinc-600">
                              Match #{match.id}
                            </span>

                          </div>

                          <div className="space-y-3">

                            {/* TEAM 1 */}
                            <div
                              className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                                match.winner === match.team1
                                  ? "bg-emerald-500/10"
                                  : "bg-zinc-900"
                              }`}
                            >

                              <span
                                className={`font-semibold ${
                                  match.winner === match.team1
                                    ? "text-emerald-400"
                                    : ""
                                }`}
                              >
                                {match.team1}
                              </span>

                              <span className="text-xl font-bold">
                                {match.score1 !== null
                                  ? match.score1
                                  : "—"}
                              </span>

                            </div>

                            {/* TEAM 2 */}
                            <div
                              className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                                match.winner === match.team2
                                  ? "bg-emerald-500/10"
                                  : "bg-zinc-900"
                              }`}
                            >

                              <span
                                className={`font-semibold ${
                                  match.winner === match.team2
                                    ? "text-emerald-400"
                                    : ""
                                }`}
                              >
                                {match.team2}
                              </span>

                              <span className="text-xl font-bold">
                                {match.score2 !== null
                                  ? match.score2
                                  : "—"}
                              </span>

                            </div>

                          </div>

                          {match.winner && (
                            <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-emerald-400">
                              <Check className="h-4 w-4" />
                              Winner: {match.winner}
                            </div>
                          )}

                        </div>

                      ))}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* MANAGE TOURNAMENT */}
        <section className="mt-8 text-center">

          <a
            href="/event"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-amber-400"
          >
            <Settings className="h-4 w-4" />
            Manage Tournament
          </a>

        </section>

        {/* EVENT ID */}
        <section className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">

          <p className="text-sm text-zinc-400">
            Event ID
          </p>

          <p className="mt-2 font-mono text-lg font-semibold text-amber-400">
            {event.id}
          </p>

        </section>

        {/* SHARE */}
        <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">

          <h3 className="text-lg font-semibold">
            Share this event
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            Share this unique event link with players and spectators.
          </p>

          <div className="mt-4 break-all rounded-lg bg-zinc-950 px-4 py-3 font-mono text-sm text-amber-400">
            {typeof window !== "undefined"
              ? window.location.href
              : `/event/${event.id}`}
          </div>

          <button
            onClick={copyEventLink}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-amber-400"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Link Copied!
              </>
            ) : (
              <>
                <LinkIcon className="h-4 w-4" />
                Copy Event Link
              </>
            )}
          </button>

        </section>

      </div>

    </main>
  );
}
