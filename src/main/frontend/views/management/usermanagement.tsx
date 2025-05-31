import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {SetStateAction, useEffect, useState} from "react";
import {UserEndpoint} from "Frontend/generated/endpoints";
import { Grid } from '@vaadin/react-components/Grid.js';
import { GridColumn } from '@vaadin/react-components/GridColumn.js';
import { Notification } from '@vaadin/react-components/Notification.js';
import { Button } from '@vaadin/react-components/Button.js';
import type User from 'Frontend/generated/com/pedro/apps/users/User';

export const config: ViewConfig = {
  menu: {order: 10, icon: 'line-awesome/svg/users-cog-solid.svg'},
  title: 'User Management',
};

export default function UserManagementView() {

  // Update the type to match what's coming from the backend
  const [users, setUsers] = useState<User[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all users when the component mounts
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

    fetchUsers();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="flex flex-col h-full box-border">
      <h2 className="m-m">User Management</h2>
      
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
            <GridColumn path="userRole" header="Role" />
            <GridColumn 
              header="Actions" 
              width="150px"
              frozen
              textAlign="center"
              renderer={({ item }) => (
                <div className="flex gap-s justify-center">
                  <Button theme="tertiary small" onClick={() => console.log('Edit user:', item)}>
                    Edit
                  </Button>
                  <Button theme="tertiary-error small" onClick={() => console.log('Delete user:', item)}>
                    Delete
                  </Button>
                </div>
              )}
            />
          </Grid>
        </div>
      )}
    </div>
  );
}