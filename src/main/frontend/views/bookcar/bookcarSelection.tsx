import { ViewConfig } from '@vaadin/hilla-file-router/types.js';

export const config: ViewConfig = {
    menu: { exclude: true },
    title: 'Confirm Booking' };

export default function BookcarConfirmView() {
    return (
        <div>
            <h2>List of available cars</h2>
            <h3>Please select the car before confirming booking</h3>
            {/* Add your confirmation form content here */}
        </div>
    );
}