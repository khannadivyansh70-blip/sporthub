"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  MapPin,
  CalendarDays,
  Zap,
  Users,
  X,
} from "lucide-react";

type EventData = {
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

type Standing = {
  team: string;
  played: number;
  wins: number;
  losses: number;
  points: number;
};

const ROUND_ORDER = [
  "Round of 32",
  "Round of 16",
  "Quarterfinals",
  "Semifinals",
  "Final",
];

export default function EventDashboard() {
  const [event, setEvent] = useState<EventData | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const [showAddTeam, setShowAddTeam] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");

  const [scoreMatchId, setScoreMatchId] = useState<number | null>(null);
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");

  useEffect(() => {
    const savedEvent = sessionStorage.getItem("sporthub-event");
    const savedTeams = sessionStorage.getItem("sporthub-teams");
    const savedMatches = sessionStorage.getItem("sporthub-matches");

    if (savedEvent) {
      setEvent(JSON.parse(savedEvent));
    }

    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }

    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    }
  }, []);

  function saveTeams(updatedTeams: Team[]) {
    setTeams(updatedTeams);
    sessionStorage.setItem(
      "sporthub-teams",
      JSON.stringify(updatedTeams)
    );
  }

  function saveMatches(updatedMatches: Match[]) {
    setMatches(updatedMatches);
    sessionStorage.setItem(
      "sporthub-matches",
      JSON.stringify(updatedMatches)
    );
  }

  function addTeam(e: React.FormEvent) {
    e.preventDefault();

    if (!teamName.trim()) return;

    if (event && teams.length >= event.teams) {
      alert(`This event only allows ${event.teams} teams.`);
      return;
    }

    const newTeam: Team = {
      id: Date.now(),
      name: teamName.trim(),
      captain: captainName.trim() || "Not specified",
    };

    saveTeams([...teams, newTeam]);

    setTeamName("");
    setCaptainName("");
    setShowAddTeam(false);
  }

  function removeTeam(id: number) {
    const updatedTeams = teams.filter(
      (team) => team.id !== id
    );

    saveTeams(updatedTeams);
    saveMatches([]);
  }

  function getRoundName(teamCount: number) {
    if (teamCount <= 2) return "Final";
    if (teamCount <= 4) return "Semifinals";
    if (teamCount <= 8) return "Quarterfinals";
    if (teamCount <= 16) return "Round of 16";
    return "Round of 32";
  }

  function generateFixtures() {
    if (teams.length < 2) {
      alert("Add at least 2 teams before generating the bracket.");
      return;
    }

    const generatedMatches: Match[] = [];

    const roundName = getRoundName(teams.length);

    for (let i = 0; i < teams.length; i += 2) {
      const team1 = teams[i];
      const team2 = teams[i + 1];

      if (!team1) continue;

      // BYE
      if (!team2) {
        generatedMatches.push({
          id: Date.now() + i,
          round: roundName,
          team1: team1.name,
          team2: "BYE",
          score1: null,
          score2: null,
          status: "Completed",
          winner: team1.name,
        });

        continue;
      }

      generatedMatches.push({
        id: Date.now() + i,
        round: roundName,
        team1: team1.name,
        team2: team2.name,
        score1: null,
        score2: null,
        status: "Upcoming",
        winner: null,
      });
    }

    saveMatches(generatedMatches);

    // If there are automatic BYEs, check advancement.
    setTimeout(() => {
      advanceRound(generatedMatches);
    }, 0);
  }

  function clearFixtures() {
    saveMatches([]);
  }

  function openScore(match: Match) {
    setScoreMatchId(match.id);

    setScore1(
      match.score1 !== null
        ? String(match.score1)
        : ""
    );

    setScore2(
      match.score2 !== null
        ? String(match.score2)
        : ""
    );
  }

  function saveScore(e: React.FormEvent) {
    e.preventDefault();

    if (scoreMatchId === null) return;

    const firstScore = Number(score1);
    const secondScore = Number(score2);

    if (
      score1 === "" ||
      score2 === "" ||
      firstScore < 0 ||
      secondScore < 0
    ) {
      alert("Please enter valid scores.");
      return;
    }

    if (firstScore === secondScore) {
      alert("A knockout match cannot end in a tie.");
      return;
    }

    const currentMatch = matches.find(
      (match) => match.id === scoreMatchId
    );

    if (!currentMatch) return;

    const winner =
      firstScore > secondScore
        ? currentMatch.team1
        : currentMatch.team2;

    const updatedMatches = matches.map((match) => {
      if (match.id !== scoreMatchId) {
        return match;
      }

      return {
        ...match,
        score1: firstScore,
        score2: secondScore,
        status: "Completed" as const,
        winner,
      };
    });

    setScoreMatchId(null);
    setScore1("");
    setScore2("");

    saveMatches(updatedMatches);

    // Immediately check if the round is complete.
    advanceRound(updatedMatches);
  }

  function getLatestRound(matchesList: Match[]) {
    const rounds = Array.from(
      new Set(matchesList.map((match) => match.round))
    );

    rounds.sort((a, b) => {
      return (
        ROUND_ORDER.indexOf(b) -
        ROUND_ORDER.indexOf(a)
      );
    });

    return rounds[0] || null;
  }

  function getNextRoundName(winnerCount: number) {
    if (winnerCount === 2) {
      return "Final";
    }

    if (winnerCount === 4) {
      return "Semifinals";
    }

    if (winnerCount === 8) {
      return "Quarterfinals";
    }

    if (winnerCount === 16) {
      return "Round of 16";
    }

    if (winnerCount === 32) {
      return "Round of 32";
    }

    return `Round of ${winnerCount}`;
  }

  function advanceRound(currentMatches: Match[]) {
    if (currentMatches.length === 0) return;

    const latestRound = getLatestRound(currentMatches);

    if (!latestRound) return;

    // Get ONLY matches from the latest round.
    const currentRoundMatches = currentMatches.filter(
      (match) => match.round === latestRound
    );

    // Do nothing until every match has a winner.
    const roundFinished = currentRoundMatches.every(
      (match) =>
        match.status === "Completed" &&
        match.winner !== null
    );

    if (!roundFinished) {
      return;
    }

    const winners = currentRoundMatches
      .map((match) => match.winner)
      .filter(
        (winner): winner is string =>
          Boolean(winner)
      );

    // One winner = tournament finished.
    if (winners.length === 1) {
      return;
    }

    const nextRoundName =
      getNextRoundName(winners.length);

    // Don't create the same round twice.
    const alreadyExists = currentMatches.some(
      (match) =>
        match.round === nextRoundName
    );

    if (alreadyExists) {
      return;
    }

    const nextMatches: Match[] = [];

    for (let i = 0; i < winners.length; i += 2) {
      const team1 = winners[i];
      const team2 = winners[i + 1];

      if (!team1) continue;

      // Handle a possible bye in a later round.
      if (!team2) {
        nextMatches.push({
          id: Date.now() + i + 5000,
          round: nextRoundName,
          team1,
          team2: "BYE",
          score1: null,
          score2: null,
          status: "Completed",
          winner: team1,
        });

        continue;
      }

      nextMatches.push({
        id: Date.now() + i + 5000,
        round: nextRoundName,
        team1,
        team2,
        score1: null,
        score2: null,
        status: "Upcoming",
        winner: null,
      });
    }

    const allMatches = [
      ...currentMatches,
      ...nextMatches,
    ];

    saveMatches(allMatches);

    // Check automatically again in case the next round
    // contains an automatic BYE.
    setTimeout(() => {
      advanceRound(allMatches);
    }, 0);
  }

  function getStandings(): Standing[] {
    const table: Record<
      string,
      Standing
    > = {};

    teams.forEach((team) => {
      table[team.name] = {
        team: team.name,
        played: 0,
        wins: 0,
        losses: 0,
        points: 0,
      };
    });

    matches.forEach((match) => {
      if (
        match.status !== "Completed" ||
        match.score1 === null ||
        match.score2 === null ||
        match.team2 === "BYE"
      ) {
        return;
      }

      if (
        !table[match.team1] ||
        !table[match.team2]
      ) {
        return;
      }

      table[match.team1].played += 1;
      table[match.team2].played += 1;

      if (match.score1 > match.score2) {
        table[match.team1].wins += 1;
        table[match.team1].points += 3;
        table[match.team2].losses += 1;
      } else {
        table[match.team2].wins += 1;
        table[match.team2].points += 3;
        table[match.team1].losses += 1;
      }
    });

    return Object.values(table).sort(
      (a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }

        return b.wins - a.wins;
      }
    );
  }

  function getChampion() {
    const finalMatches = matches.filter(
      (match) => match.round === "Final"
    );

    if (finalMatches.length === 0) {
      return null;
    }

    const final = finalMatches[finalMatches.length - 1];

    if (
      final.status === "Completed" &&
      final.winner
    ) {
      return final.winner;
    }

    return null;
  }

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">

          <h1 className="text-3xl font-bold">
            No event found
          </h1>

          <a
            href="/create"
            className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 font-semibold text-zinc-950 hover:bg-amber-400"
          >
            Create Event
          </a>

        </div>
      </main>
    );
  }

  const standings = getStandings();

  const completedMatches = matches.filter(
    (match) =>
      match.status === "Completed" &&
      match.team2 !== "BYE"
  ).length;

  const champion = getChampion();

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

          <a
            href="/create"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
          >
            + New Event
          </a>

        </div>

      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* EVENT HEADER */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-400">
                <Trophy className="h-3.5 w-3.5" />
                {event.sport}
              </div>

              <h1 className="text-3xl font-bold">
                {event.eventName}
              </h1>

              <p className="mt-3 flex items-center gap-2 text-zinc-400">
                <MapPin className="h-4 w-4" />
                {event.location}
              </p>

              <p className="mt-1 flex items-center gap-2 text-zinc-400">
                <CalendarDays className="h-4 w-4" />
                {event.date}
              </p>

            </div>

            <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-5 text-center">

              <p className="text-sm text-zinc-400">
                Format
              </p>

              <p className="mt-2 text-xl font-semibold">
                {event.format}
              </p>

            </div>

          </div>

        </div>

        {/* STATS */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">

            <p className="text-sm text-zinc-400">
              Teams
            </p>

            <p className="mt-2 text-3xl font-bold">
              {teams.length}/{event.teams}
            </p>

          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">

            <p className="text-sm text-zinc-400">
              Matches
            </p>

            <p className="mt-2 text-3xl font-bold">
              {matches.length}
            </p>

          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">

            <p className="text-sm text-zinc-400">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {completedMatches}
            </p>

          </div>

        </div>

        {/* TEAMS */}
        <section className="mt-10">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                Teams
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {teams.length} / {event.teams} teams
              </p>

            </div>

            <button
              onClick={() => setShowAddTeam(true)}
              disabled={teams.length >= event.teams}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              + Add Team
            </button>

          </div>

          {teams.length === 0 ? (

            <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center text-zinc-400">
              No teams added yet.
            </div>

          ) : (

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {teams.map((team) => (

                <div
                  key={team.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/10">
                        <Users className="h-5 w-5 text-amber-500" />
                      </div>

                      <div>

                        <p className="font-semibold">
                          {team.name}
                        </p>

                        <p className="text-sm text-zinc-400">
                          Captain: {team.captain}
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        removeTeam(team.id)
                      }
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* KNOCKOUT BRACKET */}
        <section className="mt-12">

          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <h2 className="text-2xl font-bold">
                Knockout Bracket
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Winners automatically advance after each round.
              </p>

            </div>

            <div className="flex gap-3">

              {matches.length > 0 && (
                <button
                  onClick={clearFixtures}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
                >
                  Clear Bracket
                </button>
              )}

              <button
                onClick={generateFixtures}
                disabled={teams.length < 2}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Zap className="h-4 w-4" />
                Generate Bracket
              </button>

            </div>

          </div>

          {matches.length === 0 ? (

            <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-10 text-center">

              <Trophy className="mx-auto h-9 w-9 text-zinc-600" />

              <h3 className="mt-4 text-xl font-semibold">
                Bracket not generated
              </h3>

              <p className="mt-2 text-zinc-400">
                Add your teams and generate the knockout bracket.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {matches.map((match, index) => (

                <div
                  key={match.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6"
                >

                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div className="min-w-[150px]">

                      <p className="text-sm font-medium text-amber-400">
                        {match.round}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Match {index + 1}
                      </p>

                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-lg font-semibold">

                      <span>
                        {match.team1}
                      </span>

                      {match.status === "Completed" ? (

                        <span className="rounded-lg bg-zinc-950 px-4 py-2 text-emerald-400">
                          {match.score1} - {match.score2}
                        </span>

                      ) : (

                        <span className="text-sm text-zinc-500">
                          VS
                        </span>

                      )}

                      <span>
                        {match.team2}
                      </span>

                    </div>

                    <div className="min-w-[170px] text-right">

                      {match.status === "Completed" ? (

                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                          Winner: {match.winner}
                        </span>

                      ) : (

                        <button
                          onClick={() =>
                            openScore(match)
                          }
                          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400"
                        >
                          Enter Score
                        </button>

                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* CHAMPION */}
        {champion && (

          <section className="mt-10">

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-10 text-center">

              <Trophy className="mx-auto h-14 w-14 text-amber-400" />

              <p className="mt-5 text-sm uppercase tracking-widest text-amber-400">
                Tournament Champion
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {champion}
              </h2>

              <p className="mt-3 text-zinc-400">
                Congratulations!
              </p>

            </div>

          </section>

        )}

        {/* STANDINGS */}
        <section className="mt-12 pb-12">

          <h2 className="mb-4 text-2xl font-bold">
            Tournament Records
          </h2>

          <div className="overflow-hidden rounded-xl border border-zinc-800">

            <div className="grid grid-cols-5 bg-zinc-900 px-5 py-4 text-sm text-zinc-400">

              <span>Team</span>
              <span>Played</span>
              <span>Wins</span>
              <span>Losses</span>
              <span>Points</span>

            </div>

            {standings.map((row, index) => (

              <div
                key={row.team}
                className="grid grid-cols-5 border-t border-zinc-800 bg-zinc-950 px-5 py-4 transition hover:bg-zinc-900/60"
              >

                <span className="font-semibold">
                  {index + 1}. {row.team}
                </span>

                <span className="text-zinc-400">
                  {row.played}
                </span>

                <span className="text-emerald-400">
                  {row.wins}
                </span>

                <span className="text-red-400">
                  {row.losses}
                </span>

                <span className="font-bold text-amber-400">
                  {row.points}
                </span>

              </div>

            ))}

          </div>

        </section>

      </div>

      {/* ADD TEAM MODAL */}
      {showAddTeam && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">

          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-7">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                Add Team
              </h2>

              <button
                onClick={() =>
                  setShowAddTeam(false)
                }
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <form
              onSubmit={addTeam}
              className="mt-6 space-y-5"
            >

              <input
                type="text"
                required
                value={teamName}
                onChange={(e) =>
                  setTeamName(e.target.value)
                }
                placeholder="Team name"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-amber-500"
              />

              <input
                type="text"
                value={captainName}
                onChange={(e) =>
                  setCaptainName(e.target.value)
                }
                placeholder="Captain name"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-amber-500"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-amber-500 px-6 py-3 font-semibold text-zinc-950 hover:bg-amber-400"
              >
                Add Team
              </button>

            </form>

          </div>

        </div>

      )}

      {/* SCORE MODAL */}
      {scoreMatchId !== null && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">

          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-7">

            <h2 className="text-2xl font-bold">
              Enter Score
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Winner will automatically advance.
            </p>

            <form
              onSubmit={saveScore}
              className="mt-6"
            >

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="mb-2 block text-sm text-zinc-400">
                    {
                      matches.find(
                        (match) =>
                          match.id === scoreMatchId
                      )?.team1
                    }
                  </label>

                  <input
                    type="number"
                    min="0"
                    required
                    value={score1}
                    onChange={(e) =>
                      setScore1(e.target.value)
                    }
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-4 text-center text-2xl font-bold outline-none focus:border-amber-500"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm text-zinc-400">
                    {
                      matches.find(
                        (match) =>
                          match.id === scoreMatchId
                      )?.team2
                    }
                  </label>

                  <input
                    type="number"
                    min="0"
                    required
                    value={score2}
                    onChange={(e) =>
                      setScore2(e.target.value)
                    }
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-4 text-center text-2xl font-bold outline-none focus:border-amber-500"
                  />

                </div>

              </div>

              <div className="mt-6 flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setScoreMatchId(null)
                  }
                  className="flex-1 rounded-lg border border-zinc-700 px-5 py-3 font-semibold hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-amber-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-amber-400"
                >
                  Save Result
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}
