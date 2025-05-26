import {ViewConfig} from "@vaadin/hilla-file-router/types.js";
import {useLocation, useNavigate, useParams} from "react-router";


export const config: ViewConfig = {
    menu: { exclude: true },
    title: 'Complete Booking'
};

export default function BookingCar() {
    const { idHashBookingCar } = useParams<{ idHashBookingCar: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div>
            <h2>Complete Booking</h2>
            <p>Booking ID: {idHashBookingCar}</p>
            {/* Add your confirmation form content here */}
        </div>
    );
}