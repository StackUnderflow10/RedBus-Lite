import React, { useState } from 'react';
import axios from 'axios';

const SearchBusContent = ({ onBookBus }) => {
  const [start, setStart] = useState("");
  const [dest, setDest] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const cleanStart = start.trim();
    const cleanDest = dest.trim();

    if (!cleanStart || !cleanDest) {
      alert("Please enter both start and destination");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const res = await axios.get(
        `http://localhost:5000/buses/search?start=${encodeURIComponent(cleanStart)}&dest=${encodeURIComponent(cleanDest)}`
      );
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 max-w-5xl mx-auto px-4 mt-8">
      
      {/* ─── HORIZONTAL SEARCH BAR ─── */}
      <div className="flex flex-col md:flex-row items-center w-full bg-[#181818] border border-[#2e2e2e] rounded-2xl p-2 gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
        
        {/* From Input */}
        <div className="relative w-full flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="From"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-transparent text-white pl-12 pr-4 py-3.5 outline-none placeholder:text-[#666] font-medium text-[1.05rem] hover:bg-[#222] focus:bg-[#222] rounded-xl transition-colors"
          />
        </div>

        {/* Divider (Desktop Only) */}
        <div className="hidden md:block w-px h-8 bg-[#333]" />

        {/* To Input */}
        <div className="relative w-full flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="To"
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-transparent text-white pl-12 pr-4 py-3.5 outline-none placeholder:text-[#666] font-medium text-[1.05rem] hover:bg-[#222] focus:bg-[#222] rounded-xl transition-colors"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full md:w-auto bg-white text-[#121212] px-8 py-3.5 rounded-xl text-[1.05rem] font-bold cursor-pointer transition-all duration-200 hover:bg-[#e8e8e8] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Search Buses
        </button>
      </div>

      {/* ─── SEARCH RESULTS AREA ─── */}
      <div className="w-full max-w-3xl mx-auto">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-10 text-[#777] text-sm">
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Searching routes...
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-12 bg-[#111] border border-[#222] rounded-2xl mt-4">
            <div className="text-3xl mb-3 opacity-50">🚌</div>
            <p className="text-[#888] text-sm font-medium">No buses found for this route.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="flex flex-col gap-3 mt-4">
            <p className="text-xs text-[#777] uppercase tracking-wider pl-2">
              {results.length} route{results.length > 1 ? 's' : ''} found
            </p>

            {results.map((bus) => (
              <div
                key={bus.bus_id}
                className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#444] transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white font-medium text-[1.1rem]">{bus.start_point}</p>
                    <p className="text-[#666] text-xs mt-0.5 uppercase tracking-wider">Departure</p>
                  </div>
                  <div className="flex items-center gap-2 text-[#444] flex-1 justify-center mx-4">
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#444] to-transparent"/>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-[#444] via-[#444] to-transparent"/>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium text-[1.1rem]">{bus.dest}</p>
                    <p className="text-[#666] text-xs mt-0.5 uppercase tracking-wider">Destination</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#222]">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#222] border border-[#333] text-[#aaa] text-xs px-2.5 py-1 rounded-md font-mono">
                      #{bus.bus_no}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                      (bus.available_seats ||0) > 0
                        ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-800/30'
                        : 'bg-red-900/20 text-red-400 border border-red-800/30'
                    }`}>
                      {(bus.available_seats ||0) > 0 ? `${bus.available_seats} seats left` : 'Full'}
                    </span>
                    {bus.travel_data && (
                      <span className="text-[#666] text-xs font-medium">
                        {new Date(bus.travel_data).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onBookBus?.(bus)}
                    disabled={bus.available_seats === 0}
                    className="text-sm font-semibold px-6 py-2 rounded-lg bg-white text-[#121212] hover:bg-[#e8e8e8] disabled:bg-[#222] disabled:text-[#555] disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
                  >
                    Book Seat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBusContent;