import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {SetStateAction, useEffect, useState} from "react";
import {UserEndpoint} from "Frontend/generated/endpoints";
import { Grid } from '@vaadin/react-components/Grid.js';
import { GridColumn } from '@vaadin/react-components/GridColumn.js';
import { Notification } from '@vaadin/react-components/Notification.js';
import { Button } from '@vaadin/react-components/Button.js';
import type User from 'Frontend/generated/com/pedro/apps/users/User';
import UserRole from 'Frontend/generated/com/pedro/apps/users/UserRole';
import { Dialog } from '@vaadin/react-components/Dialog.js';
import { TextField } from '@vaadin/react-components/TextField.js';
import { EmailField } from '@vaadin/react-components/EmailField.js';
import { Select } from '@vaadin/react-components/Select.js';
import { FormLayout } from '@vaadin/react-components/FormLayout.js';
import { useNavigate } from 'react-router';

export const config: ViewConfig = {
  menu: {order: 10, icon: 'line-awesome/svg/users-cog-solid.svg'},
  title: 'Users Management',
};

export default function UserManagementView() {
  const navigate = useNavigate();
  // Update the type to match what's coming from the backend
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);

  useEffect(() => {
    // Fetch all users when the component mounts
    fetchUsers();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Using getAllUsersById instead of findAll
      // Note: The operation parameter isn't used in the implementation,
      // it simply returns all users regardless of what's passed
      const response = await UserEndpoint.getAllUsersById('all');
      // Handle potential undefined values and filter them out
      const allUsers = response?.filter((user): user is User => user !== undefined) || [];
      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      Notification.show('Failed to load users. Please try again later.', { 
        position: 'middle',
        duration: 3000,
        theme: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Navigate to create user page
  const handleCreateUser = () => {
    navigate('/management/createuser');
  };
  
  // Open edit dialog and set form values
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setUsername(user.username || '');
    setEmail(user.email || '');
    setFullName(user.fullName || '');
    setPhone(user.phone || '');
    setUserRole(user.userRole);
    setDialogOpen(true);
  };
  
  // Save edited user
  const handleSave = async () => {
    if (!editingUser) return;
    
    try {
      // Create updated user object
      const updatedUser: User = {
        ...editingUser,
        username,
        email,
        fullName,
        phone,
        userRole
      };
      
      // Call the update endpoint
      await UserEndpoint.updateUser(updatedUser);
      
      // Update local state
      setUsers(users.map(user => 
        user.userId === updatedUser.userId ? updatedUser : user
      ));
      
      // Close dialog and show success notification
      setDialogOpen(false);
      Notification.show('User updated successfully', { 
        position: 'bottom-end',
        duration: 3000,
        theme: 'success'
      });
    } catch (error) {
      console.error('Error updating user:', error);
      Notification.show('Failed to update user. Please try again.', { 
        position: 'middle',
        duration: 3000,
        theme: 'error'
      });
    }
  };
  
  // Role options for the select field
  const roleOptions = [
    { label: 'Customer', value: UserRole.CUSTOMER },
    { label: 'Admin', value: UserRole.ADMIN },
    { label: 'Blocked', value: UserRole.BLOCKED }
  ];
  
  // Helper function to convert UserRole to a string for display
  const userRoleToString = (role?: UserRole) => {
    if (!role) return '';
    return role.toString();
  };

  return (
    <div className="flex flex-col h-full box-border">
      <div className="flex justify-between items-center">
        <h2 className="m-m">User Management</h2>
        <Button 
          theme="primary" 
          className="m-m" 
          onClick={handleCreateUser}
        >
          Create User
        </Button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-m flex-grow">
          <span>Loading users...</span>
        </div>
      ) : (
        <div className="flex-grow overflow-auto px-m pb-m">
          <Grid items={users} className="h-full w-full" theme="no-border">
            <GridColumn path="userId" header="User ID" />
            <GridColumn path="username" header="Username" />
            <GridColumn path="email" header="Email" />
            <GridColumn path="fullName" header="Full Name" />
            <GridColumn path="phone" header="Phone" />
            <GridColumn 
              header="Role" 
              renderer={({ item }) => (
                <span>{userRoleToString((item as User).userRole)}</span>
              )}
            />
            <GridColumn 
              header="Actions" 
              width="150px"
              frozen
              textAlign="center"
              renderer={({ item }) => (
                <div className="flex gap-s justify-center">
                  <Button 
                    theme="tertiary small" 
                    onClick={() => handleEdit(item as User)}
                  >
                    Edit
                  </Button>
                </div>
              )}
            />
          </Grid>
        </div>
      )}
      
      {/* Edit User Dialog */}
      <Dialog 
        header={`Edit User: ${editingUser?.username || ''}`}
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
            label="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
          />
          <EmailField 
            label="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
          />
          <TextField 
            label="Full Name" 
            value={fullName} 
            onChange={e => setFullName(e.target.value)}
          />
          <TextField 
            label="Phone" 
            value={phone} 
            onChange={e => setPhone(e.target.value)}
          />
          <Select 
            label="Role" 
            value={userRole}
            items={roleOptions}
            onChange={e => {
              const selectedRole = e.target.value as unknown as UserRole;
              setUserRole(selectedRole);
            }}
          />
        </FormLayout>
      </Dialog>
    </div>
  );
}