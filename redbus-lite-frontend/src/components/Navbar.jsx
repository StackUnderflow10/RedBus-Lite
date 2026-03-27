import React from 'react';

const Navbar = ({ onSearchClick, onAddClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-[#0e0e0e]/80 backdrop-blur-md border-b border-[#222222]">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="2"/>
            <path d="M16 8h4l3 6v3h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <span className="text-white font-semibold text-[1rem] tracking-tight">BusRoute</span>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => onSearchClick(e.currentTarget.getBoundingClientRect())}
          className="flex items-center gap-2 text-[#a0a0a0] hover:text-white bg-[#1a1a1a] hover:bg-[#252525] border border-[#2a2a2a] hover:border-[#404040] px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          Search Bus
        </button>

        <button
          onClick={(e) => onAddClick(e.currentTarget.getBoundingClientRect())}
          className="flex items-center gap-2 text-[#121212] bg-white hover:bg-[#e8e8e8] px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add Bus
        </button>
      </div>
    </nav>
  );
};

export default Navbar;