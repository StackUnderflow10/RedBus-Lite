import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import BookingForm from './BookingForm';

const SearchBusContent = () => {
  const [start, setStart] = useState("");
  const [dest, setDest] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  // States for Modal and Notifications
  const [selectedBus, setSelectedBus] = useState(null);
  const [clickRect, setClickRect] = useState(null);
  const [notification, setNotification] = useState(null);

  const inputClasses = "w-full bg-[#1e1e1e] border border-[#2e2e2e] text-white p-3.5 rounded-xl text-[0.9rem] transition-all duration-200 outline-none placeholder:text-[#555] focus:border-[#505050] focus:bg-[#242424]";

  // Helper to show on-screen toast messages
  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSearch = async () => {
    const cleanStart = start.trim();
    const cleanDest = dest.trim();

    if (!cleanStart || !cleanDest) {
      showNotification("Please enter both start point and destination", "error");
      return;
    }
    try {
      setLoading(true);
      setSearched(true);
      const res = await axios.get(
        `http://localhost:5000/buses/search?start=${cleanStart}&dest=${cleanDest}`
      );
      setResults(res.data);
      if(res.data.length > 0) {
        showNotification(`Found ${res.data.length} buses for this route!`, "success");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error searching buses. Please check server.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handlers for the BookingForm component
  const handleBookingSuccess = (message) => {
    showNotification(message, "success");
    setSelectedBus(null); // Close modal
    handleSearch(); // Refresh search results to update available seats
  };

  const handleBookingError = (message) => {
    showNotification(message, "error");
  };

  return (
    <div className="flex flex-col gap-4 relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl z-[9999] text-[0.95rem] font-medium transition-all duration-300 flex items-center gap-2 ${notification.type === 'error' ? 'bg-[#3b1515] text-red-400 border border-red-900/50' : 'bg-[#153b24] text-emerald-400 border border-emerald-900/50'}`}>
          {notification.msg}
        </div>
      )}

      {/* Inputs */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="From — Start point"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className={`${inputClasses} pl-9`}
          />
        </div>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="To — Destination"
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className={`${inputClasses} pl-9`}
          />
        </div>

        <button
          onClick={handleSearch}
          className="w-full bg-white text-[#121212] p-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-[#e8e8e8] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          Search Routes
        </button>
      </div>

      {/* Divider */}
      {searched && <div className="h-px bg-[#222]" />}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-6 text-[#555] text-sm">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
          Searching routes...
        </div>
      )}

      {/* Empty State */}
      {!loading && searched && results.length === 0 && (
        <div className="text-center py-8">
          <div className="text-2xl mb-2">🚌</div>
          <p className="text-[#555] text-sm">No buses found for this route.</p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-[#555] uppercase tracking-wider">{results.length} route{results.length > 1 ? 's' : ''} found</p>
          {results.map((bus) => (
            <div
              key={bus.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition-all duration-200"
            >
              {/* Route row */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-medium text-[0.95rem]">{bus.start_point}</p>
                  <p className="text-[#555] text-xs mt-0.5">Departure</p>
                </div>

                <div className="flex items-center gap-1.5 text-[#444]">
                  <div className="w-8 h-px bg-[#333]"/>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  <div className="w-8 h-px bg-[#333]"/>
                </div>

                <div className="text-right">
                  <p className="text-white font-medium text-[0.95rem]">{bus.dest}</p>
                  <p className="text-[#555] text-xs mt-0.5">Destination</p>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-[#242424] border border-[#333] text-[#aaa] text-xs px-2.5 py-1 rounded-lg font-mono">
                    #{bus.bus_no}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${bus.available_seats > 0 ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/40' : 'bg-red-900/30 text-red-400 border border-red-800/40'}`}>
                    {bus.available_seats > 0 ? `${bus.available_seats} seats left` : 'Full'}
                  </span>
                  {bus.travel_data && (
                    <span className="text-[#555] text-xs">{new Date(bus.travel_data).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  )}
                </div>

                {/* The Book Button triggering the Modal */}
                <button
                  onClick={(e) => {
                    setClickRect(e.currentTarget.getBoundingClientRect());
                    setSelectedBus(bus);
                  }}
                  disabled={bus.available_seats === 0}
                  className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-white text-[#121212] hover:bg-[#e8e8e8] disabled:bg-[#2a2a2a] disabled:text-[#555] disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* The Reusable Modal + Booking Form */}
      <Modal 
        isOpen={!!selectedBus} 
        onClose={() => setSelectedBus(null)} 
        title="Passenger Details"
        originRect={clickRect}
      >
        {selectedBus && (
          <BookingForm 
            bus={selectedBus}
            onSuccess={handleBookingSuccess}
            onError={handleBookingError}
            onCancel={() => setSelectedBus(null)}
          />
        )}
      </Modal>

    </div>
  );
};

export default SearchBusContent;