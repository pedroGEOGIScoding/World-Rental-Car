import { useState } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {useNavigate} from "react-router";

export const config: ViewConfig = {
  menu: { order: 2,icon: 'line-awesome/svg/car-solid.svg' },
  title: 'Book a car' };

export default function BookacarView() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sameLocation, setSameLocation] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const navigate = useNavigate();

  // Example locations; replace with real data as needed
  const locations = ['London', 'Manchester', 'Birmingham', 'Liverpool'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/bookcar/bookcarSelection');
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label>Start Date <span style={{ color: '#007bff' }}>•</span></label>
            <div style={{ position: 'relative' }}>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', padding: '8px 36px 8px 8px', borderRadius: 6, border: '1px solid #e0e3eb', background: '#f5f7fa' }} required />
              <span style={{ position: 'absolute', right: 8, top: 8 }}>
                <svg width="20" height="20" fill="#888"><rect width="20" height="20" fill="none"/><path d="M6 2v2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H8V2H6zm10 16H4V8h12v10z"/></svg>
              </span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label>End Date <span style={{ color: '#007bff' }}>•</span></label>
            <div style={{ position: 'relative' }}>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: '100%', padding: '8px 36px 8px 8px', borderRadius: 6, border: '1px solid #e0e3eb', background: '#f5f7fa' }} required />
              <span style={{ position: 'absolute', right: 8, top: 8 }}>
                <svg width="20" height="20" fill="#888"><rect width="20" height="20" fill="none"/><path d="M6 2v2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H8V2H6zm10 16H4V8h12v10z"/></svg>
              </span>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={sameLocation} onChange={e => setSameLocation(e.target.checked)} />
            Same location for pickup and return
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Pickup Location</label>
          <select value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e0e3eb', background: '#f5f7fa' }}>
            <option value="" disabled>Select location</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label>Return Location</label>
          <select value={sameLocation ? pickupLocation : returnLocation} onChange={e => setReturnLocation(e.target.value)} disabled={sameLocation} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e0e3eb', background: '#f5f7fa' }}>
            <option value="" disabled>Select location</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={{ width: '100%', background: '#007bff', color: '#fff', padding: '12px 0', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 18, cursor: 'pointer' }}>
          Confirm Booking
        </button>
      </form>
    </div>
  );
}