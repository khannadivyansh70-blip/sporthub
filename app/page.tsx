import { Trophy, BarChart3, Zap, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">

        {/* Hero */}
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Run your bracket
          <span className="block text-amber-500">
            without touching a spreadsheet.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-zinc-400">
          Set up a tournament, register teams, generate fixtures, and
          track live scores — then share one link with everyone watching.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">

          <a
            href="/create"
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-7 py-3 font-semibold text-zinc-950 transition hover:bg-amber-400"
          >
            Create an Event
            <ArrowRight className="h-4 w-4" />
          </a>

          <a
            href="/create"
            className="px-7 py-3 font-semibold text-zinc-300 transition hover:text-white"
          >
            See how it works
          </a>

        </div>

        {/* Features */}
        <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-left">
            <Trophy className="h-6 w-6 text-amber-500" />
            <h3 className="mt-4 font-semibold">Any Sport</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Basketball, football, cricket and more.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-left">
            <BarChart3 className="h-6 w-6 text-amber-500" />
            <h3 className="mt-4 font-semibold">Live Standings</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Keep track of scores and rankings.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-left">
            <Zap className="h-6 w-6 text-amber-500" />
            <h3 className="mt-4 font-semibold">Easy Setup</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Create your tournament in minutes.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
