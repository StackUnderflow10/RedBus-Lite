import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = ({ bus, onSuccess, onCancel, onError }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post("http://localhost:5000/buses/book", {
        name: name,
        age: age,
        bus_id: bus.bus_id,
        start_point: bus.start_point,
        dest: bus.dest,
        amount: "550"
      });
      
      onSuccess(`Ticket successfully booked for ${name}!`);
      setName('');
      setAge('');
    } catch (err) {
      console.error(err);
      onError("Failed to book ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
      {/* Selected Route Info */}
      <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a] mb-2 text-sm text-[#a0a0a0]">
        Booking Route: <span className="text-white font-medium">{bus.start_point} &rarr; {bus.dest}</span>
      </div>

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
        {onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 bg-[#2a2a2a] text-white py-3.5 rounded-xl font-semibold hover:bg-[#333] transition-all"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-white text-black py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-all active:scale-[0.98] disabled:bg-[#888] disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Booking...' : 'Confirm Ticket'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;