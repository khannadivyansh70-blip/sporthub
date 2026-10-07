"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  Search,
  MapPin,
  Plus,
  Menu,
  X,
  UserRound,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
const [userName, setUserName] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const loggedIn = localStorage.getItem("eventmade-logged-in");
    const savedAccount = localStorage.getItem("eventmade-account");

    if (loggedIn === "true" && savedAccount) {
      const account = JSON.parse(savedAccount);

      setLoggedIn(true);
      setUserName(account.name);
    }
  }, []);

  const performSearch = (value: string) => {
    const query = value.trim();

    if (query.length === 0) {
      router.push("/explore");
    } else {
      router.push(`/explore?search=${encodeURIComponent(query)}`);
    }

    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch(search);
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#ddd6c8] bg-[#f5f1e8]">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 sm:px-8">
        <Link
          href="/"
          onClick={closeMenus}
          className="shrink-0 text-xl font-semibold tracking-tight"
        >
          <span className="text-[#171717]">Event</span>
<span className="text-[#176b4d]">Made</span>
        </Link>

        <button className="hidden items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-[#555960] transition hover:bg-[#f7f7f5] md:flex">
          <MapPin size={16} />
          <span>Noida</span>
        </button>

        {/* Desktop search */}
        <form
          onSubmit={handleSearch}
          className="hidden min-w-0 flex-1 md:block"
        >
          <div className="relative mx-auto max-w-xl">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92969d]"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, sports or places"
              autoComplete="off"
              className="w-full rounded-lg border border-[#ddd6c8] bg-[#fffdf8] py-2.5 pl-10 ..."
            />
          </div>
        </form>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/explore"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              pathname === "/explore"
                ? "text-[#15171b]"
                : "text-[#686c74] hover:bg-[#f7f7f5] hover:text-[#15171b]"
            }`}
          >
            Explore
          </Link>

          <Link
            href="/explore?sport=Football"
            className="rounded-lg px-3 py-2 text-sm font-medium text-[#686c74] transition hover:bg-[#f7f7f5] hover:text-[#15171b]"
          >
            Sports
          </Link>

          <Link
            href="/my-events"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              pathname === "/my-events"
                ? "text-[#15171b]"
                : "text-[#686c74] hover:bg-[#f7f7f5] hover:text-[#15171b]"
            }`}
          >
            My Events
          </Link>
        </nav>

        <Link
          href="/create"
          className="hidden shrink-0 items-center gap-1.5 rounded-lg bg-[#15171b] px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2a2c31] sm:flex"
        >
          <Plus size={16} />
          Host event
        </Link>

        <div ref={profileRef} className="relative hidden sm:block">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
              profileOpen
                ? "border-[#15171b] bg-[#f7f7f5] text-[#15171b]"
                : "border-[#e0e0dc] text-[#555960] hover:bg-[#f7f7f5]"
            }`}
          >
            <UserRound size={17} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-xl border border-[#e5e5e2] bg-white shadow-lg">
              <div className="border-b border-[#e5e5e2] px-4 py-4">
                <p className="text-sm font-semibold text-[#15171b]">
  {loggedIn ? `Hi, ${userName}` : "Your EventMade"}
</p>

                <p className="mt-1 text-xs text-[#92969d]">
  {loggedIn
    ? "Manage your events and activity"
    : "Sign in to manage your events"}
</p>
              </div>

              <div className="p-2">
                <Link
                  href="/my-events"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#555960] transition hover:bg-[#f7f7f5] hover:text-[#15171b]"
                >
                  <CalendarDays size={17} />
                  <span>My Events</span>
                </Link>

                <Link
                  href="/create"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#555960] transition hover:bg-[#f7f7f5] hover:text-[#15171b]"
                >
                  <Plus size={17} />
                  <span>Host an Event</span>
                </Link>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    alert("Settings will be available soon.");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#555960] transition hover:bg-[#f7f7f5] hover:text-[#15171b]"
                >
                  <Settings size={17} />
                  <span>Settings</span>
                </button>
              </div>

              <div className="border-t border-[#e5e5e2] p-2">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    alert("You are currently using EventMade locally.");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#686c74] transition hover:bg-[#f7f7f5]"
                >
                  <LogOut size={17} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-[#555960] transition hover:bg-[#f7f7f5] md:hidden"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#e5e5e2] bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-3 px-5 py-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92969d]"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events, sports or places"
                  autoComplete="off"
                  className="w-full rounded-lg border border-[#e0e0dc] bg-[#f7f7f5] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#c9c9c5] focus:bg-white"
                />
              </div>
            </form>

            <Link
              href="/explore"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium text-[#15171b] hover:bg-[#f7f7f5]"
            >
              Explore events
            </Link>

            <Link
              href="/my-events"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium text-[#15171b] hover:bg-[#f7f7f5]"
            >
              My Events
            </Link>

            <Link
              href="/create"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-[#15171b] px-3 py-3 text-sm font-medium text-white"
            >
              <Plus size={16} />
              Host an event
            </Link>

            <div className="flex items-center gap-2 px-3 py-2 text-sm text-[#686c74]">
              <MapPin size={16} />
              Noida
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function handleClickOutside(this: Document, ev: MouseEvent) {
  throw new Error("Function not implemented.");
}


function setMenuOpen(arg0: boolean) {
  throw new Error("Function not implemented.");
}


function setProfileOpen(arg0: boolean) {
  throw new Error("Function not implemented.");
}
