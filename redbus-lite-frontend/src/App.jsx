import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import AddBusContent from './components/AddBus';
import SearchBusContent from './components/SearchBus';
import AllBus from './components/AllBus';
import AuthModal from './components/AuthModal';
import './index.css';
import { useEffect } from 'react';

const App = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchRect, setSearchRect] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addRect, setAddRect] = useState(null);
  const [busKey, setBusKey] = useState(0);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authRect, setAuthRect] = useState(null);
  const [ticketsOpen, setTicketsOpen] = useState(false);
  const [ticketsRect, setTicketsRect] = useState(null);
  const [seatPickerOpen, setSeatPickerOpen] = useState(false);
  const [seatPickerBus, setSeatPickerBus] = useState(null);
  const [pendingBus, setPendingBus] = useState(null);
  
  const fetchBuses = () => setBusKey(k => k + 1);

  useEffect(() => {
    const savedToken = localStorage.getItem('busapp_token');
    const savedUser = localStorage.getItem('busapp_user');
    if(savedToken && savedUser){
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  },[])

  const handleAuthSuccess = (userData, newToken) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('busapp_token', newToken);
    localStorage.setItem('busapp_user', JSON.stringify(userData));
    setAddOpen(false);
    if(pendingBus){
      setSeatPickerBus(pendingBus);
      setSeatPickerOpen(true);
      setPendingBus(null);
    }
  }
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('busapp_token');
    localStorage.removeItem('busapp_user');
  };

  const handleBookBus = (bus) => {
    if(!user){
      setPendingBus(bus);
      setAuthOpen(true);
    }
    else{
      setSeatPickerBus(bus);
      setSeatPickerOpen(true);
    }
  }
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-['Inter',_sans-serif]">
      <Navbar
        user={user}
        onSearchClick={(rect) => { setSearchRect(rect); setSearchOpen(true); }}
        onAddClick={(rect) => { setAddRect(rect); setAddOpen(true); }}
        onSignInClick={(rect) => { setAuthRect(rect); setAuthOpen(true); }}
        onMyTicketsClick={(rect) => { setTicketsRect(rect); setTicketsOpen(true); }}
        onLogout={handleLogout}
      />

      <div className="flex flex-col items-center pt-24 pb-16 px-4">
        <AllBus key={busKey} onBookBus = {handleBookBus} />
      </div>

      <Modal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Search Routes"
        originRect={searchRect}
      >
        <SearchBusContent  onBookBus={handleBookBus}/>
      </Modal>

      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Bus"
        originRect={addRect}
      >
      
      <AuthModal 
        isOpen={authOpen}
        onClose={() => { setAuthOpen(false); setPendingBus(null); }}
        onSuccess={handleAuthSuccess}
        originRect={authRect}
      />
      <SeatPickerModal 
        isOpen={seatPickerOpen}
        onClose={() => seatPickerOpen(false)}
        bus={seatPickerBus}
        token={token}
        onBookingComplete={fetchBuses}
      
      />
      <BookedTickets 
        isOpen={ticketsOpen}
        onClose={() => setTicketsOpen(false)}
        token={token}
        originRect={ticketsRect}
      
      />
        <AddBusContent
          refreshBuses={fetchBuses}
          onClose={() => setAddOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default App;