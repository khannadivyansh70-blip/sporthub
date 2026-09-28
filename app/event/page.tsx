"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

type Team = {
  id: number;
  name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
};

type Match = {
  id: number;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "Upcoming" | "Completed";
};

const defaultTeams: Team[] = [];

const defaultMatches: Match[] = [];

function formatDate(date: string) {
  if (!date) return "Date to be announced";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function createTeam(name: string): Team {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0,
  };
}

export default function OrganizerEventPage() {
  const [event, setEvent] = useState<EventData | null>(null);

  const [teams, setTeams] = useState<Team[]>(defaultTeams);

  const [matches, setMatches] = useState<Match[]>(defaultMatches);

  const [activeTab, setActiveTab] = useState<
    "Overview" | "Teams" | "Fixtures" | "Standings"
  >("Overview");

  const [newTeam, setNewTeam] = useState("");

  const [message, setMessage] = useState("");

  const [loaded, setLoaded] = useState(false);

  // --------------------------------------------------
  // LOAD EVENT + SAVED DATA
  // --------------------------------------------------

  useEffect(() => {
    try {
      const savedEvent = sessionStorage.getItem("sporthub-event");

      const savedTeams = sessionStorage.getItem("sporthub-teams");

      const savedMatches = sessionStorage.getItem("sporthub-matches");

      if (savedEvent) {
        const parsedEvent: EventData = JSON.parse(savedEvent);

        setEvent(parsedEvent);
      }

      if (savedTeams) {
        const parsedTeams: Team[] = JSON.parse(savedTeams);

        if (Array.isArray(parsedTeams)) {
          setTeams(parsedTeams);
        }
      }

      if (savedMatches) {
        const parsedMatches: Match[] = JSON.parse(savedMatches);

        if (Array.isArray(parsedMatches)) {
          setMatches(parsedMatches);
        }
      }
    } catch (error) {
      console.error("Could not load organizer data:", error);
    }

    setLoaded(true);
  }, []);

  // --------------------------------------------------
  // SAVE TEAMS
  // --------------------------------------------------

  useEffect(() => {
    if (!loaded) return;

    sessionStorage.setItem(
      "sporthub-teams",
      JSON.stringify(teams)
    );
  }, [teams, loaded]);

  // --------------------------------------------------
  // SAVE MATCHES
  // --------------------------------------------------

  useEffect(() => {
    if (!loaded) return;

    sessionStorage.setItem(
      "sporthub-matches",
      JSON.stringify(matches)
    );
  }, [matches, loaded]);

  // --------------------------------------------------
  // STATS
  // --------------------------------------------------

  const completedMatches = matches.filter(
    (match) => match.status === "Completed"
  ).length;

  const upcomingMatches = matches.filter(
    (match) => match.status === "Upcoming"
  ).length;

  const progress =
    matches.length === 0
      ? 0
      : Math.round(
          (completedMatches / matches.length) * 100
        );

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }

      return a.name.localeCompare(b.name);
    });
  }, [teams]);

  // --------------------------------------------------
  // MESSAGE
  // --------------------------------------------------

  function showMessage(text: string) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  // --------------------------------------------------
  // ADD TEAM
  // --------------------------------------------------

  function addTeam() {
    const name = newTeam.trim();

    if (!name) {
      showMessage("Enter a team name first.");
      return;
    }

    const alreadyExists = teams.some(
      (team) => team.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      showMessage("That team already exists.");
      return;
    }

    const team = createTeam(name);

    setTeams((current) => [...current, team]);

    setNewTeam("");

    showMessage(`${name} added.`);
  }

  // --------------------------------------------------
  // REMOVE TEAM
  // --------------------------------------------------

  function removeTeam(teamId: number) {
    const team = teams.find(
      (item) => item.id === teamId
    );

    if (!team) return;

    const usedInMatch = matches.some(
      (match) =>
        match.home === team.name ||
        match.away === team.name
    );

    if (usedInMatch) {
      showMessage(
        "This team is already in a fixture. Regenerate fixtures first."
      );

      return;
    }

    setTeams((current) =>
      current.filter((item) => item.id !== teamId)
    );

    showMessage(`${team.name} removed.`);
  }

  // --------------------------------------------------
  // GENERATE FIXTURES
  // --------------------------------------------------

  function generateFixtures() {
    if (teams.length < 2) {
      showMessage("Add at least 2 teams first.");

      setActiveTab("Teams");

      return;
    }

    const generated: Match[] = [];

    // ----------------------------------------------
    // LEAGUE
    // Every team plays every other team once.
    // ----------------------------------------------

    if (event?.format === "League") {
      let matchNumber = 1;

      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          generated.push({
            id:
              Date.now() +
              matchNumber +
              Math.floor(Math.random() * 10000),

            home: teams[i].name,

            away: teams[j].name,

            homeScore: null,

            awayScore: null,

            status: "Upcoming",
          });

          matchNumber++;
        }
      }
    }

    // ----------------------------------------------
    // LEAGUE + KNOCKOUT
    // Start with simple pairings.
    // ----------------------------------------------

    else if (event?.format === "League + Knockout") {
      let matchNumber = 1;

      for (let i = 0; i < teams.length - 1; i += 2) {
        const home = teams[i];

        const away = teams[i + 1];

        if (!away) break;

        generated.push({
          id:
            Date.now() +
            matchNumber +
            Math.floor(Math.random() * 10000),

          home: home.name,

          away: away.name,

          homeScore: null,

          awayScore: null,

          status: "Upcoming",
        });

        matchNumber++;
      }
    }

    // ----------------------------------------------
    // KNOCKOUT / FRIENDLY
    // Pair teams together.
    // ----------------------------------------------

    else {
      let matchNumber = 1;

      for (let i = 0; i < teams.length - 1; i += 2) {
        const home = teams[i];

        const away = teams[i + 1];

        if (!away) break;

        generated.push({
          id:
            Date.now() +
            matchNumber +
            Math.floor(Math.random() * 10000),

          home: home.name,

          away: away.name,

          homeScore: null,

          awayScore: null,

          status: "Upcoming",
        });

        matchNumber++;
      }
    }

    setMatches(generated);

    setActiveTab("Fixtures");

    showMessage(`${generated.length} fixtures generated.`);
  }

  // --------------------------------------------------
  // SCORE INPUT
  // --------------------------------------------------

  function updateScore(
    matchId: number,
    side: "home" | "away",
    value: string
  ) {
    if (value === "") {
      setMatches((current) =>
        current.map((match) => {
          if (match.id !== matchId) return match;

          return {
            ...match,
            [side === "home"
              ? "homeScore"
              : "awayScore"]: null,
          };
        })
      );

      return;
    }

    const score = Math.max(
      0,
      Number.parseInt(value, 10) || 0
    );

    setMatches((current) =>
      current.map((match) => {
        if (match.id !== matchId) return match;

        return {
          ...match,

          [side === "home"
            ? "homeScore"
            : "awayScore"]: score,
        };
      })
    );
  }

  // --------------------------------------------------
  // SAVE MATCH RESULT
  // --------------------------------------------------

  function saveMatch(matchId: number) {
    const match = matches.find(
      (item) => item.id === matchId
    );

    if (!match) return;

    if (
      match.homeScore === null ||
      match.awayScore === null
    ) {
      showMessage("Enter both scores first.");

      return;
    }

    if (match.status === "Completed") {
      showMessage("This result is already saved.");

      return;
    }

    const homeScore = match.homeScore;

    const awayScore = match.awayScore;

    setTeams((current) =>
      current.map((team) => {
        // Home team
        if (team.name === match.home) {
          if (homeScore > awayScore) {
            return {
              ...team,
              played: team.played + 1,
              wins: team.wins + 1,
              points: team.points + 3,
            };
          }

          if (homeScore === awayScore) {
            return {
              ...team,
              played: team.played + 1,
              draws: team.draws + 1,
              points: team.points + 1,
            };
          }

          return {
            ...team,
            played: team.played + 1,
            losses: team.losses + 1,
          };
        }

        // Away team
        if (team.name === match.away) {
          if (awayScore > homeScore) {
            return {
              ...team,
              played: team.played + 1,
              wins: team.wins + 1,
              points: team.points + 3,
            };
          }

          if (awayScore === homeScore) {
            return {
              ...team,
              played: team.played + 1,
              draws: team.draws + 1,
              points: team.points + 1,
            };
          }

          return {
            ...team,
            played: team.played + 1,
            losses: team.losses + 1,
          };
        }

        return team;
      })
    );

    setMatches((current) =>
      current.map((item) =>
        item.id === matchId
          ? {
              ...item,
              status: "Completed",
            }
          : item
      )
    );

    showMessage("Result saved.");
  }

  // --------------------------------------------------
  // RESET TOURNAMENT
  // --------------------------------------------------

  function resetTournament() {
    const confirmed = window.confirm(
      "Reset teams, fixtures and standings for this event?"
    );

    if (!confirmed) return;

    setTeams([]);
    setMatches([]);

    sessionStorage.removeItem("sporthub-teams");
    sessionStorage.removeItem("sporthub-matches");

    showMessage("Tournament data reset.");
  }

  // --------------------------------------------------
  // NO EVENT
  // --------------------------------------------------

  if (!event) {
    return (
      <main className="min-h-screen bg-[#f7f7f5]">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h1 className="text-2xl font-semibold text-[#15171b]">
            No event selected
          </h1>

          <p className="mt-2 text-[#686c74]">
            Create an event first, then come back here to
            manage it.
          </p>

          <Link
            href="/create"
            className="mt-6 inline-block rounded-xl bg-[#15171b] px-5 py-3 text-sm font-semibold text-white"
          >
            Create event
          </Link>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // DASHBOARD
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      {/* Header */}
      <section className="border-b border-[#e5e5e2] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link
                href={`/event/${event.id}`}
                className="text-sm font-medium text-[#e94352]"
              >
                ← View public event
              </Link>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#15171b]">
                {event.eventName}
              </h1>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#686c74]">
                <span>{event.sport}</span>

                <span>•</span>

                <span>{formatDate(event.date)}</span>

                <span>•</span>

                <span>{event.location}</span>
              </div>
            </div>

            <button
              onClick={resetTournament}
              className="rounded-xl border border-[#d6d6d2] bg-white px-4 py-2.5 text-sm font-medium text-[#686c74] hover:text-[#e94352]"
            >
              Reset tournament
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-[#e5e5e2] bg-white">
        <div className="mx-auto max-w-7xl overflow-x-auto px-5 sm:px-8">
          <div className="flex min-w-max gap-7">
            {[
              "Overview",
              "Teams",
              "Fixtures",
              "Standings",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(
                    tab as
                      | "Overview"
                      | "Teams"
                      | "Fixtures"
                      | "Standings"
                  )
                }
                className={`border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === tab
                    ? "border-[#e94352] text-[#15171b]"
                    : "border-transparent text-[#686c74]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      {message && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#15171b] px-5 py-3 text-sm font-medium text-white shadow-lg">
          {message}
        </div>
      )}

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* ========================================== */}
        {/* OVERVIEW */}
        {/* ========================================== */}

        {activeTab === "Overview" && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[#e5e5e2] bg-white p-5">
                <p className="text-sm text-[#686c74]">
                  Teams
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#15171b]">
                  {teams.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e5e5e2] bg-white p-5">
                <p className="text-sm text-[#686c74]">
                  Matches
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#15171b]">
                  {matches.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e5e5e2] bg-white p-5">
                <p className="text-sm text-[#686c74]">
                  Upcoming
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#15171b]">
                  {upcomingMatches}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e5e5e2] bg-white p-5">
                <p className="text-sm text-[#686c74]">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#15171b]">
                  {completedMatches}
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <section className="rounded-2xl border border-[#e5e5e2] bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[#15171b]">
                      Tournament progress
                    </h2>

                    <p className="mt-1 text-sm text-[#686c74]">
                      {completedMatches} of{" "}
                      {matches.length} matches completed
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-[#15171b]">
                    {progress}%
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#eeeeeb]">
                  <div
                    className="h-full rounded-full bg-[#e94352] transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-[#e5e5e2] bg-white p-6">
                <p className="text-sm text-[#686c74]">
                  Event format
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#15171b]">
                  {event.format}
                </h2>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#686c74]">
                      Planned teams
                    </span>

                    <span className="font-medium">
                      {event.teams}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#686c74]">
                      Location
                    </span>

                    <span className="max-w-[170px] text-right font-medium">
                      {event.location}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            <section className="rounded-2xl border border-[#e5e5e2] bg-white p-6">
              <h2 className="text-xl font-semibold text-[#15171b]">
                Next step
              </h2>

              <p className="mt-1 text-sm text-[#686c74]">
                Add your teams and generate the fixtures.
              </p>

              <button
                onClick={() => setActiveTab("Teams")}
                className="mt-5 rounded-xl bg-[#15171b] px-5 py-3 text-sm font-semibold text-white"
              >
                Manage teams
              </button>
            </section>
          </div>
        )}

        {/* ========================================== */}
        {/* TEAMS */}
        {/* ========================================== */}

        {activeTab === "Teams" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#15171b]">
                Teams
              </h2>

              <p className="mt-1 text-sm text-[#686c74]">
                Add the teams taking part in your event.
              </p>
            </div>

            {/* Add team */}
            <div className="rounded-2xl border border-[#e5e5e2] bg-white p-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addTeam();
                }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  value={newTeam}
                  onChange={(e) =>
                    setNewTeam(e.target.value)
                  }
                  placeholder="Enter team name"
                  className="flex-1 rounded-xl border border-[#d6d6d2] px-4 py-3 text-sm outline-none transition focus:border-[#e94352]"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-[#15171b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2d31]"
                >
                  Add team
                </button>
              </form>
            </div>

            {/* Team list */}
            {teams.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d6d6d2] bg-white px-6 py-14 text-center">
                <h3 className="font-semibold text-[#15171b]">
                  No teams yet
                </h3>

                <p className="mt-2 text-sm text-[#686c74]">
                  Add your first team above to start building
                  the tournament.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {teams.map((team, index) => (
                  <div
                    key={team.id}
                    className="rounded-2xl border border-[#e5e5e2] bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f1ef] text-sm font-semibold text-[#15171b]">
                          {index + 1}
                        </div>

                        <div>
                          <p className="text-xs text-[#92969d]">
                            Team
                          </p>

                          <h3 className="font-semibold text-[#15171b]">
                            {team.name}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          removeTeam(team.id)
                        }
                        className="text-xs font-medium text-[#92969d] hover:text-[#e94352]"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-xs text-[#92969d]">
                          P
                        </p>

                        <p className="mt-1 font-semibold">
                          {team.played}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#92969d]">
                          W
                        </p>

                        <p className="mt-1 font-semibold">
                          {team.wins}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#92969d]">
                          D
                        </p>

                        <p className="mt-1 font-semibold">
                          {team.draws}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#92969d]">
                          Pts
                        </p>

                        <p className="mt-1 font-semibold">
                          {team.points}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Generate */}
            {teams.length >= 2 && (
              <div className="flex justify-end">
                <button
                  onClick={generateFixtures}
                  className="rounded-xl bg-[#e94352] px-5 py-3 text-sm font-semibold text-white"
                >
                  Generate fixtures
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* FIXTURES */}
        {/* ========================================== */}

        {activeTab === "Fixtures" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-[#15171b]">
                  Fixtures
                </h2>

                <p className="mt-1 text-sm text-[#686c74]">
                  Schedule matches and record results.
                </p>
              </div>

              <button
                onClick={generateFixtures}
                className="rounded-xl border border-[#d6d6d2] bg-white px-5 py-3 text-sm font-medium text-[#15171b]"
              >
                Generate / regenerate
              </button>
            </div>

            {matches.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d6d6d2] bg-white p-12 text-center">
                <h3 className="font-semibold text-[#15171b]">
                  No fixtures yet
                </h3>

                <p className="mt-2 text-sm text-[#686c74]">
                  Add at least two teams and generate fixtures.
                </p>

                <button
                  onClick={() => setActiveTab("Teams")}
                  className="mt-5 rounded-xl bg-[#15171b] px-5 py-3 text-sm font-semibold text-white"
                >
                  Go to teams
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match, index) => (
                  <div
                    key={match.id}
                    className="rounded-2xl border border-[#e5e5e2] bg-white p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-[#92969d]">
                          Match {index + 1}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span className="font-semibold text-[#15171b]">
                            {match.home}
                          </span>

                          <span className="text-sm text-[#92969d]">
                            vs
                          </span>

                          <span className="font-semibold text-[#15171b]">
                            {match.away}
                          </span>
                        </div>

                        <span
                          className={`mt-2 inline-block text-xs font-medium ${
                            match.status === "Completed"
                              ? "text-[#258a55]"
                              : "text-[#e94352]"
                          }`}
                        >
                          {match.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="number"
                          min="0"
                          value={
                            match.homeScore ?? ""
                          }
                          onChange={(e) =>
                            updateScore(
                              match.id,
                              "home",
                              e.target.value
                            )
                          }
                          placeholder="0"
                          className="w-20 rounded-xl border border-[#d6d6d2] px-3 py-3 text-center text-sm outline-none focus:border-[#e94352]"
                        />

                        <span className="text-[#92969d]">
                          —
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={
                            match.awayScore ?? ""
                          }
                          onChange={(e) =>
                            updateScore(
                              match.id,
                              "away",
                              e.target.value
                            )
                          }
                          placeholder="0"
                          className="w-20 rounded-xl border border-[#d6d6d2] px-3 py-3 text-center text-sm outline-none focus:border-[#e94352]"
                        />

                        <button
                          onClick={() =>
                            saveMatch(match.id)
                          }
                          disabled={
                            match.status ===
                            "Completed"
                          }
                          className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                            match.status ===
                            "Completed"
                              ? "cursor-not-allowed bg-[#eeeeeb] text-[#92969d]"
                              : "bg-[#15171b] text-white"
                          }`}
                        >
                          {match.status ===
                          "Completed"
                            ? "Saved"
                            : "Save result"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* STANDINGS */}
        {/* ========================================== */}

        {activeTab === "Standings" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#15171b]">
                Standings
              </h2>

              <p className="mt-1 text-sm text-[#686c74]">
                Current table based on recorded results.
              </p>
            </div>

            {teams.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d6d6d2] bg-white p-12 text-center">
                <h3 className="font-semibold text-[#15171b]">
                  No teams yet
                </h3>

                <p className="mt-2 text-sm text-[#686c74]">
                  Add teams to start building your standings.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#e5e5e2] bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-sm">
                    <thead className="border-b border-[#eeeeeb] bg-[#fafaf8]">
                      <tr className="text-left text-xs uppercase tracking-wide text-[#92969d]">
                        <th className="px-5 py-4">
                          #
                        </th>

                        <th className="px-5 py-4">
                          Team
                        </th>

                        <th className="px-5 py-4">
                          P
                        </th>

                        <th className="px-5 py-4">
                          W
                        </th>

                        <th className="px-5 py-4">
                          D
                        </th>

                        <th className="px-5 py-4">
                          L
                        </th>

                        <th className="px-5 py-4">
                          Pts
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {sortedTeams.map(
                        (team, index) => (
                          <tr
                            key={team.id}
                            className="border-b border-[#eeeeeb] last:border-0"
                          >
                            <td className="px-5 py-4 font-medium text-[#92969d]">
                              {index + 1}
                            </td>

                            <td className="px-5 py-4 font-semibold text-[#15171b]">
                              {team.name}
                            </td>

                            <td className="px-5 py-4">
                              {team.played}
                            </td>

                            <td className="px-5 py-4">
                              {team.wins}
                            </td>

                            <td className="px-5 py-4">
                              {team.draws}
                            </td>

                            <td className="px-5 py-4">
                              {team.losses}
                            </td>

                            <td className="px-5 py-4 font-semibold text-[#15171b]">
                              {team.points}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}