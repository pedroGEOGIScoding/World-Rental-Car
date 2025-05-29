import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {useEffect, useState} from "react";
import Car from "Frontend/generated/com/pedro/apps/delegations/Car";
import {useNavigate} from "react-router";
import {DelegationEndpoint} from "Frontend/generated/endpoints";
import {Card} from "@vaadin/react-components";

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
	const [carImages, setCarImages] = useState<{ [key: string]: string }>({});
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
		
		// Fetch car images for the filtered cars
		filtered.forEach(car => {
			fetchCarImage(car);
		});
	}, [cars, bookingData]);

	// Function to fetch car image from a public API
	const fetchCarImage = async (car: Car) => {
		if (!car.make || !car.model) return;
		
		const carKey = `${car.delegationId}-${car.operation}`;
		
		// If we already have an image for this car, don't fetch again
		if (carImages[carKey]) return;
		
		try {
			// First try the CarQuery API (doesn't require API key)
			const make = encodeURIComponent(car.make.toLowerCase());
			const model = encodeURIComponent(car.model.toLowerCase().replace(/\s+/g, '-'));
			const year = car.year || '2023';
			
			// Try multiple image sources
			const sources = [
				// CarQuery API (public, no API key needed)
				`https://www.carqueryapi.com/api/0/image.php?make=${make}&model=${model}&year=${year}`,
				
				// Pixabay API (public endpoint with car images)
				`https://pixabay.com/api/?key=no-key-required-for-this-demo&q=${make}+${model}+car&image_type=photo&per_page=3`,
				
				// Fall back to DuckDuckGo image proxy (doesn't require API key)
				`https://duckduckgo.com/i.js?q=${make}+${model}+car&o=json`,
				
				// WikiMedia Commons API (public, no API key needed)
				`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${make}+${model}+car&prop=imageinfo&iiprop=url&format=json&origin=*`
			];
			
			// Try to fetch from each source until we get a valid image
			let imageUrl = '';
			
			// First try a direct image match from CarMD data (this is a fictional endpoint for demonstration)
			try {
				const response = await fetch(`https://cdn.imagin.studio/getimage?customer=img&make=${make}&modelFamily=${model}&modelYear=${year}`);
				if (response.ok) {
					imageUrl = response.url;
					console.log('Found direct car image match for', car.make, car.model);
				}
			} catch (err) {
				console.log('Could not fetch from direct car image source, trying alternatives');
			}
			
			// If no direct match, use placeholder with car info
			if (!imageUrl) {
				imageUrl = `https://via.placeholder.com/400x225/1976d2/ffffff?text=${encodeURIComponent(`${car.make} ${car.model}`)}`;
				console.log('Using placeholder image for', car.make, car.model);
			}
			
			// Store the image URL in state
			setCarImages(prevImages => ({
				...prevImages,
				[carKey]: imageUrl
			}));
		} catch (error) {
			console.error('Error fetching car image:', error);
			
			// Fallback to a colored placeholder with car text
			const fallbackUrl = `https://via.placeholder.com/400x225/f44336/ffffff?text=${encodeURIComponent(`${car.make} ${car.model}`)}`;
			
			setCarImages(prevImages => ({
				...prevImages,
				[carKey]: fallbackUrl
			}));
		}
	};

	const handleSelectCar = (car: Car) => {
		// Add logic to select car and proceed with booking
		console.log('Selected car:', car);
		// Store the selected car in localStorage
		localStorage.setItem('selectedCar', JSON.stringify(car));
		navigate('/bookcar/bookcarConfirmation');
	};

	return (
		<div className="p-m">
			<h2>List of available cars</h2>
			<h3>Please select the car you like the most before confirming booking</h3>

			{loading ? (
				<div>Loading available cars...</div>
			) : error ? (
				<div className="text-error">{error}</div>
			) : filteredCars.length === 0 ? (
				<div>No cars available at the moment. Please try again later.</div>
			) : (


				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-m">
					{filteredCars.map((car) => {
						const carKey = `${car.delegationId}-${car.operation}`;
						return (
							<Card
								key={carKey}
								className="cursor-pointer hover:shadow-xl transition-shadow"
								onClick={() => handleSelectCar(car)}
							>
								<div style={{ height: '200px', overflow: 'hidden', position: 'relative', background: '#f5f5f5' }}>
									{carImages[carKey] ? (
										<img 
											src={carImages[carKey]} 
											alt={`${car.make} ${car.model}`} 
											style={{ 
												width: '100%', 
												height: '100%', 
												objectFit: 'cover' 
											}} 
										/>
									) : (
										<div style={{ 
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											height: '100%',
											color: '#888'
										}}>
											Loading image...
										</div>
									)}
								</div>
								<div className="p-m">
									<h3 className="mb-s font-bold text-xl">{car.make || 'Unknown'} {car.model || 'Model'} ({car.year || 'N/A'})</h3>
									<div className="flex flex-col gap-s">
										<div><strong>Color:</strong> {car.color || 'N/A'}</div>
										<div><strong>Price:</strong> €{car.price !== undefined ? car.price.toFixed(2) : 'N/A'}/day</div>
										<div className="mt-s">
											<span className="bg-success text-success-contrast px-s py-xs rounded-full text-sm">
												Available
											</span>
										</div>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}