import React, { useState } from 'react';
import axios from 'axios';

function AddBusContent({ refreshBuses, onClose }) {
  const [busNo, setBusNo] = useState("");
  const [capacity, setCapacity] = useState("");
  const [available_seats, setAvailable] = useState("");
  const [start_point, setStart] = useState("");
  const [dest, setDest] = useState("");
  const [travel_data, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/buses/add", {
        bus_no: busNo,
        capacity: Number(capacity),
        available_seats: Number(available_seats),
        start_point,
        dest,
        travel_data,
      });
      if (refreshBuses) refreshBuses();
      onClose?.();
    } catch (error) {
      console.error(error);
      alert("Failed adding bus");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-[#1e1e1e] border border-[#2e2e2e] text-white p-3.5 rounded-xl text-[0.9rem] transition-all duration-200 outline-none placeholder:text-[#555] focus:border-[#505050] focus:bg-[#242424] [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-40 [&::-webkit-calendar-picker-indicator]:cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <input
            type="text"
            className={inputClasses}
            placeholder="Bus Number (e.g. WB-1234)"
            value={busNo}
            onChange={(e) => setBusNo(e.target.value)}
            required
          />
        </div>

        <input
          type="number"
          className={inputClasses}
          placeholder="Total Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />

        <input
          type="number"
          className={inputClasses}
          placeholder="Available Seats"
          value={available_seats}
          onChange={(e) => setAvailable(e.target.value)}
          required
        />

        <input
          type="text"
          className={`${inputClasses} col-span-1`}
          placeholder="Start Point"
          value={start_point}
          onChange={(e) => setStart(e.target.value)}
          required
        />

        <input
          type="text"
          className={`${inputClasses} col-span-1`}
          placeholder="Destination"
          value={dest}
          onChange={(e) => setDest(e.target.value)}
          required
        />

        <div className="col-span-2">
          <label className="block text-[#555] text-xs mb-1.5 ml-1">Travel Date</label>
          <input
            type="date"
            className={inputClasses}
            value={travel_data}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-[#121212] p-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 mt-1 hover:bg-[#e8e8e8] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Adding...
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Bus
          </>
        )}
      </button>
    </form>
  );
}

export default AddBusContent;