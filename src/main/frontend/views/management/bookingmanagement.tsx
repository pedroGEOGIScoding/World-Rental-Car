import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useEffect, useState } from 'react';
import { UserEndpoint } from 'Frontend/generated/endpoints';
import { Grid } from '@vaadin/react-components/Grid.js';
import { GridColumn } from '@vaadin/react-components/GridColumn.js';
import { Notification } from '@vaadin/react-components/Notification.js';
import { Button } from '@vaadin/react-components/Button.js';
import { Dialog } from '@vaadin/react-components/Dialog.js';
import { TextField } from '@vaadin/react-components/TextField.js';
import { NumberField } from '@vaadin/react-components/NumberField.js';
import { Select } from '@vaadin/react-components/Select.js';
import { FormLayout } from '@vaadin/react-components/FormLayout.js';
import { DatePicker } from '@vaadin/react-components/DatePicker.js';
import type Booking from 'Frontend/generated/com/pedro/apps/users/Booking';
import type User from 'Frontend/generated/com/pedro/apps/users/User';
import { useNavigate } from 'react-router';

export const config: ViewConfig = {
  menu: { order: 6, icon: 'line-awesome/svg/ticket-alt-solid.svg' },
  title: 'Booking Management',
};

export default function BookingManagementView() {
  const navigate = useNavigate();
  // State for bookings data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  
  // Form state
  const [userId, setUserId] = useState('');
  const [operation, setOperation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalToPayment, setTotalToPayment] = useState(0);
  const [statusPayment, setStatusPayment] = useState('');
  const [statusBooking, setStatusBooking] = useState('');
  
  // Status options
  const bookingStatusOptions = [
    { label: 'Reserved', value: 'RESERVED' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'Completed', value: 'COMPLETED' }
  ];
  
  const paymentStatusOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Refunded', value: 'REFUNDED' },
    { label: 'Failed', value: 'FAILED' }
  ];

  useEffect(() => {
    // Fetch all bookings when the component mounts
    fetchAllBookings();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Fetch all bookings using existing methods
  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      
      // First get all users
      const users = await UserEndpoint.getAllUsersById('profile');
      const validUsers = users?.filter((user): user is User => user !== undefined) || [];
      
      // Then get bookings for each user, but optimize by using Promise.all
      const bookingPromises = validUsers.map(user => {
        if (user.userId) {
          return UserEndpoint.getBookingsByUser(user.userId);
        }
        return Promise.resolve([]);
      });
      
      const bookingsArrays = await Promise.all(bookingPromises);
      
      // Flatten the array of arrays and filter out undefined values
      const allBookings = bookingsArrays
        .flat()
        .filter((booking): booking is Booking => booking !== undefined && 
          booking.operation !== undefined && 
          booking.operation.startsWith('booking'));
      
      setBookings(allBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Notification.show('Failed to load bookings. Please try again later.', { 
        position: 'middle',
        duration: 3000,
        theme: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Open edit dialog and set form values
  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setUserId(booking.userId || '');
    setOperation(booking.operation || '');
    setStartDate(booking.startDate || '');
    setEndDate(booking.endDate || '');
    setTotalToPayment(booking.totalToPayment || 0);
    setStatusPayment(booking.statusPayment || '');
    setStatusBooking(booking.statusBooking || '');
    setDialogOpen(true);
  };
  
  // Save edited booking
  const handleSave = async () => {
    if (!editingBooking) return;
    
    try {
      // Create updated booking object
      const updatedBooking: Booking = {
        ...editingBooking,
        userId,
        operation,
        startDate,
        endDate,
        totalToPayment,
        statusPayment,
        statusBooking
      };
      
      // Call the save endpoint
      await UserEndpoint.saveBooking(updatedBooking);
      
      // Update local state
      setBookings(bookings.map(booking => 
        (booking.userId === updatedBooking.userId && booking.operation === updatedBooking.operation) 
          ? updatedBooking 
          : booking
      ));
      
      // Close dialog and show success notification
      setDialogOpen(false);
      Notification.show('Booking updated successfully', { 
        position: 'bottom-end',
        duration: 3000,
        theme: 'success'
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      Notification.show('Failed to update booking. Please try again.', { 
        position: 'middle',
        duration: 3000,
        theme: 'error'
      });
    }
  };

  // Format car information for display
  const formatCarInfo = (car: any) => {
    if (!car) return 'N/A';
    return `${car.make || ''} ${car.model || ''} (${car.year || 'N/A'})`;
  };

  return (
    <div className="flex flex-col h-full box-border">
      <div className="flex justify-between items-center">
        <h2 className="m-m">Booking Management</h2>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-m flex-grow">
          <span>Loading bookings...</span>
        </div>
      ) : (
        <div className="flex-grow overflow-auto px-m pb-m">
          <Grid items={bookings} className="h-full w-full" theme="no-border">
            <GridColumn path="userId" header="User ID" />
            <GridColumn path="operation" header="Operation" />
            <GridColumn 
              header="Car" 
              renderer={({ item }) => formatCarInfo((item as Booking).car)} 
            />
            <GridColumn path="startDate" header="Start Date" />
            <GridColumn path="endDate" header="End Date" />
            <GridColumn path="totalToPayment" header="Total Price" />
            <GridColumn path="statusPayment" header="Payment Status" />
            <GridColumn path="statusBooking" header="Booking Status" />
            <GridColumn 
              header="Actions" 
              width="150px"
              frozen
              textAlign="center"
              renderer={({ item }) => (
                <div className="flex gap-s justify-center">
                  <Button 
                    theme="tertiary small" 
                    onClick={() => handleEdit(item as Booking)}
                  >
                    Edit
                  </Button>
                </div>
              )}
            />
          </Grid>
        </div>
      )}
      
      {/* Edit Booking Dialog */}
      <Dialog 
        header={`Edit Booking: ${editingBooking?.operation || ''}`}
        opened={dialogOpen} 
        onOpenedChanged={({ detail }) => setDialogOpen(detail.value)}
        footerRenderer={() => (
          <div className="flex gap-m justify-end">
            <Button theme="tertiary" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button theme="primary" onClick={handleSave}>Save</Button>
          </div>
        )}
      >
        <FormLayout>
          <TextField 
            label="User ID" 
            value={userId} 
            readonly
          />
          <TextField 
            label="Operation" 
            value={operation} 
            readonly
          />
          <TextField 
            label="Start Date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)}
          />
          <TextField 
            label="End Date" 
            value={endDate} 
            onChange={e => setEndDate(e.target.value)}
          />
          <NumberField 
            label="Total Price" 
            value={totalToPayment.toString()} 
            onChange={e => setTotalToPayment(parseFloat(e.target.value || '0'))}
            min={0}
          />
          <Select 
            label="Payment Status" 
            value={statusPayment}
            onChange={(e) => setStatusPayment(e.target.value)}
          >
            {paymentStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select 
            label="Booking Status" 
            value={statusBooking}
            onChange={(e) => setStatusBooking(e.target.value)}
          >
            {bookingStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormLayout>
      </Dialog>
    </div>
  );
}