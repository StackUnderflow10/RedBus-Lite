const Navbar = ({ user, onSearchClick, onAddClick, onSignInClick, onMyTicketsClick, onLogout }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-[#0e0e0e]/80 backdrop-blur-md border-b border-[#1e1e1e]">
      {/* Logo */}
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

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => onSearchClick(e.currentTarget.getBoundingClientRect())}
          className="flex items-center gap-2 text-[#888] hover:text-white bg-[#181818] hover:bg-[#222] border border-[#242424] hover:border-[#3a3a3a] px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <span className="hidden sm:inline">Search</span>
        </button>

        <button
          onClick={(e) => onAddClick(e.currentTarget.getBoundingClientRect())}
          className="flex items-center gap-2 text-[#888] hover:text-white bg-[#181818] hover:bg-[#222] border border-[#242424] hover:border-[#3a3a3a] px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span className="hidden sm:inline">Add Bus</span>
        </button>

        <div className="w-px h-5 bg-[#222] mx-0.5"/>

        {user ? (
          <>
            <button
              onClick={(e) => onMyTicketsClick(e.currentTarget.getBoundingClientRect())}
              className="flex items-center gap-2 text-[#888] hover:text-white bg-[#181818] hover:bg-[#222] border border-[#242424] hover:border-[#3a3a3a] px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
              <span className="hidden sm:inline">My Tickets</span>
            </button>

            <div className="flex items-center gap-2 bg-[#181818] border border-[#242424] rounded-xl pl-2.5 pr-1 py-1.5">
              <div className="w-5 h-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[0.6rem] font-bold text-white">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-[#ccc] text-sm font-medium max-w-[72px] truncate hidden sm:inline">
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={onLogout}
                title="Sign out"
                className="ml-0.5 p-1.5 rounded-lg text-[#444] hover:text-[#999] hover:bg-[#2a2a2a] transition-all duration-150"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={(e) => onSignInClick(e.currentTarget.getBoundingClientRect())}
            className="flex items-center gap-2 text-[#121212] bg-white hover:bg-[#e8e8e8] px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;