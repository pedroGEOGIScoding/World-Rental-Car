import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import Delegation from "Frontend/generated/com/pedro/apps/delegations/Delegation";
import { DelegationEndpoint } from "Frontend/generated/endpoints";
import { Button, TextField, EmailField, EmailFieldElement, NumberField, Icon } from "@vaadin/react-components";
import { useState } from 'react';
import { useSignal } from "@vaadin/hilla-react-signals";

export const config: ViewConfig = {
  menu: { order: 9, icon: 'line-awesome/svg/warehouse-solid.svg' },
  title: 'Create Delegation',
};

// Function to generate a sequential delegation ID
const generateDelegationId = () => {
    const timestamp = new Date().getTime();
    return `DELEG#${timestamp.toString().slice(-6)}`;
};

export default function CreateDelegationView() {
    // Form state
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [latDelegation, setLatDelegation] = useState(0);
    const [lonDelegation, setLonDelegation] = useState(0);
    const [availableCarQty, setAvailableCarQty] = useState(0);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const emailErrorMessage = useSignal('');

    const handleSaveDelegation = async () => {
        try {
            // Create a delegation object with the form values
            const delegation: Delegation = {
                delegationId: generateDelegationId(),
                operation: "profile",
                name,
                address,
                city,
                latDelegation,
                lonDelegation,
                availableCarQty,
                phone,
                email
            };

            await DelegationEndpoint.saveDelegation(delegation);
            alert('Delegation saved successfully!');

            // Reset form
            setName('');
            setAddress('');
            setCity('');
            setLatDelegation(0);
            setLonDelegation(0);
            setAvailableCarQty(0);
            setPhone('');
            setEmail('');
        } catch (error) {
            console.error('Error saving delegation:', error);
            alert('Failed to save delegation');
        }
    };

    return (
        <div className="flex flex-col h-full items-center justify-center p-l text-center box-border">
            <h2>Create a new delegation</h2>

            <div className="card p-m" style={{ width: '400px' }}>
                <div className="flex flex-col gap-m">
                    <TextField
                        label="Name"
                        value={name} 
                        clearButtonVisible
                        onChange={(e) => setName(e.target.value)}
                        required>
                        <Icon slot="prefix" icon="vaadin:building" />
                    </TextField>

                    <TextField
                        label="Address"
                        value={address} 
                        clearButtonVisible
                        onChange={(e) => setAddress(e.target.value)}
                        required>
                        <Icon slot="prefix" icon="vaadin:map-marker" />
                    </TextField>

                    <TextField 
                        label="City" 
                        value={city}
                        clearButtonVisible={true}
                        onChange={(e) => setCity(e.target.value)} 
                        required>
                        <Icon slot="prefix" icon="vaadin:city" />
                    </TextField>

                    <NumberField 
                        label="Latitude" 
                        value={latDelegation.toString()} 
                        onChange={(e) => setLatDelegation(parseFloat(e.target.value || '0'))}
                        step={0.000001}
                        required>
                    </NumberField>

                    <NumberField 
                        label="Longitude" 
                        value={lonDelegation.toString()} 
                        onChange={(e) => setLonDelegation(parseFloat(e.target.value || '0'))}
                        step={0.000001}
                        required>
                    </NumberField>

                    <NumberField 
                        label="Available Car Quantity" 
                        value={availableCarQty.toString()} 
                        onChange={(e) => setAvailableCarQty(parseInt(e.target.value || '0'))}
                        min={0}
                        required>
                    </NumberField>

                    <TextField 
                        label="Phone Number" 
                        value={phone}
                        clearButtonVisible={true}
                        onChange={(e) => setPhone(e.target.value)} 
                        required>
                        <Icon slot="prefix" icon="vaadin:phone" />
                    </TextField>

                    <EmailField
                        required
                        label="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        errorMessage={emailErrorMessage.value}
                        onValidated={(event) => {
                            const field = event.target as EmailFieldElement;
                            const { validity } = field.inputElement as HTMLInputElement;
                            if (validity.valueMissing) {
                                emailErrorMessage.value = 'Email is required';
                            } else if (validity.typeMismatch) {
                                emailErrorMessage.value = 'Enter a valid email address';
                            } else {
                                emailErrorMessage.value = '';
                            }
                        }}
                    >
                        <Icon slot="prefix" icon="vaadin:envelope" />
                    </EmailField>

                    <Button 
                        theme="primary" 
                        onClick={handleSaveDelegation}
                    >
                        Save Delegation
                    </Button>
                </div>
            </div>
        </div>
    );
}
