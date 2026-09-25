export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">

        {/* Badge */}
        <div className="mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
          🏆 The home of sports events
        </div>

        {/* Hero */}
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Create. Compete.
          <span className="block text-blue-500">
            Celebrate.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Create and manage sports tournaments, register teams,
          generate fixtures, track scores, and share your event
          with everyone.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">

          {/* Create Event */}
          <a
            href="/create"
            className="rounded-xl bg-blue-600 px-7 py-3 font-semibold transition hover:bg-blue-500"
          >
            Create an Event
          </a>

          {/* Browse Events */}
          <button
            className="rounded-xl border border-slate-700 px-7 py-3 font-semibold transition hover:bg-slate-900"
          >
            Browse Events
          </button>

        </div>

        {/* Features */}
        <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Any Sport */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="text-3xl">
              🏀
            </div>

            <h3 className="mt-4 font-semibold">
              Any Sport
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Basketball, football, cricket and more.
            </p>
          </div>

          {/* Live Standings */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="text-3xl">
              📊
            </div>

            <h3 className="mt-4 font-semibold">
              Live Standings
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Keep track of scores and rankings.
            </p>
          </div>

          {/* Easy Setup */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="text-3xl">
              ⚡
            </div>

            <h3 className="mt-4 font-semibold">
              Easy Setup
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Create your tournament in minutes.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}