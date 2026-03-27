import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import AddBusContent from './components/AddBus';
import SearchBusContent from './components/SearchBus';
import AllBus from './components/AllBus';
import './index.css';

const App = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchRect, setSearchRect] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addRect, setAddRect] = useState(null);
  const [busKey, setBusKey] = useState(0);

  const fetchBuses = () => setBusKey(k => k + 1);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-['Inter',_sans-serif]">
      <Navbar
        onSearchClick={(rect) => { setSearchRect(rect); setSearchOpen(true); }}
        onAddClick={(rect) => { setAddRect(rect); setAddOpen(true); }}
      />

      {/* Page content — offset for fixed navbar */}
      <div className="flex flex-col items-center pt-24 pb-16 px-4">
        <AllBus key={busKey} />
      </div>

      {/* Search Modal */}
      <Modal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Search Routes"
        originRect={searchRect}
      >
        <SearchBusContent />
      </Modal>

      {/* Add Bus Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Bus"
        originRect={addRect}
      >
        <AddBusContent
          refreshBuses={fetchBuses}
          onClose={() => setAddOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default App;