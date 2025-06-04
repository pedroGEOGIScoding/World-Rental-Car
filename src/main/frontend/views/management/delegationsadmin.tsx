import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useEffect, useState, useRef } from 'react';
import { DelegationEndpoint } from 'Frontend/generated/endpoints';
import { Grid } from '@vaadin/react-components/Grid.js';
import { GridColumn } from '@vaadin/react-components/GridColumn.js';
import { Notification } from '@vaadin/react-components/Notification.js';
import { Button } from '@vaadin/react-components/Button.js';
import { Dialog } from '@vaadin/react-components/Dialog.js';
import { TextField } from '@vaadin/react-components/TextField.js';
import { EmailField } from '@vaadin/react-components/EmailField.js';
import { NumberField } from '@vaadin/react-components/NumberField.js';
import { FormLayout } from '@vaadin/react-components/FormLayout.js';
import type Delegation from 'Frontend/generated/com/pedro/apps/delegations/Delegation';
import { useNavigate } from 'react-router';
import 'leaflet/dist/leaflet.css';

export const config: ViewConfig = {
  menu: { order: 8, icon: 'line-awesome/svg/warehouse-solid.svg' },
  title: 'Delegations Admin',
};

export default function DelegationsAdminView() {
  const navigate = useNavigate();
  // State for delegations data
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDelegation, setEditingDelegation] = useState<Delegation | null>(null);
  
  // Form state
  const [delegationId, setDelegationId] = useState('');
  const [operation, setOperation] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [latDelegation, setLatDelegation] = useState(0);
  const [lonDelegation, setLonDelegation] = useState(0);
  const [availableCarQty, setAvailableCarQty] = useState(0);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Map references
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedDelegation, setSelectedDelegation] = useState<Delegation | null>(null);

  useEffect(() => {
    // Fetch all delegations when the component mounts
    fetchDelegations();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Fetch all delegations
  const fetchDelegations = async () => {
    try {
      setLoading(true);
      const response = await DelegationEndpoint.getAllProfileDelegations();
      // Handle potential undefined values and filter them out
      const allDelegations = response?.filter((delegation): delegation is Delegation => delegation !== undefined) || [];
      setDelegations(allDelegations);
    } catch (error) {
      console.error('Error fetching delegations:', error);
      Notification.show('Failed to load delegations. Please try again later.', { 
        position: 'middle',
        duration: 3000,
        theme: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Open edit dialog and set form values
  const handleEdit = (delegation: Delegation) => {
    setEditingDelegation(delegation);
    setDelegationId(delegation.delegationId || '');
    setOperation(delegation.operation || '');
    setName(delegation.name || '');
    setAddress(delegation.address || '');
    setCity(delegation.city || '');
    setLatDelegation(delegation.latDelegation || 0);
    setLonDelegation(delegation.lonDelegation || 0);
    setAvailableCarQty(delegation.availableCarQty || 0);
    setPhone(delegation.phone || '');
    setEmail(delegation.email || '');
    setDialogOpen(true);
  };
  
  // Save edited delegation
  const handleSave = async () => {
    if (!editingDelegation) return;
    
    try {
      // Create updated delegation object
      const updatedDelegation: Delegation = {
        ...editingDelegation,
        delegationId,
        operation,
        name,
        address,
        city,
        latDelegation,
        lonDelegation,
        availableCarQty,
        phone,
        email
      };
      
      // Call the save endpoint
      await DelegationEndpoint.saveDelegation(updatedDelegation);
      
      // Update local state
      setDelegations(delegations.map(delegation => 
        (delegation.delegationId === updatedDelegation.delegationId && delegation.operation === updatedDelegation.operation) 
          ? updatedDelegation 
          : delegation
      ));
      
      // Close dialog and show success notification
      setDialogOpen(false);
      Notification.show('Delegation updated successfully', { 
        position: 'bottom-end',
        duration: 3000,
        theme: 'success'
      });
    } catch (error) {
      console.error('Error updating delegation:', error);
      Notification.show('Failed to update delegation. Please try again.', { 
        position: 'middle',
        duration: 3000,
        theme: 'error'
      });
    }
  };

  // Initialize map when delegations are loaded
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
      const map = L.map(mapRef.current!).setView([40, 0], 2); // Default center and zoom
      mapInstanceRef.current = map;
      
      // Add tile layer (map background)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add markers for delegations with valid coordinates
      const validDelegations = delegations.filter(
        del => del && typeof del.latDelegation === 'number' && typeof del.lonDelegation === 'number'
      );
      
      if (validDelegations.length > 0) {
        // Create bounds to fit all markers
        const bounds = L.latLngBounds([]);
        
        validDelegations.forEach(delegation => {
          // Create marker for each delegation
          const marker = L.marker([delegation.latDelegation, delegation.lonDelegation])
            .addTo(map)
            .bindPopup(`
              <b>ID:</b> ${delegation.delegationId}<br>
              <b>Name:</b> ${delegation.name || 'N/A'}<br>
              <b>Address:</b> ${delegation.address || 'N/A'}<br>
              <b>City:</b> ${delegation.city || 'N/A'}<br>
              <b>Phone:</b> ${delegation.phone || 'N/A'}<br>
              <b>Available Cars:</b> ${delegation.availableCarQty || 0}
            `);
          
          // Extend bounds to include this marker
          bounds.extend([delegation.latDelegation, delegation.lonDelegation]);

          // Add click event to highlight the selected delegation
          marker.on('click', () => {
            setSelectedDelegation(delegation);
          });
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
  }, [delegations, loading]);

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
    <div className="flex flex-col h-full box-border">
      <div className="flex justify-between items-center">
        <h2 className="m-m">Delegations Management</h2>
        <Button 
          theme="primary" 
          className="m-m" 
          onClick={() => navigate('/management/createdelegation')}
        >
          Create Delegation
        </Button>
      </div>
      
      <div className="flex flex-col h-full">
        {loading ? (
          <div className="flex items-center justify-center p-m flex-grow">
            <span>Loading delegations...</span>
          </div>
        ) : (
          <>
            {/* Upper half with Grid */}
            <div className="overflow-auto px-m pb-m" style={{ height: '50%' }}>
              <Grid items={delegations} className="h-full w-full" theme="no-border">
                <GridColumn path="delegationId" header="Delegation ID" />
                <GridColumn path="name" header="Name" />
                <GridColumn path="address" header="Address" />
                <GridColumn path="city" header="City" />
                <GridColumn path="phone" header="Phone" />
                <GridColumn path="email" header="Email" />
                <GridColumn path="availableCarQty" header="Available Cars" />
                <GridColumn 
                  header="Actions" 
                  width="150px"
                  frozen
                  textAlign="center"
                  renderer={({ item }) => (
                    <div className="flex gap-s justify-center">
                      <Button 
                        theme="tertiary small" 
                        onClick={() => handleEdit(item as Delegation)}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                />
              </Grid>
            </div>
            
            {/* Lower half with Map */}
            <div className="px-m pb-m" style={{ height: '50%', minHeight: '400px', position: 'relative' }}>
              <h3 className="mb-s">Delegation Locations</h3>
              <div 
                ref={mapRef} 
                className="w-full h-full" 
                style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', top: '40px' }}
              ></div>
            </div>
          </>
        )}
      </div>
      
      {/* Edit Delegation Dialog */}
      <Dialog 
        header={`Edit Delegation: ${editingDelegation?.name || ''}`}
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
            label="Name" 
            value={name} 
            onChange={e => setName(e.target.value)}
          />
          <TextField 
            label="Address" 
            value={address} 
            onChange={e => setAddress(e.target.value)}
          />
          <TextField 
            label="City" 
            value={city} 
            onChange={e => setCity(e.target.value)}
          />
          <NumberField 
            label="Latitude" 
            value={latDelegation.toString()} 
            onChange={e => setLatDelegation(parseFloat(e.target.value || '0'))}
            step={0.000001}
          />
          <NumberField 
            label="Longitude" 
            value={lonDelegation.toString()} 
            onChange={e => setLonDelegation(parseFloat(e.target.value || '0'))}
            step={0.000001}
          />
          <NumberField 
            label="Available Car Quantity" 
            value={availableCarQty.toString()} 
            onChange={e => setAvailableCarQty(parseInt(e.target.value || '0'))}
          />
          <TextField 
            label="Phone" 
            value={phone} 
            onChange={e => setPhone(e.target.value)}
          />
          <EmailField 
            label="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
          />
        </FormLayout>
      </Dialog>
    </div>
  );
}