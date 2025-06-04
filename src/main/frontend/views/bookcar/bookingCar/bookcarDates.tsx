import {useEffect, useReducer, useState} from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {useNavigate} from "react-router";
import {Button, ComboBox, Checkbox, DatePicker, DatePickerElement} from "@vaadin/react-components";
import { formatISO } from 'date-fns';
import { useSignal } from '@vaadin/hilla-react-signals';

export const config: ViewConfig = {
  menu: { order: 2,icon: 'line-awesome/svg/car-solid.svg' },
  title: 'Book a car' };

// Define the state interface
interface BookingState {
  startDate: string;
  endDate: string;
  sameLocation: boolean;
  pickupLocation: string;
  returnLocation: string;
}

// Define action types
type BookingAction = 
  | { type: 'SET_START_DATE'; payload: string }
  | { type: 'SET_END_DATE'; payload: string }
  | { type: 'SET_SAME_LOCATION'; payload: boolean }
  | { type: 'SET_PICKUP_LOCATION'; payload: string }
  | { type: 'SET_RETURN_LOCATION'; payload: string };

// Initial state
const initialState: BookingState = {
  startDate: '',
  endDate: '',
  sameLocation: false,
  pickupLocation: '',
  returnLocation: ''
};

// Reducer function
function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_START_DATE':
      return { ...state, startDate: action.payload };
    case 'SET_END_DATE':
      return { ...state, endDate: action.payload };
    case 'SET_SAME_LOCATION':
      return { 
        ...state, 
        sameLocation: action.payload,
        // If setting sameLocation to true, copy pickup location to return location
        returnLocation: action.payload ? state.pickupLocation : state.returnLocation
      };
    case 'SET_PICKUP_LOCATION':
      return { 
        ...state, 
        pickupLocation: action.payload,
        // If sameLocation is true, update return location as well
        returnLocation: state.sameLocation ? action.payload : state.returnLocation
      };
    case 'SET_RETURN_LOCATION':
      return { ...state, returnLocation: action.payload };
    default:
      return state;
  }
}

export default function BookacarView() {
  const [bookingState, dispatch] = useReducer(bookingReducer, initialState);
  const navigate = useNavigate();

  // Date validation
  const startDateError = useSignal('');
  const endDateError = useSignal('');

  // Min and max dates (180 days from today)
  const today = new Date();
  const minDate = useSignal(today);
  const maxDate = useSignal(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 180));

  // Example locations; replace with real data as needed
  const locations = ['DELEG#001', 'DELEG#002', 'DELEG#003', 'DELEG#004', "DELEG#005"];

  const handleSubmit = () => {
    // Check for validation errors
    if (startDateError.value || endDateError.value) {
      alert('Please fix the validation errors before proceeding');
      return;
    }

    // Destructure state for easier access
    const { startDate, endDate, pickupLocation, sameLocation, returnLocation } = bookingState;

    // Validate form data
    if (startDate && endDate && pickupLocation && (sameLocation || returnLocation)) {
      // Check if end date is before start date
      if (new Date(endDate) < new Date(startDate)) {
        alert('End date must be on or after start date');
        return;
      }

      // Save booking data to localStorage
      const bookingData = {
        startDate,
        endDate,
        pickupLocation,
        returnLocation: sameLocation ? pickupLocation : returnLocation
      };
      localStorage.setItem('bookingData', JSON.stringify(bookingData));

      navigate('/bookcar/bookcarSelection');
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-l text-center box-border">
      <h2>Book a Car</h2>

      <div className="card p-m" style={{ width: '400px' }}>
        <div className="flex flex-col gap-m">
          <DatePicker
            label="Start Date"
            helperText="Must be within 180 days from today"
            required
            min={formatISO(minDate.value, { representation: 'date' })}
            max={formatISO(maxDate.value, { representation: 'date' })}
            value={bookingState.startDate}
            onChange={(e) => dispatch({ type: 'SET_START_DATE', payload: e.target.value })}
            errorMessage={startDateError.value}
            onValidated={(event) => {
              const field = event.target as DatePickerElement;
              if (!field.value && (field.inputElement as HTMLInputElement).value) {
                startDateError.value = 'Invalid date format';
              } else if (!field.value) {
                startDateError.value = 'Field is required';
              } else if (field.value < field.min!) {
                startDateError.value = 'Too early, choose another date';
              } else if (field.value > field.max!) {
                startDateError.value = 'Too late, choose another date';
              } else {
                startDateError.value = '';
              }
            }}
          />

          <DatePicker
            label="End Date"
            helperText="Must be within 180 days from today"
            required
            min={formatISO(minDate.value, { representation: 'date' })}
            max={formatISO(maxDate.value, { representation: 'date' })}
            value={bookingState.endDate}
            onChange={(e) => dispatch({ type: 'SET_END_DATE', payload: e.target.value })}
            errorMessage={endDateError.value}
            onValidated={(event) => {
              const field = event.target as DatePickerElement;
              if (!field.value && (field.inputElement as HTMLInputElement).value) {
                endDateError.value = 'Invalid date format';
              } else if (!field.value) {
                endDateError.value = 'Field is required';
              } else if (field.value < field.min!) {
                endDateError.value = 'Too early, choose another date';
              } else if (field.value > field.max!) {
                endDateError.value = 'Too late, choose another date';
              } else {
                endDateError.value = '';
              }
            }}
          />

          <ComboBox
            label="Pickup Location"
            items={locations}
            value={bookingState.pickupLocation}
            onChange={(e) => dispatch({ type: 'SET_PICKUP_LOCATION', payload: e.target.value as string })}
            required
            clearButtonVisible
          />

          <Checkbox
            label="Return to same location"
            checked={bookingState.sameLocation}
            onCheckedChanged={(e) => {
              dispatch({ type: 'SET_SAME_LOCATION', payload: e.detail.value });
            }}
          />

          {!bookingState.sameLocation && (
            <ComboBox
              label="Return Location"
              items={locations}
              value={bookingState.returnLocation}
              onChange={(e) => dispatch({ type: 'SET_RETURN_LOCATION', payload: e.target.value as string })}
              required
              clearButtonVisible
            />
          )}

          <Button onClick={handleSubmit} theme="primary">
            Confirm Booking
          </Button>
        </div>
      </div>

      <p>Select your dates and locations to book a car</p>
    </div>
  );
}