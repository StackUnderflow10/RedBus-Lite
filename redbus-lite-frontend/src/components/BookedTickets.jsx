import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios';
import Modal from './Modal';

const BookedTickets = ({ isOpen, onClose, token, originRect }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(isOpen && token){
            setLoading(true);
            axios.get('http://localhost:5000/bookings/my', {
                headers: { Authorization: `Bearer ${token}`},
            }).then(res => setBookings(res.data)).catch(() => setBookings([])).finally(() => setLoading(false))
        }
    },[isOpen, token])
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Tickets" originRect={originRect}>
      {loading ? (
        <div className="flex items-center justify-center py-12 text-[#555] text-sm gap-2">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
          Loading your tickets...
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#333]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-medium text-sm">No bookings yet</p>
            <p className="text-[#555] text-xs mt-1">Search for a route and book your first ticket</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-[#555] uppercase tracking-wider">
            {bookings.length} booking{bookings.length > 1 ? 's' : ''}
          </p>
 
          {bookings.map(b => (
            <div
              key={b.booking_id}
              className="bg-[#1a1a1a] border border-[#242424] rounded-xl overflow-hidden"
            >
              {/* Ticket punch line decoration */}
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#2e2e2e] to-transparent"/>
 
              <div className="p-4">
                {/* Route */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold text-[0.95rem]">{b.start_point}</p>
                    <p className="text-[#555] text-[0.7rem] uppercase tracking-wider mt-0.5">From</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#333]">
                    <div className="w-5 h-px bg-current"/>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    <div className="w-5 h-px bg-current"/>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold text-[0.95rem]">{b.dest}</p>
                    <p className="text-[#555] text-[0.7rem] uppercase tracking-wider mt-0.5">To</p>
                  </div>
                </div>
 
                {/* Meta strip */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#222]">
                  <span className="bg-[#222] border border-[#2e2e2e] text-[#aaa] text-xs px-2.5 py-1 rounded-lg font-mono">
                    #{b.bus_no}
                  </span>
 
                  <div className="flex items-center gap-1">
                    {b.seats.map(seat => (
                      <span
                        key={seat}
                        className="bg-emerald-900/25 border border-emerald-800/35 text-emerald-400 text-xs px-2 py-1 rounded-lg font-mono"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
 
                  {b.travel_data && (
                    <span className="text-[#555] text-xs ml-auto">
                      {new Date(b.travel_data).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
 
                {/* Booked at */}
                <p className="text-[#383838] text-[0.65rem] mt-2">
                  Booked on {new Date(b.booked_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

export default BookedTickets