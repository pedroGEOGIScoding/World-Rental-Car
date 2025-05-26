import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {useEffect, useState} from "react";
import Car from "Frontend/generated/com/pedro/apps/delegations/Car";
import {useNavigate} from "react-router";
import {DelegationEndpoint} from "Frontend/generated/endpoints";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export const config: ViewConfig = {
  menu: { order: 11, icon: 'line-awesome/svg/map-marked-alt-solid.svg' },
  title: 'Tracking Cars',
};

export default function TrackingCarsView() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        DelegationEndpoint.getAllCars()
            .then((result) => {
                const safeCars = (result ?? []).filter(
                    (car): car is Car =>
                        !!car &&
                        typeof car.delegationId === 'string' &&
                        typeof car.operation === 'string'
                );
                setCars(safeCars);
            })
            .catch((error) => {
                console.error('Failed to fetch cars:', error);
                setCars([]);
            })
            .finally(() => setLoading(false));
    }, []);
    
  return (
    <div className="flex flex-col h-full items-center justify-center p-l text-center box-border w-full">
      <h2>Car Tracking Map</h2>
      <div style={{ height: '500px', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        <MapContainer center={[51.505, -0.09]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          {cars.map((car, idx) =>
            typeof car.lon === 'number' ? (
              <Marker
                key={car.delegationId || idx}
                position={[car.lat, car.lon]}
                icon={L.icon({
                  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                  shadowSize: [41, 41],
                })}
              >
                <Popup>
                  <div>
                    <b>ID:</b> {car.delegationId}<br />
                    <b>Operation:</b> {car.operation}<br />
                    <b>Lat:</b> {car.lat}<br />
                    <b>Lon:</b> {car.lon}
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>
    </div>
  );
}