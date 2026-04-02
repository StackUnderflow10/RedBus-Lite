import React, { useState, useEffect } from 'react';
import axios from "axios";
import Modal from './Modal';
import SearchBusContent from './SearchBus';


/* ─── helpers ─────────────────────────────────────────────────── */
const formatDate = (d) => {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const SeatBar = ({ available, capacity }) => {
  const pct   = capacity > 0 ? Math.round((available / capacity) * 100) : 0;
  const color = pct > 50 ? '#34d399' : pct > 20 ? '#fbbf24' : '#f87171';
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-[3px] bg-[#1e1e1e] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[0.7rem] font-medium shrink-0 tabular-nums" style={{ color }}>
        {available === 0 ? 'Full' : `${available} left`}
      </span>
    </div>
  );
};

const DotGrid = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.035 }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

/* ─── skeleton card ───────────────────────────────────────────── */
const SkeletonCard = ({ delay }) => (
  <div className="animate-pulse bg-[#111] border border-[#161616] rounded-2xl p-5" style={{ animationDelay: delay }}>
    <div className="flex gap-4 items-center">
      <div className="w-[3px] h-10 bg-[#1e1e1e] rounded-full shrink-0" />
      <div className="flex-1 flex flex-col gap-2.5">
        <div className="flex items-center gap-3">
          <div className="h-4 w-28 bg-[#1a1a1a] rounded-md" />
          <div className="h-3 w-4 bg-[#161616] rounded" />
          <div className="h-4 w-24 bg-[#1a1a1a] rounded-md" />
        </div>
        <div className="h-[3px] w-full bg-[#161616] rounded-full" />
      </div>
      <div className="shrink-0 flex flex-col items-end gap-2 pl-4 border-l border-[#161616]">
        <div className="h-3 w-12 bg-[#1a1a1a] rounded" />
        <div className="h-3 w-16 bg-[#161616] rounded" />
      </div>
    </div>
  </div>
);

/* ─── main ────────────────────────────────────────────────────── */
const AllBus = ({ onBookBus }) => {
  const [loading, setLoading]         = useState(true);
  const [buses, setBuses]             = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [clickRect, setClickRect]     = useState(null);
  const [filter, setFilter]           = useState('all'); // 'all' | 'available' | 'full'

  useEffect(() => { fetchBuses(); }, []);

  const fetchBuses = () => {
    axios.get("http://localhost:5000/buses")
      .then(res => { setBuses(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  const filtered = buses.filter(b => {
    if (filter === 'available') return (b.available_seats || 0) > 0;
    if (filter === 'full')      return (b.available_seats || 0) === 0;
    return true;
  });

  const availableCount = buses.filter(b => (b.available_seats || 0) > 0).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .f-display { font-family: 'DM Serif Display', serif; }
        .f-body    { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up {
          opacity:0;
          animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .route-card:hover .arrow-icon { transform: translateX(4px); }
        .arrow-icon { transition: transform 0.2s ease; }
      `}</style>

      {/* Main Wrapper */}
      <div className="w-full min-h-screen bg-[#0a0a0a] f-body">

        {/* ══════════════════════════════════════════════════════════
            HERO — splits into text (left) and graphic (right)
        ══════════════════════════════════════════════════════════ */}
        <div className="relative w-full border-b border-[#131313] overflow-hidden" style={{ background: '#0a0a0a' }}>
          <DotGrid />

          {/* glow */}
          <div className="absolute -top-32 left-1/3 w-[500px] h-[400px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 65%)' }} />

          <div className="relative max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16
                          flex flex-col lg:flex-row lg:items-center lg:justify-between
                          pt-16 pb-12 lg:pt-24 lg:pb-32 gap-12 lg:gap-8">

            {/* ── Left: text ── */}
            <div className="lg:max-w-[540px]">
              <h1 className="fade-up f-display text-white mb-5
                             text-[2.8rem] sm:text-[3.6rem] lg:text-[4.2rem]
                             leading-[1.08] tracking-[-0.5px]"
                style={{ animationDelay: '0ms' }}>
                Where are you<br/>
                <em className="not-italic text-[#4a4a4a]">headed today?</em>
              </h1>

              <p className="fade-up text-[#555] text-[1rem] sm:text-[1.1rem] leading-relaxed max-w-[420px]"
                style={{ animationDelay: '60ms' }}>
                Search routes, pick your ideal seat, and secure your booking in seconds.
              </p>
            </div>

            {/* ── Right: Custom SVG Graphic ── */}
            <div className="fade-up flex-1 w-full max-w-[500px] lg:max-w-[550px] relative flex justify-center items-center" 
                 style={{ animationDelay: '120ms' }}>
                 
              {/* Decorative backdrop glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[100px] bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
              
              {/* Stylized Dark Bus SVG */}
              <svg viewBox="0 0 500 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl relative z-10">
                {/* Base shadow */}
                <ellipse cx="250" cy="220" rx="200" ry="10" fill="#000" opacity="0.4" filter="blur(6px)" />

                {/* Bus Body */}
                <path d="M 60 180 L 60 90 C 60 70 75 55 95 55 L 400 55 C 420 55 435 70 440 90 L 450 180 Z" fill="url(#bodyGrad)" stroke="#1f1f1f" strokeWidth="2"/>

                {/* Windows */}
                <path d="M 65 110 L 65 75 C 65 65 70 60 80 60 L 420 60 C 430 60 435 65 438 75 L 445 110 Z" fill="url(#windowGrad)" stroke="#161616" strokeWidth="2"/>

                {/* Window Pillars */}
                {[130, 200, 270, 340, 400].map(x => (
                  <line key={x} x1={x} y1="60" x2={x+6} y2="110" stroke="#0f0f0f" strokeWidth="6"/>
                ))}

                {/* Accent Line */}
                <path d="M 60 140 L 447 140" stroke="#34d399" strokeWidth="1.5" opacity="0.4" />

                {/* Headlights & Taillights */}
                <path d="M 445 150 L 450 150 L 450 165 L 445 165 Z" fill="#34d399" style={{ filter: 'drop-shadow(0 0 10px rgba(52,211,153,0.8))' }} />
                <path d="M 60 150 L 55 150 L 55 165 L 60 165 Z" fill="#f87171" style={{ filter: 'drop-shadow(0 0 10px rgba(248,113,113,0.8))' }} />

                {/* Wheels */}
                <circle cx="140" cy="180" r="28" fill="#0a0a0a" stroke="#222" strokeWidth="4"/>
                <circle cx="140" cy="180" r="12" fill="#1a1a1a" stroke="#333" strokeWidth="2"/>

                <circle cx="370" cy="180" r="28" fill="#0a0a0a" stroke="#222" strokeWidth="4"/>
                <circle cx="370" cy="180" r="12" fill="#1a1a1a" stroke="#333" strokeWidth="2"/>

                {/* Defs for gradients */}
                <defs>
                  <linearGradient id="bodyGrad" x1="0" y1="55" x2="0" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#171717"/>
                    <stop offset="1" stopColor="#0a0a0a"/>
                  </linearGradient>
                  <linearGradient id="windowGrad" x1="0" y1="60" x2="0" y2="110" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#222"/>
                    <stop offset="1" stopColor="#050505"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            SEARCH BAR (Pulled up to overlap the hero section)
        ══════════════════════════════════════════════════════════ */}
        <div className="relative z-10 -mt-10 px-6 fade-up" style={{ animationDelay: '200ms' }}>
          <SearchBusContent onBookBus={(bus) => {
            setClickRect(null); 
            setSelectedBus(bus);
          }} />
        </div>

        {/* ══════════════════════════════════════════════════════════
            FILTER BAR + ALL ROUTE LIST
        ══════════════════════════════════════════════════════════ */}
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-12 lg:py-16">

          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-1.5 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-1 w-fit">
              {[
                { key: 'all',       label: 'All Routes' },
                { key: 'available', label: 'Available' },
                { key: 'full',      label: 'Full' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg text-[0.78rem] font-medium transition-all duration-200 ${
                    filter === key
                      ? 'bg-white text-[#0a0a0a] shadow-sm'
                      : 'text-[#444] hover:text-[#888]'
                  }`}
                >
                  {label}
                  {key === 'all'       && !loading && <span className="ml-1.5 text-[0.65rem] opacity-60">{buses.length}</span>}
                  {key === 'available' && !loading && <span className="ml-1.5 text-[0.65rem] opacity-60">{availableCount}</span>}
                  {key === 'full'      && !loading && <span className="ml-1.5 text-[0.65rem] opacity-60">{buses.length - availableCount}</span>}
                </button>
              ))}
            </div>

            <span className="text-[0.7rem] uppercase tracking-[1.5px] text-[#2a2a2a] hidden sm:block">
              Click any route to view details
            </span>
          </div>

          {/* ── Cards grid ── */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} delay={`${i * 70}ms`} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-28 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#0f0f0f] border border-[#161616] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="1" y="3" width="15" height="13" rx="2"/>
                  <path d="M16 8h4l3 6v3h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <p className="text-[#2a2a2a] text-sm">No routes match this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((bus, i) => {
                const seats = bus.available_seats || 0;
                const cap   = bus.capacity || 0;
                const pct   = cap > 0 ? Math.round((seats / cap) * 100) : 0;
                const accentColor = pct > 50 ? '#34d399' : pct > 20 ? '#fbbf24' : '#f87171';
                const isFull = seats === 0;

                return (
                  <div
                    key={bus.bus_id || bus.id}
                    onClick={(e) => {
                      setClickRect(e.currentTarget.getBoundingClientRect());
                      setSelectedBus(bus);
                    }}
                    className={`route-card fade-up group relative flex items-center gap-4
                                px-5 py-4 rounded-2xl border cursor-pointer
                                transition-all duration-200
                                ${isFull
                                  ? 'bg-[#0d0d0d] border-[#131313] opacity-50 cursor-default'
                                  : 'bg-[#0f0f0f] border-[#171717] hover:bg-[#121212] hover:border-[#222] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                                }`}
                    style={{ animationDelay: `${i * 45}ms` }}
                  >
                    {/* accent */}
                    <div className="shrink-0 w-[3px] h-12 rounded-full"
                      style={{ backgroundColor: accentColor, opacity: isFull ? 0.15 : 0.6 }} />

                    {/* route info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-white font-medium text-[0.95rem] sm:text-[1rem] truncate">
                          {bus.start_point}
                        </span>
                        <svg className="arrow-icon shrink-0 text-[#2e2e2e]" width="13" height="13"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                        <span className="text-[#666] font-medium text-[0.95rem] sm:text-[1rem] truncate">
                          {bus.dest}
                        </span>
                      </div>
                      <SeatBar available={seats} capacity={cap} />
                    </div>

                    {/* meta */}
                    <div className="shrink-0 flex flex-col items-end gap-1.5 pl-4 border-l border-[#161616] min-w-[80px]">
                      <span className="font-mono text-[#333] text-[0.68rem] tracking-wider">
                        #{bus.bus_no}
                      </span>
                      {bus.travel_data && (
                        <span className="text-[#2a2a2a] text-[0.65rem]">
                          {formatDate(bus.travel_data)}
                        </span>
                      )}
                    </div>

                    {/* chevron */}
                    {!isFull && (
                      <svg className="shrink-0 text-[#1e1e1e] group-hover:text-[#333] transition-colors duration-200"
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* bottom breathing room */}
          <div className="h-16" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          DETAIL MODAL
      ══════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={!!selectedBus}
        onClose={() => setSelectedBus(null)}
        title="Route Details"
        originRect={clickRect}
      >
        {selectedBus && (() => {
          const seats = selectedBus.available_seats || 0;
          const cap   = selectedBus.capacity || 0;
          const pct   = cap > 0 ? Math.round((seats / cap) * 100) : 0;
          const color = pct > 50 ? '#34d399' : pct > 20 ? '#fbbf24' : '#f87171';
          return (
            <div className="flex flex-col gap-4 f-body text-white">

              {/* Route */}
              <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5
                              flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-white font-semibold text-[1.05rem] truncate">{selectedBus.start_point}</p>
                  <p className="text-[#383838] text-[0.65rem] uppercase tracking-wider mt-1">Origin</p>
                </div>
                <svg className="shrink-0 text-[#242424]" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                <div className="text-right min-w-0">
                  <p className="text-white font-semibold text-[1.05rem] truncate">{selectedBus.dest}</p>
                  <p className="text-[#383838] text-[0.65rem] uppercase tracking-wider mt-1">Destination</p>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Bus Number',     value: `#${selectedBus.bus_no}`, mono: true },
                  { label: 'Travel Date',    value: formatDate(selectedBus.travel_data) },
                  { label: 'Total Capacity', value: cap },
                  { label: 'Seats Left',     value: seats, style: { color } },
                ].map(({ label, value, mono, style }) => (
                  <div key={label} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4">
                    <p className="text-[#383838] text-[0.65rem] uppercase tracking-wider mb-2">{label}</p>
                    <p className={`font-semibold text-[1rem] ${mono ? 'font-mono' : ''}`} style={style || { color: '#fff' }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Availability */}
              <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-4 py-3.5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[#383838] text-[0.65rem] uppercase tracking-wider">Availability</span>
                  <span className="text-[0.68rem]" style={{ color }}>{pct}% free</span>
                </div>
                <SeatBar available={seats} capacity={cap} />
              </div>

              {/* CTA */}
              <button
                onClick={() => { onBookBus?.(selectedBus); setSelectedBus(null); }}
                disabled={seats <= 0}
                className="w-full bg-white text-[#0a0a0a] py-4 rounded-xl font-semibold text-sm
                           transition-all duration-200 hover:bg-[#e8e8e8] active:scale-[0.98]
                           disabled:bg-[#111] disabled:text-[#2a2a2a] disabled:border
                           disabled:border-[#1a1a1a] disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
              >
                {seats > 0 ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/>
                    </svg>
                    Choose Seats
                  </>
                ) : 'Fully Booked'}
              </button>
            </div>
          );
        })()}
      </Modal>
    </>
  );
};

export default AllBus;