import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {SetStateAction, useEffect, useState} from "react";
import {UserEndpoint} from "Frontend/generated/endpoints";
import { Grid } from '@vaadin/react-components/Grid.js';
import { GridColumn } from '@vaadin/react-components/GridColumn.js';
import { Button } from '@vaadin/react-components/Button.js';
import { Notification } from '@vaadin/react-components/Notification.js';
import User from 'Frontend/generated/com/pedro/apps/users/User';
import UserRole from 'Frontend/generated/com/pedro/apps/users/UserRole';
import { Dialog } from '@vaadin/react-components/Dialog.js';
import { TextField } from '@vaadin/react-components/TextField.js';
import { EmailField } from '@vaadin/react-components/EmailField.js';
import { Select, SelectItem } from '@vaadin/react-components/Select.js';
import { ConfirmDialog } from '@vaadin/react-components/ConfirmDialog.js';
import { FormLayout } from '@vaadin/react-components/FormLayout.js';

export const config: ViewConfig = {
  menu: {order: 10, icon: 'line-awesome/svg/users-cog-solid.svg'},
  title: 'User Management',
};

export default function UserManagementView() {

  // Use the generated User type directly from the backend
  const [users, setUsers] = useState<User[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for user editing
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  
  // State for blocking confirmation
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState<User | null>(null);
  
  // Convert UserRole enum to SelectItem[] for the role dropdown
  const roleItems: SelectItem[] = Object.keys(UserRole).map(key => ({
    label: key,
    value: key
  }));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // The generated endpoint client expects a userId parameter (which is actually used as operation in the backend)
        const allUsers = await UserEndpoint.getAllUsersById("");
        console.log('Fetched users:', allUsers);
        
        /* Handle the case where allUsers might be undefined or contain undefined elements. TypeScript type returned by the getAllUsersById endpoint method is Promise<Array<User | undefined> | undefined>. This means: The entire array might be undefined, and that individual elements in the array might be undefined. However, the React state was typed as User[], which doesn't allow undefined values. This type mismatch was causing TypeScript errors. The solution used is a type guard in the form of a filter function:*/
        if (allUsers) {
          // Filter out any undefined values in the array before setting the state
          const validUsers = allUsers.filter((user): user is User => user !== undefined);
          setUsers(validUsers);
        } else {
          setUsers([]);
          console.warn('No users returned from the backend');
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
        Notification.show('Error fetching users', { position: 'bottom-center', theme: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  
  // Handle opening the edit dialog
  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setEditedUser({...user}); // Create a copy to edit
    setEditDialogOpen(true);
  };
  
  // Handle saving edited user
  const handleSaveUser = async () => {
    if (!editedUser) return;
    
    try {
      await UserEndpoint.updateUser(editedUser);
      
      // Update the local state
      setUsers(users.map(user => 
        user.userId === editedUser.userId ? editedUser : user
      ));
      
      setEditDialogOpen(false);
      Notification.show('User updated successfully', { position: 'bottom-center', theme: 'success' });
    } catch (err) {
      console.error('Error updating user:', err);
      Notification.show('Failed to update user', { position: 'bottom-center', theme: 'error' });
    }
  };
  
  // Handle field changes in the edit form
  const handleFieldChange = (field: keyof User, value: any) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value
      });
    }
  };
  
  // Handle opening the block dialog
  const handleBlockClick = (user: User) => {
    setUserToBlock(user);
    setBlockDialogOpen(true);
  };
  
  // Handle blocking a user
  const handleBlockUser = async () => {
    if (!userToBlock) return;
    
    try {
      // Clone the user and set status to blocked
      const blockedUser = {...userToBlock};
      blockedUser.userRole = UserRole.BLOCKED;
      
      await UserEndpoint.updateUser(blockedUser);
      
      // Update the local state
      setUsers(users.map(user => 
        user.userId === blockedUser.userId ? blockedUser : user
      ));
      
      setBlockDialogOpen(false);
      Notification.show('User blocked successfully', { position: 'bottom-center', theme: 'success' });
    } catch (err) {
      console.error('Error blocking user:', err);
      Notification.show('Failed to block user', { position: 'bottom-center', theme: 'error' });
    }
  };

  // Styles to make the grid fill the available viewport space
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    height: 'calc(100vh - 160px)', // Adjust based on header and padding
    overflow: 'hidden',
  };

  const gridContainerStyle = {
    flex: '1 1 auto',
    overflow: 'auto',
    minHeight: '0px', // Needed for Firefox
  };

  return (
    <div className="p-m" style={containerStyle}>
      <h2 className="mb-m">User Management</h2>
      
      {error && <div className="text-error mb-m">{error}</div>}
      
      {loading ? (
        <div className="flex items-center justify-center p-m">
          <span>Loading users...</span>
        </div>
      ) : (
        <div style={gridContainerStyle}>
          {users.length === 0 ? (
            <div className="p-m text-center">
              <p>No users found in the database.</p>
            </div>
          ) : (
            <Grid 
              items={users} 
              className="h-full"
              theme="row-stripes"
              allRowsVisible={false}
            >
              <GridColumn path="userId" header="User ID" autoWidth />
              <GridColumn path="username" header="Username" />
              <GridColumn path="email" header="Email" />
              <GridColumn path="fullName" header="Full Name" />
              <GridColumn path="phone" header="Phone" autoWidth />
              <GridColumn path="userRole" header="Role" autoWidth />
              <GridColumn 
                header="Actions" 
                autoWidth
                frozen
                textAlign="center"
                renderer={({item}) => (
                  <div className="flex gap-s">
                    <Button 
                      theme="tertiary small" 
                      title="Edit user"
                      onClick={() => handleEditClick(item as User)}
                    >
                      Edit
                    </Button>
                    <Button 
                      theme="tertiary error small" 
                      title="Block user"
                      onClick={() => handleBlockClick(item as User)}
                      disabled={(item as User).userRole === UserRole.BLOCKED}
                    >
                      Block
                    </Button>
                  </div>
                )}
              />
            </Grid>
          )}
        </div>
      )}
      
      {/* Edit User Dialog */}
      <Dialog
        header={`Edit User: ${currentUser?.username}`}
        opened={editDialogOpen}
        onOpenedChanged={({detail}) => setEditDialogOpen(detail.value)}
        footerRenderer={() => (
          <div className="flex gap-m justify-end">
            <Button theme="tertiary" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button theme="primary" onClick={handleSaveUser}>Save</Button>
          </div>
        )}
      >
        {editedUser && (
          <FormLayout>
            <TextField
              label="Username"
              value={editedUser.username}
              onChange={(e) => handleFieldChange('username', e.target.value)}
            />
            <EmailField
              label="Email"
              value={editedUser.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
            />
            <TextField
              label="Full Name"
              value={editedUser.fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
            />
            <TextField
              label="Phone"
              value={editedUser.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
            />
            <Select
              label="Role"
              value={editedUser.userRole as string}
              items={roleItems}
              onChange={(e) => handleFieldChange('userRole', e.target.value)}
            />
          </FormLayout>
        )}
      </Dialog>
      
      {/* Block User Confirmation Dialog */}
      <ConfirmDialog
        header="Block User"
        opened={blockDialogOpen}
        onOpenedChanged={({detail}) => setBlockDialogOpen(detail.value)}
        confirmText="Block"
        confirmTheme="error primary"
        cancelText="Cancel"
        onConfirm={handleBlockUser}
      >
        <div>
          Are you sure you want to block {userToBlock?.username}?
          <p className="text-s mt-s text-secondary">
            This will prevent the user from logging in and using the system.
          </p>
        </div>
      </ConfirmDialog>
    </div>
  );
}