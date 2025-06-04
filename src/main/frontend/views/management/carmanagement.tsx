import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useEffect, useState } from 'react';
import { DelegationEndpoint } from 'Frontend/generated/endpoints';
import { Grid } from '@vaadin/react-components/Grid.js';
import { GridColumn } from '@vaadin/react-components/GridColumn.js';
import { Notification } from '@vaadin/react-components/Notification.js';
import { Button } from '@vaadin/react-components/Button.js';
import { Dialog } from '@vaadin/react-components/Dialog.js';
import { TextField } from '@vaadin/react-components/TextField.js';
import { NumberField } from '@vaadin/react-components/NumberField.js';
import { Select } from '@vaadin/react-components/Select.js';
import { FormLayout } from '@vaadin/react-components/FormLayout.js';
import type Car from 'Frontend/generated/com/pedro/apps/delegations/Car';
import CarStatus from 'Frontend/generated/com/pedro/apps/delegations/CarStatus';
import { useNavigate } from 'react-router';

export const config: ViewConfig = {
  menu: { order: 7, icon: 'line-awesome/svg/car-side-solid.svg' },
  title: 'Car Management',
};

export default function CarManagementView() {
  const navigate = useNavigate();
  // State for cars data
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  
  // Form state
  const [delegationId, setDelegationId] = useState('');
  const [operation, setOperation] = useState('');
  const [carId, setCarId] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState(0);
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [carStatus, setCarStatus] = useState<CarStatus | undefined>(undefined);

  useEffect(() => {
    // Fetch all cars when the component mounts
    fetchCars();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Fetch all cars
  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await DelegationEndpoint.getAllCars();
      // Handle potential undefined values and filter them out
      const allCars = response?.filter((car): car is Car => car !== undefined) || [];
      setCars(allCars);
    } catch (error) {
      console.error('Error fetching cars:', error);
      Notification.show('Failed to load cars. Please try again later.', { 
        position: 'middle',
        duration: 3000,
        theme: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Open edit dialog and set form values
  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setDelegationId(car.delegationId || '');
    setOperation(car.operation || '');
    setCarId(car.carId || '');
    setMake(car.make || '');
    setModel(car.model || '');
    setYear(car.year || '');
    setColor(car.color || '');
    setPrice(car.price || 0);
    setLat(car.lat || 0);
    setLon(car.lon || 0);
    setCarStatus(car.carStatus);
    setDialogOpen(true);
  };
  
  // Save edited car
  const handleSave = async () => {
    if (!editingCar) return;
    
    try {
      // Create updated car object
      const updatedCar: Car = {
        ...editingCar,
        delegationId,
        operation,
        carId,
        make,
        model,
        year,
        color,
        price,
        lat,
        lon,
        carStatus
      };
      
      // Call the update endpoint
      await DelegationEndpoint.saveCar(updatedCar);
      
      // Update local state
      setCars(cars.map(car => 
        (car.delegationId === updatedCar.delegationId && car.operation === updatedCar.operation) 
          ? updatedCar 
          : car
      ));
      
      // Close dialog and show success notification
      setDialogOpen(false);
      Notification.show('Car updated successfully', { 
        position: 'bottom-end',
        duration: 3000,
        theme: 'success'
      });
    } catch (error) {
      console.error('Error updating car:', error);
      Notification.show('Failed to update car. Please try again.', { 
        position: 'middle',
        duration: 3000,
        theme: 'error'
      });
    }
  };
  
  // Status options for the select field
  const statusOptions = [
    { label: 'Available', value: CarStatus.AVAILABLE },
    { label: 'Rented', value: CarStatus.RENTED },
    { label: 'Maintenance', value: CarStatus.MAINTENANCE },
    { label: 'Out of Order', value: CarStatus.OUT_OF_ORDER }
  ];

  return (
    <div className="flex flex-col h-full box-border">
      <div className="flex justify-between items-center">
        <h2 className="m-m">Car Management</h2>
        <Button 
          theme="primary" 
          className="m-m" 
          onClick={() => navigate('/management/createcar')}
        >
          Create Car
        </Button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-m flex-grow">
          <span>Loading cars...</span>
        </div>
      ) : (
        <div className="flex-grow overflow-auto px-m pb-m">
          <Grid items={cars} className="h-full w-full" theme="no-border">
            <GridColumn path="carId" header="Car ID" />
            <GridColumn path="make" header="Make" />
            <GridColumn path="model" header="Model" />
            <GridColumn path="year" header="Year" />
            <GridColumn path="color" header="Color" />
            <GridColumn path="price" header="Price" />
            <GridColumn 
              header="Status" 
              renderer={({ item }) => (
                <span>{(item as Car).carStatus?.toString() || 'Unknown'}</span>
              )}
            />
            <GridColumn path="delegationId" header="Delegation ID" />
            <GridColumn 
              header="Actions" 
              width="150px"
              frozen
              textAlign="center"
              renderer={({ item }) => (
                <div className="flex gap-s justify-center">
                  <Button 
                    theme="tertiary small" 
                    onClick={() => handleEdit(item as Car)}
                  >
                    Edit
                  </Button>
                </div>
              )}
            />
          </Grid>
        </div>
      )}
      
      {/* Edit Car Dialog */}
      <Dialog 
        header={`Edit Car: ${editingCar?.make || ''} ${editingCar?.model || ''}`}
        opened={dialogOpen} 
        onOpenedChanged={({ detail }) => setDialogOpen(detail.value)}
        footerRenderer={() => (
          <div className="flex gap-m justify-end">
            <Button theme="tertiary" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button theme="primary" onClick={handleSave}>Save</Button>
          </div>
        )}
      >
        <FormLayout>
          <TextField 
            label="Delegation ID" 
            value={delegationId} 
            onChange={e => setDelegationId(e.target.value)}
            readonly
          />
          <TextField 
            label="Operation" 
            value={operation} 
            onChange={e => setOperation(e.target.value)}
            readonly
          />
          <TextField 
            label="Car ID" 
            value={carId} 
            onChange={e => setCarId(e.target.value)}
            readonly
          />
          <TextField 
            label="Make" 
            value={make} 
            onChange={e => setMake(e.target.value)}
          />
          <TextField 
            label="Model" 
            value={model} 
            onChange={e => setModel(e.target.value)}
          />
          <TextField 
            label="Year" 
            value={year} 
            onChange={e => setYear(e.target.value)}
          />
          <TextField 
            label="Color" 
            value={color} 
            onChange={e => setColor(e.target.value)}
          />
          <NumberField 
            label="Price" 
            value={price.toString()} 
            onChange={e => setPrice(parseInt(e.target.value || '0'))}
          />
          <NumberField 
            label="Latitude" 
            value={lat.toString()} 
            onChange={e => setLat(parseFloat(e.target.value || '0'))}
            step={0.000001}
          />
          <NumberField 
            label="Longitude" 
            value={lon.toString()} 
            onChange={e => setLon(parseFloat(e.target.value || '0'))}
            step={0.000001}
          />
          <Select 
            label="Status" 
            value={carStatus}
            items={statusOptions}
            onChange={e => {
              const selectedStatus = e.target.value as unknown as CarStatus;
              setCarStatus(selectedStatus);
            }}
          />
        </FormLayout>
      </Dialog>
    </div>
  );
}