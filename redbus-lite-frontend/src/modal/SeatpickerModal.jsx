import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";
function generateLayout(capacity) {
    const cols = ['A', 'B', 'C', 'D'];
    const rows = [];
    let filled = 0;
    let rowNum = 1;
    while(filled < capacity) {
        const row = [];
        for(let c = 0; c < 4 && filled < capacity ; c++){
            row.push(`${rowNum}${cols[c]}`);
            filled++;
        }
        rows.push(row);
        rowNum++;
    }
    return rows;
}

const Seat = ({ seatId, isBooked, isSelected, canSelect, onToggle }) => {
  const disabled = isBooked || (!isSelected && !canSelect);
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      title={isBooked ? 'Already booked' : isSelected ? 'Click to deselect' : seatId}
      className={[
        'relative w-10 h-11 rounded-t-2xl rounded-b-md text-[0.65rem] font-bold',
        'flex items-end justify-center pb-1.5 transition-all duration-150 select-none',
        isBooked
          ? 'bg-[#2a1515] border border-[#3d2020] text-[#4a2a2a] cursor-not-allowed'
          : isSelected
            ? 'bg-white text-[#111] border-2 border-white/40 shadow-[0_0_14px_rgba(255,255,255,0.18)] -translate-y-0.5 scale-105'
            : canSelect
              ? 'bg-[#1c1c1c] border border-[#333] text-[#666] hover:border-[#505050] hover:text-[#bbb] hover:bg-[#252525] cursor-pointer'
              : 'bg-[#161616] border border-[#1e1e1e] text-[#2e2e2e] cursor-not-allowed',
      ].join(' ')}
    >
      {/* Headrest bump */}
      <span className={[
        'absolute top-1.5 left-1/2 -translate-x-1/2 w-5 h-1.5 rounded-full',
        isBooked ? 'bg-[#3d2020]' : isSelected ? 'bg-black/15' : 'bg-[#2a2a2a]',
      ].join(' ')} />
      {seatId}
    </button>
  );
};

const SeatPickerModal = ({ isOpen, onClose, bus , token ,onBookingComplete }) => {
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loadingSeats, setLoadingSeats] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (isOpen && bus) {
            setSelectedSeats([]);
            setDone(false);
            setLoadingSeats(true);
            axios.get(`http://localhost:5000/bookings/seats/${bus.bus_id}`).then(res => {setBookedSeats(res.data); }).catch(() => setBookedSeats([])).finally(() => setLoadingSeats(false));
        }

    },[isOpen, bus])

    const layout = bus ? generateLayout(bus.capacity) : [];

    const toggleSeat = (seatId) => {
        setSelectedSeats(prev => prev.includes(seatId)? prev.filter(s => s !== seatId): prev.length < 4 ? [...prev, seatId] : prev);
    };

    const handleConfirm = async () => {
        if (!selectedSeats.length) return;
        setConfirming(true);
        try{
            await axios.post(
                'http://localhost:5000/bookings/book',
                { bus_id: bus.bus_id, seats: selectedSeats},
                {headers: { Authorization: `Bearer ${token}`}}
            );
            setDone(true);
            onBookingComplete?.();
        }
        catch (err) {
            alert(err.response?.data?.error || 'Booking failed. Please try again');
        }
        finally{
            setConfirming(false);
        }
    }
    const availableCount = bus
    ? bus.capacity - bookedSeats.length
    : 0;
 
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { onClose(); setDone(false); setSelectedSeats([]); }}
      title={done ? 'Booking Confirmed!' : 'Choose Your Seats'}
    >
      {bus && (
        done ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-900/30 border border-emerald-700/40 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg mb-1">You're all set!</p>
              <p className="text-[#666] text-sm">
                {selectedSeats.join(', ')} on Bus #{bus.bus_no}
              </p>
              <p className="text-[#555] text-xs mt-1">
                {bus.start_point} → {bus.dest}
              </p>
            </div>
            <button
              onClick={() => { onClose(); setDone(false); setSelectedSeats([]); }}
              className="w-full bg-white text-[#121212] p-3.5 rounded-xl text-sm font-bold hover:bg-[#e8e8e8] transition-all duration-200 mt-2"
            >
              Done
            </button>
          </div>
        ) : (
          /* ── Seat picker ── */
          <div className="flex flex-col gap-4">
 
            {/* Route summary */}
            <div className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3">
              <div>
                <p className="text-white font-medium text-sm">{bus.start_point}</p>
                <p className="text-[#555] text-[0.7rem] mt-0.5 uppercase tracking-wider">Origin</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              <div className="text-right">
                <p className="text-white font-medium text-sm">{bus.dest}</p>
                <p className="text-[#555] text-[0.7rem] mt-0.5 uppercase tracking-wider">Destination</p>
              </div>
            </div>
 
            {/* Legend + count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-[#666]">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-[#1c1c1c] border border-[#333]"/>
                  Available
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-white"/>
                  <span className="text-[#aaa]">Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-[#2a1515] border border-[#3d2020]"/>
                  Booked
                </div>
              </div>
              <span className="text-xs text-[#555]">{availableCount} free</span>
            </div>
 
            {/* Bus layout */}
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl overflow-hidden">
              {/* Bus front */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] bg-[#111]">
                <span className="text-[#333] text-xs uppercase tracking-widest font-medium">Front</span>
                {/* Steering wheel */}
                <div className="flex flex-col items-center gap-0.5 text-[#333]">
                  <div className="w-8 h-8 rounded-full border-2 border-[#2a2a2a] flex items-center justify-center">
                    <div className="w-4 h-px bg-[#2a2a2a]"/>
                  </div>
                  <span className="text-[0.55rem] uppercase tracking-wider">Driver</span>
                </div>
              </div>
 
              {loadingSeats ? (
                <div className="flex items-center justify-center py-12 text-[#555] text-sm gap-2">
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Loading seats...
                </div>
              ) : (
                <div className="p-4 overflow-y-auto max-h-[300px]">
                  {/* Column headers */}
                  <div className="flex items-center mb-3 pl-7">
                    <div className="flex gap-1.5 mr-7">
                      {['A', 'B'].map(c => (
                        <div key={c} className="w-10 text-center text-[0.6rem] text-[#333] uppercase tracking-widest">{c}</div>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      {['C', 'D'].map(c => (
                        <div key={c} className="w-10 text-center text-[0.6rem] text-[#333] uppercase tracking-widest">{c}</div>
                      ))}
                    </div>
                  </div>
 
                  {/* Seat rows */}
                  <div className="flex flex-col gap-2">
                    {layout.map((rowSeats, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-[0.6rem] text-[#333] w-5 text-right shrink-0 mr-1.5 font-mono">
                          {i + 1}
                        </span>
                        {/* Left: A, B */}
                        <div className="flex gap-1.5 mr-5">
                          {[rowSeats[0], rowSeats[1]].map((sid, j) =>
                            sid
                              ? <Seat
                                  key={sid}
                                  seatId={sid}
                                  isBooked={bookedSeats.includes(sid)}
                                  isSelected={selectedSeats.includes(sid)}
                                  canSelect={selectedSeats.length < 4}
                                  onToggle={() => toggleSeat(sid)}
                                />
                              : <div key={j} className="w-10 h-11" />
                          )}
                        </div>
                        {/* Aisle */}
                        <div className="w-3 shrink-0 flex justify-center mr-2">
                          <div className="w-px h-9 bg-[#1a1a1a]"/>
                        </div>
                        {/* Right: C, D */}
                        <div className="flex gap-1.5">
                          {[rowSeats[2], rowSeats[3]].map((sid, j) =>
                            sid
                              ? <Seat
                                  key={sid}
                                  seatId={sid}
                                  isBooked={bookedSeats.includes(sid)}
                                  isSelected={selectedSeats.includes(sid)}
                                  canSelect={selectedSeats.length < 4}
                                  onToggle={() => toggleSeat(sid)}
                                />
                              : <div key={j} className="w-10 h-11" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
 
            {/* Selection bar + confirm */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {selectedSeats.length > 0
                      ? `Seats: ${selectedSeats.join(', ')}`
                      : 'Tap a seat to select it'}
                  </p>
                  <p className="text-[#555] text-xs mt-0.5">
                    {selectedSeats.length}/4 selected · max 4 per booking
                  </p>
                </div>
                {selectedSeats.length > 0 && (
                  <button
                    onClick={() => setSelectedSeats([])}
                    className="text-xs text-[#555] hover:text-[#888] transition-colors px-2 py-1 rounded-lg hover:bg-[#1a1a1a]"
                  >
                    Clear
                  </button>
                )}
              </div>
 
              <button
                onClick={handleConfirm}
                disabled={!selectedSeats.length || confirming}
                className="w-full bg-white text-[#121212] p-3.5 rounded-xl text-sm font-bold transition-all duration-200 hover:bg-[#e8e8e8] active:scale-[0.98] disabled:bg-[#1a1a1a] disabled:text-[#3a3a3a] disabled:border disabled:border-[#242424] disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {confirming ? (
                  <>
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                    Confirming...
                  </>
                ) : selectedSeats.length > 0 ? (
                  `Confirm ${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''} →`
                ) : (
                  'Select seats to continue'
                )}
              </button>
            </div>
 
          </div>
        )
      )}
    </Modal>
  );
};
 
export default SeatPickerModal;
 

