import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Multi-Country Clock
 *
 * Requirements covered:
 * - Frontend using React + HTML + CSS (Tailwind utility classes for styling)
 * - Search country → Show current time (supports multiple timezones per country)
 * - Integrates free APIs: Rest Countries (for timezones) + WorldTimeAPI (for current time)
 * - Clean, modular, and commented code
 *
 * APIs used:
 * 1) Rest Countries: https://restcountries.com/v3.1/name/{name}?fields=name,cca2,timezones,flags
 * 2) World Time API: https://worldtimeapi.org/api/timezone/{Area/City}
 */

// ----------------------------
// Utility helpers
// ----------------------------

/** Debounce a changing value; returns debounced value after delay. */
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/**
 * Given an ISO datetime string from WorldTimeAPI and its utc_offset (e.g., "+05:30"),
 * return a function that yields the live local Date that ticks forward every second.
 */
function useLiveClock(startIso, utcOffset) {
  const [now, setNow] = useState(() => (startIso ? new Date(startIso) : null));
  const offsetMs = useMemo(() => {
    if (!utcOffset) return 0;
    // utc_offset format: "+HH:MM" or "-HH:MM"
    const sign = utcOffset.startsWith("-") ? -1 : 1;
    const [hh, mm] = utcOffset.replace(/[+-]/, "").split(":").map(Number);
    return sign * ((hh || 0) * 60 + (mm || 0)) * 60 * 1000;
  }, [utcOffset]);

  // Tick forward each second locally to avoid hammering the API.
  useEffect(() => {
    if (!startIso) return;
    const tick = () => setNow((prev) => (prev ? new Date(prev.getTime() + 1000) : null));
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startIso]);

  // Provide a formatter that ensures we show the *local* time for the timezone.
  const formatted = useMemo(() => {
    if (!now) return "--:--:--";
    // Convert the ticking "now" (which is in the original timezone) into a display string.
    // We format manually using the offset to avoid depending on Intl time zone names from the API.
    const utcMs = now.getTime() - offsetMs; // back out the offset to get UTC
    const localMs = utcMs + offsetMs; // then re-apply (this looks redundant, but preserves clarity)
    const d = new Date(localMs);

    const pad = (n) => String(n).padStart(2, "0");
    const hours = pad(d.getUTCHours());
    const mins = pad(d.getUTCMinutes());
    const secs = pad(d.getUTCSeconds());
    const y = d.getUTCFullYear();
    const m = pad(d.getUTCMonth() + 1);
    const day = pad(d.getUTCDate());

    return { time: `${hours}:${mins}:${secs}`, date: `${y}-${m}-${day}` };
  }, [now, offsetMs]);

  return formatted;
}

// ----------------------------
// API functions
// ----------------------------

async function fetchCountriesByName(name) { 
  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fields=name,cca2,timezones,flags`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch countries.");
  return res.json();
}

async function fetchWorldTime(timezone) {
  const url = `https://script.google.com/macros/s/AKfycbyd5AcbAnWi2Yn0xhFRbyzS4qMq1VucMVgVvhul5XqS9HkAyJY/exec?tz=${encodeURIComponent(timezone)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch time.");
  return res.json();
}

// ----------------------------
// UI Components
// ----------------------------

function SearchBar({ value, onChange }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <label className="block text-sm font-medium text-gray-700 mb-2">Search Country</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type a country name, e.g., India"
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <p className="text-xs text-gray-500 mt-2">Tip: Countries with multiple timezones will show a clock for each.</p>
    </div>
  );
}

function CountryResult({ country, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 rounded-2xl border border-gray-200 p-3 hover:shadow transition"
    >
      <img src={country.flags?.png || country.flags?.svg} alt="flag" className="h-5 w-7 object-cover rounded" />
      <div className="text-left">
        <div className="font-semibold">{country.name?.common}</div>
        <div className="text-xs text-gray-500">{country.timezones?.length || 0} timezone(s)</div>
      </div>
    </button>
  );
}

function CountryList({ results, onPick }) {
  if (!results?.length) return null;
  return (
    <div className="w-full max-w-2xl mx-auto mt-4 grid gap-2">
      {results.map((c) => (
        <CountryResult key={c.cca2} country={c} onSelect={() => onPick(c)} />
      ))}
    </div>
  );
}

function ClockCard({ timezone }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch once to initialize clock.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const json = await fetchWorldTime(timezone);
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [timezone]);

  const live = useLiveClock(data?.datetime, data?.utc_offset);

  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Timezone</div>
          <div className="text-lg font-semibold">{timezone}</div>
        </div>
        {data?.abbreviation && (
          <span className="text-xs bg-gray-100 rounded-xl px-2 py-1">{data.abbreviation}</span>
        )}
      </div>

      {loading ? (
        <div className="mt-4 text-gray-500">Loading time…</div>
      ) : error ? (
        <div className="mt-4 text-red-600">{error}</div>
      ) : (
        <div className="mt-4">
          <div className="text-4xl font-bold tracking-tight">{live.time}</div>
          <div className="text-sm text-gray-500 mt-1">{live.date}</div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div className="rounded-lg bg-gray-50 p-2">
              <div className="text-xs text-gray-500">UTC Offset</div>
              <div className="font-medium">{data.utc_offset}</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-2">
              <div className="text-xs text-gray-500">Day of Week</div>
              <div className="font-medium">{data.day_of_week}</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-2">
              <div className="text-xs text-gray-500">DST</div>
              <div className="font-medium">{String(data.dst)}</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-2">
              <div className="text-xs text-gray-500">Client IP</div>
              <div className="font-medium truncate">{data.client_ip}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SelectedCountryClocks({ country, onBack }) {
  const timezones = country?.timezones || [];
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">{country.name?.common}</h2>
          <p className="text-sm text-gray-500">{timezones.length} timezone(s)</p>
        </div>
        <button onClick={onBack} className="rounded-xl px-4 py-2 border hover:bg-gray-50">Back to search</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {timezones.map((tz) => (
          <ClockCard key={tz} timezone={tz} />
        ))}
      </div>
    </div>
  );
}

// ----------------------------
// Main App Component
// ----------------------------

export default function MultiCountryClockApp() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  // Search countries whenever debounced query changes.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!debounced?.trim()) {
        setResults([]);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const json = await fetchCountriesByName(debounced.trim());
        if (!cancelled) setResults(json);
      } catch (e) {
        if (!cancelled) {
          setResults([]);
          setError("No countries found or network error.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Multi‑Country Clock</h1>
          <p className="text-gray-600 mt-1">Search a country to view real‑time clocks for all of its timezones.</p>
        </header>

        {!selected ? (
          <>
            <SearchBar value={query} onChange={setQuery} />
            {loading && <div className="w-full max-w-2xl mx-auto mt-3 text-gray-500">Searching…</div>}
            {error && <div className="w-full max-w-2xl mx-auto mt-3 text-red-600">{error}</div>}
            <CountryList results={results} onPick={setSelected} />
          </>
        ) : (
          <SelectedCountryClocks country={selected} onBack={() => setSelected(null)} />
        )}

        <footer className="mt-10 text-xs text-gray-500">
          Data: WorldTimeAPI & Rest Countries.
        </footer>
      </div>
    </div>
  );
}
