import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {useEffect, useState} from "react";
import Car from "Frontend/generated/com/pedro/apps/delegations/Car";
import {useNavigate} from "react-router";
import {DelegationEndpoint} from "Frontend/generated/endpoints";
import {Card, Button} from "@vaadin/react-components";

export const config: ViewConfig = {
	menu: { exclude: true },
	title: 'Confirm Booking' };

export default function BookcarSelectionView() {
	const [cars, setCars] = useState<Car[]>([]);
	const [filteredCars, setFilteredCars] = useState<Car[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [bookingData, setBookingData] = useState<{
		startDate: string;
		endDate: string;
		pickupLocation: string;
		returnLocation: string;
	} | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		// Retrieve booking data from localStorage
		const storedBookingData = localStorage.getItem('bookingData');
		if (storedBookingData) {
			try {
				const parsedData = JSON.parse(storedBookingData);
				setBookingData(parsedData);
				console.log('BookcarSelectionView: Retrieved booking data:', parsedData);
			} catch (e) {
				console.error('BookcarSelectionView: Error parsing booking data:', e);
			}
		} else {
			console.log('BookcarSelectionView: No booking data found in localStorage');
		}

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
							status: car?.status,
							bookingDates: car?.bookingDates
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

	// Filter cars based on booking data
	useEffect(() => {
		if (!cars.length || !bookingData) {
			setFilteredCars(cars);
			return;
		}

		console.log('BookcarSelectionView: Filtering cars based on booking data:', bookingData);

		const filtered = cars.filter(car => {
			// Filter by delegation (based on pickup location)
			if (car.delegationId !== bookingData.pickupLocation) {
				return false;
			}

			// Filter by booking dates
			if (car.bookingDates) {
				const startDate = new Date(bookingData.startDate);
				const endDate = new Date(bookingData.endDate);

				// Generate array of all dates between startDate and endDate (inclusive)
				const dateRange: Date[] = [];
				const currentDate = new Date(startDate);
				while (currentDate <= endDate) {
					dateRange.push(new Date(currentDate));
					currentDate.setDate(currentDate.getDate() + 1);
				}

				// Check if ALL dates in the range are AVAILABLE
				for (const date of dateRange) {
					const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
					const status = car.bookingDates[dateString];
					
					// If date is not in bookingDates or status is not AVAILABLE, filter out this car
					if (!status || status !== "AVAILABLE") {
						return false;
					}
				}
			}

			return true;
		});

		console.log('BookcarSelectionView: Filtered cars result:', filtered);
		setFilteredCars(filtered);
	}, [cars, bookingData]);

	const handleSelectCar = (car: Car) => {
		// Calculate the total price based on the number of days
		let totalPrice = 0;
		if (bookingData) {
			const startDate = new Date(bookingData.startDate);
			const endDate = new Date(bookingData.endDate);
			const dayDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
			totalPrice = car.price * dayDifference;
		}

		// Store the selected car and calculated total in localStorage
		const bookingDetails = {
			car,
			totalPrice,
			...bookingData
		};
		localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
		
		console.log('Selected car with booking details:', bookingDetails);
		navigate('/bookcar/bookcarConfirmation');
	};

	return (
		<div className="p-m">
			<h3>Available cars in {bookingData?.pickupLocation} for rent between {bookingData?.startDate} and {bookingData?.endDate}</h3>
			<h5>Please select the car you like the most before confirming booking</h5>

			{loading ? (
				<div>Loading available cars...</div>
			) : error ? (
				<div className="text-error">{error}</div>
			) : filteredCars.length === 0 ? (
				<div>No cars available at the moment. Please try again later.</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-m">
					{filteredCars.map((car) => (
						<Card
							key={`${car.delegationId}-${car.operation}`}
							className="hover:shadow-xl transition-shadow"
						>
							<div className="p-m">
								<img
										src={`https://cdn.imagin.studio/getimage?customer=img&make=${encodeURIComponent(car.make || '')}&modelFamily=${encodeURIComponent((car.model || '').split(' ')[0])}&zoomType=fullscreen`}
										alt={`${car.make || 'Unknown'} ${car.model || 'Model'}`}
										style={{
											width: '100%',
											height: '120px',
											objectFit: 'cover',
											borderRadius: '8px',
											marginBottom: '1rem'
										}}
										onError={(e) => {
											(e.target as HTMLImageElement).src = 'https://placehold.co/300x180?text=Car+Not+Found';
										}}
								/>
								<h3 className="mb-s font-bold text-xl">{car.make || 'Unknown'} {car.model || 'Model'} ({car.year || 'N/A'})</h3>
								<div className="flex flex-col gap-s">
									<div><strong>Color:</strong> {car.color || 'N/A'}</div>
									<div><strong>Price:</strong>  €{car.price !== undefined ? car.price.toFixed(2) : 'N/A'}/day</div>
									<div className="mt-s">
										<span className="bg-success text-success-contrast px-s py-xs rounded-full text-sm">
											Available
										</span>
									</div>
									
									<div className="mt-m">
										<Button 
											theme="primary" 
											onClick={() => handleSelectCar(car)}
											className="w-full"
										>
											Select this Car to confirm the booking
										</Button>
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}