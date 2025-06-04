import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import User from "Frontend/generated/com/pedro/apps/users/User";
import {UserEndpoint} from "Frontend/generated/endpoints";
import {Button, TextField, EmailField, ComboBox, Icon, EmailFieldElement} from "@vaadin/react-components";
import userRole from "Frontend/generated/com/pedro/apps/users/UserRole";
import { useState } from 'react';
import {useSignal} from "@vaadin/hilla-react-signals";

export const config: ViewConfig = {
  menu: { order: 9, icon: 'line-awesome/svg/user-plus-solid.svg' },
  title: 'Create User',
};

// Function to generate a sequential user ID
const generateUserId = () => {
    const timestamp = new Date().getTime();
    return `USER#${timestamp.toString().slice(-6)}`;
};

export default function CreateUserView() {
    // Form state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedRole, setSelectedRole] = useState<userRole | undefined>(undefined);
    const options = [userRole.CUSTOMER, userRole.ADMIN];
    const errorMessage = useSignal('');

    const handleSaveUser = async () => {
        try {
            // Create a user object with the form values inserted by app user
            const user: User = {
                userId: generateUserId(),
                operation: "profile",
                username,
                email,
                fullName,
                phone,
                userRole: selectedRole !== undefined ? selectedRole : userRole.CUSTOMER
            };

            await UserEndpoint.saveUser(user);
            alert('User saved successfully!');

            // Reset form
            setUsername('');
            setEmail('');
            setFullName('');
            setPhone('');
            setSelectedRole(undefined);
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Failed to save user');
        }
    };

    return (
        <div className="flex flex-col h-full items-center justify-center p-l text-center box-border">
            <h2>Create a new customer or an administrator profile</h2>

            <div className="card p-m" style={{ width: '400px' }}>
                <div className="flex flex-col gap-m">

                    <TextField
                        label="Username"
                        value={username} 
                        clearButtonVisible
                        onChange={(e) => setUsername(e.target.value)}
                        required>
                        <Icon slot="prefix" icon="vaadin:user" />
                    </TextField>

                    <EmailField
                        required
                        pattern="^[A-Z0-9+_.-]+@[A-Z0-9.-]+$"
                        label="Email address"
                        helperText="Only example.com addresses allowed"
                        errorMessage={errorMessage.value}
                        onValidated={(event) => {
                            const field = event.target as EmailFieldElement;
                            const { validity } = field.inputElement as HTMLInputElement;
                            if (validity.valueMissing) {
                                errorMessage.value = 'Field is required';
                            } else if (validity.patternMismatch) {
                                errorMessage.value = 'Enter a valid example.com email address';
                            } else {
                                errorMessage.value = '';
                            }
                        }}
                    />

                    <TextField 
                        label="Full Name" 
                        value={fullName}
                        clearButtonVisible={true}
                        onChange={(e) => setFullName(e.target.value)} 
                        required>
                    </TextField>

                    <TextField 
                        label="Phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required>
                    </TextField>

                    <ComboBox
                        allowCustomValue
                        label="User role"
                        helperText="Please, select if you are customer or administrator"
                        items={options}
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as userRole)}
                        clearButtonVisible
                    />

                    <Button onClick={handleSaveUser} theme="primary">
                        Save User
                    </Button>
                </div>
            </div>
            <p>Create a new user or admin account</p>
        </div>
    );
}