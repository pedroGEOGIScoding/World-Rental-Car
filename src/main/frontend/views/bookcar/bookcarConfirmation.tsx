import { ViewConfig } from '@vaadin/hilla-file-router/types.js';

export const config: ViewConfig = {
    menu: { exclude: true },
    title: 'Confirm Booking' };

export default function BookcarConfirmView() {
    return (
        <div>
            <h2>Please confirm your booking</h2>

            {/* Add your confirmation form content here */}
        </div>
    );
}