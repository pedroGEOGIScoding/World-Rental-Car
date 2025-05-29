import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Card, Notification } from '@vaadin/react-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Car from "Frontend/generated/com/pedro/apps/delegations/Car";

export const config: ViewConfig = {
    menu: { exclude: true },
    title: 'Confirm Booking' };

interface BookingDetails {
    car: Car;
    totalPrice: number;
    startDate: string;
    endDate: string;
    pickupLocation: string;
    returnLocation: string;
}

export default function BookcarConfirmView() {
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedBookingDetails = localStorage.getItem('bookingDetails');
        if (storedBookingDetails) {
            try {
                const parsedDetails = JSON.parse(storedBookingDetails);
                setBookingDetails(parsedDetails);
                console.log('BookcarConfirmView: Retrieved booking details:', parsedDetails);
            } catch (e) {
                console.error('BookcarConfirmView: Error parsing booking details:', e);
            }
        } else {
            console.log('BookcarConfirmView: No booking details found in localStorage');
        }
        setLoading(false);
    }, []);

    const handleConfirmBooking = () => {
        // Here you would typically send the booking to the server
        console.log('Confirming booking:', bookingDetails);
        
        // Show success notification
        Notification.show('Booking confirmed successfully!', {
            position: 'middle',
            duration: 3000,
            theme: 'success'
        });
        
        // Clear booking data
        localStorage.removeItem('bookingData');
        localStorage.removeItem('bookingDetails');
        
        // Navigate to home or booking confirmation
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    const handleCancel = () => {
        navigate('/bookcar/bookcarSelection');
    };

    if (loading) {
        return <div className="p-m">Loading booking details...</div>;
    }

    if (!bookingDetails) {
        return (
            <div className="p-m">
                <h2>No Booking Details Found</h2>
                <p>There was an error retrieving your booking details.</p>
                <Button theme="primary" onClick={() => navigate('/bookcar')}>
                    Return to Booking
                </Button>
            </div>
        );
    }

    const { car, totalPrice, startDate, endDate, pickupLocation, returnLocation } = bookingDetails;
    const formattedStartDate = new Date(startDate).toLocaleDateString();
    const formattedEndDate = new Date(endDate).toLocaleDateString();
    
    return (
        <div className="p-m">
            <h2>Please confirm your booking</h2>
            
            <div className="grid gap-m" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Card className="p-m">
                    <h3 className="mb-m">Selected Car</h3>
                    <div className="flex flex-col gap-s">
                        <div className="font-bold text-xl">{car.make} {car.model} ({car.year})</div>
                        <div><strong>Color:</strong> {car.color}</div>
                        <div><strong>Price per day:</strong> ${car.price.toFixed(2)}</div>
                    </div>
                </Card>
                
                <Card className="p-m">
                    <h3 className="mb-m">Booking Details</h3>
                    <div className="flex flex-col gap-s">
                        <div><strong>Pickup Date:</strong> {formattedStartDate}</div>
                        <div><strong>Return Date:</strong> {formattedEndDate}</div>
                        <div><strong>Pickup Location:</strong> {pickupLocation}</div>
                        <div><strong>Return Location:</strong> {returnLocation}</div>
                        <div className="font-bold mt-m text-xl">Total Price: ${totalPrice.toFixed(2)}</div>
                    </div>
                </Card>
                
                <div className="flex gap-m mt-m">
                    <Button theme="primary" onClick={handleConfirmBooking}>
                        Confirm Booking
                    </Button>
                    <Button theme="tertiary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}