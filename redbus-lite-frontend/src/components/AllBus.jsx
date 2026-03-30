import React, { useState, useEffect } from 'react';
import axios from "axios";
import Modal from './Modal';

const AllBus = () => {
  const [loading, setLoading] = useState(true);
  const [buses, setBuses] = useState([]);
  
  const [selectedBus, setSelectedBus] = useState(null);
  const [clickRect, setClickRect] = useState(null);
  
  // NEW: States for booking and notifications
  const [bookingView, setBookingView] = useState('details'); // 'details' or 'form'
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = () => {
    axios.get("http://localhost:5000/buses")
      .then(res => {
        setBuses(res.data);
        setLoading(false);
      })
      .catch(err => {
        showNotification("Failed to load buses. Is the server running?", "error");
        setLoading(false);
      });
  };

  // Helper to show on-screen messages
  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
  };

  const handleBookTicket = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/buses/book", {
        name: name,
        age: age,
        bus_id: selectedBus.bus_id 
      });
      
      showNotification(`Ticket successfully booked for ${name}!`, "success");

      setSelectedBus(null);
      setName('');
      setAge('');
      setBookingView('details');
      
      // Optional: Refetch buses if your backend updates available_seats on booking
      fetchBuses(); 
    } catch (err) {
      showNotification("Failed to book ticket. Please try again.", "error");
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const closeModal = () => {
    setSelectedBus(null);
    setTimeout(() => setBookingView('details'), 300); // Reset view after animation closes
  }

  return (
    <div className="w-full max-w-[1000px] py-10 px-5 relative">
      
      {/* On-Screen Notification Toast */}
      {notification && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl z-[9999] text-[0.95rem] font-medium transition-all duration-300 flex items-center gap-2 ${notification.type === 'error' ? 'bg-[#3b1515] text-red-400 border border-red-900/50' : 'bg-[#153b24] text-emerald-400 border border-emerald-900/50'}`}>
          {notification.msg}
        </div>
      )}
      <header className="mb-10">
        <h1 className="text-[2rem] font-semibold m-0 mb-2 tracking-[-0.5px]">Available buses</h1>
        <p className="text-[#a0a0a0] m-0 text-[0.95rem]">Select your journey to continue</p>
      </header>
      
      <div className="flex flex-col gap-4 overflow-x-auto pb-4">
        {loading ? (
          <div className="text-center text-[#a0a0a0] p-10">Loading routes...</div>
        ) : (
          buses.map(bus => (
            <div 
              onClick={(e) => {
                setClickRect(e.currentTarget.getBoundingClientRect());
                setSelectedBus(bus);
              }}
              className="group bg-[#1e1e1e] border border-[#333333] rounded-xl p-6 flex items-center justify-between w-full min-w-fit transition-all duration-200 ease-in cursor-pointer hover:bg-[#2a2a2a] hover:-translate-y-[2px] hover:border-[#444444]" 
              key={bus.id}
            >
              <div className="flex flex-col flex-1">
                <span className="text-[1.1rem] font-medium mb-1 whitespace-nowrap">{bus.start_point}</span>
                <span className="text-[0.75rem] uppercase tracking-[0.5px] text-[#a0a0a0]">Departure</span>
              </div>
              <div className="flex items-center justify-center w-[60px] shrink-0 text-[#a0a0a0] mx-4">
                <div className="h-[1px] bg-[#333333] grow -mr-[10px]"></div>
                <svg className="w-5 h-5 bg-[#1e1e1e] group-hover:bg-[#2a2a2a] px-1 transition-colors duration-200 ease-in" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </div>
              <div className="flex flex-col flex-1 items-end text-right">
                <span className="text-[1.1rem] font-medium mb-1 whitespace-nowrap">{bus.dest}</span>
                <span className="text-[0.75rem] uppercase tracking-[0.5px] text-[#a0a0a0]">Destination</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={!!selectedBus} 
        onClose={closeModal} 
        title={bookingView === 'details' ? "Route Details" : "Passenger Details"}
        originRect={clickRect} 
      >
        {selectedBus && (
          <div className="flex flex-col gap-5 text-white">
            
            {/* VIEW 1: Bus Details */}
            {bookingView === 'details' ? (
              <>
                <div className="flex items-center justify-between bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a]">
                  <div className="flex flex-col">
                    <span className="text-xl font-semibold">{selectedBus.start_point}</span>
                  </div>
                  <svg width="24" height="24" className="text-[#666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  <div className="flex flex-col text-right">
                    <span className="text-xl font-semibold">{selectedBus.dest}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col p-3 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a]">
                    <span className="text-xs text-[#a0a0a0] mb-1">Bus Number</span>
                    <span className="font-medium font-mono">#{selectedBus.bus_no}</span>
                  </div>
                  <div className="flex flex-col p-3 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a]">
                    <span className="text-xs text-[#a0a0a0] mb-1">Travel Date</span>
                    <span className="font-medium text-sm">{formatDate(selectedBus.travel_data)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setBookingView('form')}
                  className="mt-2 w-full bg-white text-black py-3.5 rounded-xl font-semibold transition-all hover:bg-gray-200 active:scale-[0.98] disabled:bg-[#333] disabled:text-[#666] disabled:cursor-not-allowed"
                  disabled={selectedBus.available_seats <= 0}
                >
                  {selectedBus.available_seats > 0 ? 'Proceed to Booking' : 'Fully Booked'}
                </button>
              </>
            ) : (
              /* VIEW 2: Booking Form */
              <form onSubmit={handleBookTicket} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-[#a0a0a0]">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter passenger name"
                    className="bg-[#1e1e1e] border border-[#333333] text-white p-3.5 rounded-xl text-[0.95rem] outline-none focus:border-[#666] transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-[#a0a0a0]">Age</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter age"
                    className="bg-[#1e1e1e] border border-[#333333] text-white p-3.5 rounded-xl text-[0.95rem] outline-none focus:border-[#666] transition-all"
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    type="button"
                    onClick={() => setBookingView('details')}
                    className="flex-1 bg-[#2a2a2a] text-white py-3.5 rounded-xl font-semibold hover:bg-[#333] transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-white text-black py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-all active:scale-[0.98]"
                  >
                    Confirm Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AllBus;