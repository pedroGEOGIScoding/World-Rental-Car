import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import Car from "Frontend/generated/com/pedro/apps/delegations/Car";
import { DelegationEndpoint } from "Frontend/generated/endpoints";
import { Button, TextField, NumberField, ComboBox, Icon } from "@vaadin/react-components";
import CarStatus from "Frontend/generated/com/pedro/apps/delegations/CarStatus";
import { useState } from 'react';
import { useSignal } from "@vaadin/hilla-react-signals";

export const config: ViewConfig = {
  menu: { order: 8, icon: 'line-awesome/svg/car-solid.svg' },
  title: 'Create Car',
};

// Function to generate a sequential car ID
const generateCarId = () => {
    const timestamp = new Date().getTime();
    return `CAR#${timestamp.toString().slice(-6)}`;
};

export default function CreateCarView() {
    // Form state
    const [delegationId, setDelegationId] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [color, setColor] = useState('');
    const [price, setPrice] = useState(0);
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState<CarStatus | undefined>(CarStatus.AVAILABLE);
    const statusOptions = [
        { label: 'Available', value: CarStatus.AVAILABLE },
        { label: 'Rented', value: CarStatus.RENTED },
        { label: 'Maintenance', value: CarStatus.MAINTENANCE },
        { label: 'Out of Order', value: CarStatus.OUT_OF_ORDER }
    ];
    const errorMessage = useSignal('');

    const handleSaveCar = async () => {
        try {
            if (!delegationId) {
                alert('Delegation ID is required');
                return;
            }

            // Create a car object with the form values
            const car: Car = {
                delegationId: delegationId,
                operation: "car",
                carId: generateCarId(),
                make,
                model,
                year,
                color,
                price,
                lat,
                lon,
                carStatus: selectedStatus !== undefined ? selectedStatus : CarStatus.AVAILABLE,
                bookingDates: {}
            };

            await DelegationEndpoint.saveCar(car);
            alert('Car saved successfully!');

            // Reset form
            setMake('');
            setModel('');
            setYear('');
            setColor('');
            setPrice(0);
            setLat(0);
            setLon(0);
            setSelectedStatus(CarStatus.AVAILABLE);
        } catch (error) {
            console.error('Error saving car:', error);
            alert('Failed to save car');
        }
    };

    return (
        <div className="flex flex-col h-full items-center justify-center p-l text-center box-border">
            <h2>Create a new car</h2>

            <div className="card p-m" style={{ width: '400px' }}>
                <div className="flex flex-col gap-m">
                    <TextField
                        label="Delegation ID"
                        value={delegationId} 
                        clearButtonVisible
                        onChange={(e) => setDelegationId(e.target.value)}
                        required>
                        <Icon slot="prefix" icon="vaadin:building" />
                    </TextField>

                    <TextField
                        label="Make"
                        value={make} 
                        clearButtonVisible
                        onChange={(e) => setMake(e.target.value)}
                        required>
                        <Icon slot="prefix" icon="vaadin:car" />
                    </TextField>

                    <TextField 
                        label="Model" 
                        value={model}
                        clearButtonVisible={true}
                        onChange={(e) => setModel(e.target.value)} 
                        required>
                    </TextField>

                    <TextField 
                        label="Year" 
                        value={year}
                        clearButtonVisible={true}
                        onChange={(e) => setYear(e.target.value)} 
                        required>
                    </TextField>

                    <TextField 
                        label="Color" 
                        value={color}
                        clearButtonVisible={true}
                        onChange={(e) => setColor(e.target.value)} 
                        required>
                    </TextField>

                    <NumberField 
                        label="Price" 
                        value={price.toString()} 
                        onChange={(e) => setPrice(parseInt(e.target.value || '0'))}
                        min={0}
                        required>
                    </NumberField>

                    <NumberField 
                        label="Latitude" 
                        value={lat.toString()} 
                        onChange={(e) => setLat(parseFloat(e.target.value || '0'))}
                        step={0.000001}
                        required>
                    </NumberField>

                    <NumberField 
                        label="Longitude" 
                        value={lon.toString()} 
                        onChange={(e) => setLon(parseFloat(e.target.value || '0'))}
                        step={0.000001}
                        required>
                    </NumberField>

                    <ComboBox 
                        label="Status" 
                        items={statusOptions}
                        itemLabelPath="label"
                        itemValuePath="value"
                        value={selectedStatus}
                        onChange={(e) => {
                            const value = e.target.value as any;
                            setSelectedStatus(value);
                        }}
                    />

                    <Button 
                        theme="primary" 
                        onClick={handleSaveCar}
                    >
                        Save Car
                    </Button>
                </div>
            </div>
        </div>
    );
}
