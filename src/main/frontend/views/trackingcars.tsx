import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useEffect, useState, useRef } from "react";
import Car from "Frontend/generated/com/pedro/apps/delegations/Car";
import { useNavigate } from "react-router";
import { DelegationEndpoint } from "Frontend/generated/endpoints";
import 'leaflet/dist/leaflet.css';

export const config: ViewConfig = {
  menu: { order: 11, icon: 'line-awesome/svg/map-marked-alt-solid.svg' },
  title: 'Tracking Cars',
};

export default function TrackingCarsView() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const navigate = useNavigate();

    // Fetch cars data
    useEffect(() => {
        DelegationEndpoint.getAllCars()
            .then((result) => {
                const safeCars = (result ?? []).filter(
                    (car): car is Car =>
                        !!car &&
                        typeof car.delegationId === 'string' &&
                        typeof car.operation === 'string'
                );
                console.log('Loaded cars:', safeCars);
                setCars(safeCars);
            })
            .catch((error) => {
                console.error('Failed to fetch cars:', error);
                setCars([]);
            })
            .finally(() => setLoading(false));
    }, []);

    // Initialize map once cars are loaded
    useEffect(() => {
        if (loading || !mapRef.current) return;
        
        // If map is already initialized, clean it up
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        // Dynamic import of Leaflet to avoid SSR issues
        import('leaflet').then((L) => {
            // Create a map instance
            const map = L.map(mapRef.current!).setView([40, 0], 3); // Default center and zoom
            mapInstanceRef.current = map;
            
            // Add tile layer (map background)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Add markers for cars with valid coordinates
            const validCars = cars.filter(car => car && typeof car.lat === 'number' && typeof car.lon === 'number');
            
            if (validCars.length > 0) {
                // Create bounds to fit all markers
                const bounds = L.latLngBounds([]);
                
                validCars.forEach(car => {
                    // Create marker for each car
                    const marker = L.marker([car.lat, car.lon])
                        .addTo(map)
                        .bindPopup(`
                            <b>ID:</b> ${car.delegationId}<br>
                            <b>Make:</b> ${car.make || 'N/A'}<br>
                            <b>Model:</b> ${car.model || 'N/A'}<br>
                            <b>Year:</b> ${car.year || 'N/A'}<br>
                            <b>Operation:</b> ${car.operation}<br>
                            <b>Location:</b> ${car.lat}, ${car.lon}
                        `);
                    
                    // Extend bounds to include this marker
                    bounds.extend([car.lat, car.lon]);
                });
                
                // Fit the map to show all markers with some padding
                if (bounds.isValid()) {
                    map.fitBounds(bounds, {
                        padding: [50, 50]
                    });
                }
            }
        });
        
        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [cars, loading]);

    // Handle window resize for map
    useEffect(() => {
        const handleResize = () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return (
        <div className="flex flex-col h-full p-m">
            <h2 className="mb-m">Car Location Tracking</h2>
            
            <div className="flex-grow" style={{ position: 'relative', minHeight: '500px' }}>
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div>Loading car locations...</div>
                    </div>
                ) : (
                    <div 
                        ref={mapRef} 
                        className="w-full h-full" 
                        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
                    ></div>
                )}
            </div>
        </div>
    );
}