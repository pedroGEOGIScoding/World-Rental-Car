import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {useEffect, useState} from "react";
import Car from "Frontend/generated/com/pedro/apps/delegations/Car";
import {useNavigate} from "react-router";
import {DelegationEndpoint} from "Frontend/generated/endpoints";

export const config: ViewConfig = {
    menu: { exclude: true },
    title: 'Confirm Booking' };

export default function BookcarSelectionView() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('BookcarSelectionView: Fetching cars...');
        DelegationEndpoint.getAllCars()
            .then((result) => {
                console.log('BookcarSelectionView: Raw API result:', result);

                // Log detailed information about each car
                if (result && Array.isArray(result)) {
                    console.log('BookcarSelectionView: Number of cars in result:', result.length);
                    result.forEach((car, index) => {
                        console.log(`BookcarSelectionView: Car ${index}:`, {
                            delegationId: car?.delegationId,
                            operation: car?.operation,
                            make: car?.make,
                            model: car?.model,
                            year: car?.year,
                            color: car?.color,
                            price: car?.price,
                            status: car?.status
                        });
                    });
                } else {
                    console.log('BookcarSelectionView: Result is not an array or is null/undefined');
                }

                const safeCars = (result ?? []).filter(
                    (car): car is Car => {
                        const isValid = !!car &&
                            typeof car.delegationId === 'string' &&
                            typeof car.operation === 'string' &&
                            typeof car.make === 'string' &&
                            typeof car.model === 'string' &&
                            typeof car.year === 'string' &&
                            typeof car.color === 'string' &&
                            typeof car.price === 'number';

                        if (!isValid) {
                            console.log('BookcarSelectionView: Filtered out invalid car:', car);
                        }

                        return isValid;
                    }
                );

                console.log('BookcarSelectionView: Filtered cars:', safeCars);
                setCars(safeCars);
            })
            .catch((error) => {
                console.error('BookcarSelectionView: Failed to fetch cars:', error);
                console.error('BookcarSelectionView: Error details:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
                setError(`Sorry, error fetching cars: ${error.message}`);
                setCars([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSelectCar = (car: Car) => {
        // Add logic to select car and proceed with booking
        console.log('Selected car:', car);
        // You might want to store the selected car in localStorage or state management
        // before navigating to the next step
        navigate('/bookcar/bookcarConfirmation');
    };

    return (
        <div className="p-m">
            <h2>List of available cars</h2>
            <h3>Please select the car before confirming booking</h3>

            {loading ? (
                <div>Loading available cars...</div>
            ) : error ? (
                <div className="text-error">{error}</div>
            ) : cars.length === 0 ? (
                <div>No cars available at the moment. Please try again later.</div>
            ) : (
                <div className="grid gap-m">
                    {cars.map((car) => (
                        <div 
                            key={`${car.delegationId}-${car.operation}`}
                            className="card p-m cursor-pointer"
                            onClick={() => handleSelectCar(car)}
                        >
                            <div className="font-bold">{car.make || 'Unknown'} {car.model || 'Model'} ({car.year || 'N/A'})</div>
                            <div>Color: {car.color || 'N/A'}</div>
                            <div>Price: ${car.price !== undefined ? car.price : 'N/A'}/day</div>
                            <div>Status: {car.status ? car.status  : 'Available'}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}