import {useEffect, useState} from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {useNavigate} from "react-router";
import {Button, ComboBox, Checkbox, DatePicker, DatePickerElement} from "@vaadin/react-components";
import { formatISO } from 'date-fns';
import { useSignal } from '@vaadin/hilla-react-signals';
import {DelegationEndpoint} from "Frontend/generated/endpoints";
import Car from "Frontend/generated/com/pedro/apps/delegations/Car";
import Delegation from "Frontend/generated/com/pedro/apps/delegations/Delegation";

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

  // Date validation
  const startDateError = useSignal('');
  const endDateError = useSignal('');

  // Min and max dates (180 days from today)
  const today = new Date();
  const minDate = useSignal(today);
  const maxDate = useSignal(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 180));





  // Example locations; replace with real data as needed
  const locations = ['Barcelona', 'Madrid', 'Bilbao', 'Valencia', "Zaragoza"];

  const handleSubmit = () => {
    // Check for validation errors
    if (startDateError.value || endDateError.value) {
      alert('Please fix the validation errors before proceeding');
      return;
    }

    // Validate form data
    if (startDate && endDate && pickupLocation && (sameLocation || returnLocation)) {
      // Check if end date is after start date
      if (new Date(endDate) <= new Date(startDate)) {
        alert('End date must be after start date');
        return;
      }

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
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value as string)}
            required
            clearButtonVisible
          />

          <Checkbox
            label="Return to same location"
            checked={sameLocation}
            onCheckedChanged={(e) => {
              setSameLocation(e.detail.value);
              if (e.detail.value) {
                setReturnLocation(pickupLocation);
              }
            }}
          />

          {!sameLocation && (
            <ComboBox
              label="Return Location"
              items={locations}
              value={returnLocation}
              onChange={(e) => setReturnLocation(e.target.value as string)}
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