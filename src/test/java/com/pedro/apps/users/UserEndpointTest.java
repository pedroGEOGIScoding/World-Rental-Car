package com.pedro.apps.users;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class UserEndpointTest {

    @Autowired
    private UserEndpoint userEndpoint;

    @Test
    public void testGetAllUsersById() {
        System.out.println("[DEBUG_LOG] Testing getAllUsersById method");
        try {
            List<User> users = userEndpoint.getAllUsersById("user");
            assertNotNull(users, "Users list should not be null");
            System.out.println("[DEBUG_LOG] Number of users retrieved: " + users.size());
            for (User user : users) {
                System.out.println("[DEBUG_LOG] User: " + user.getUsername() + ", FullName: " + user.getFullName() + ", Role: " + user.getUserRole());
            }
        } catch (Exception e) {
            System.out.println("[DEBUG_LOG] Exception caught: " + e.getMessage());
            e.printStackTrace();
            throw e; // Rethrow to fail the test
        }
    }
    
    @Test
    public void testGetBookingsByUser() {
        System.out.println("[DEBUG_LOG] Testing getBookingsByUser method");
        try {
            // Use a known user ID or first user from database
            List<User> users = userEndpoint.getAllUsersById("user");
            String userId = users.isEmpty() ? "test-user-id" : users.get(0).getUserId();
            
            System.out.println("[DEBUG_LOG] Getting bookings for user ID: " + userId);
            List<Booking> bookings = userEndpoint.getBookingsByUser(userId);
            assertNotNull(bookings, "Bookings list should not be null");
            System.out.println("[DEBUG_LOG] Number of bookings retrieved for user " + userId + ": " + bookings.size());
            
            for (Booking booking : bookings) {
                System.out.println("[DEBUG_LOG] Booking: " + booking.getOperation() + 
                                 ", Start Date: " + booking.getStartDate() + 
                                 ", End Date: " + booking.getEndDate() + 
                                 ", Status: " + booking.getStatusBooking());
            }
        } catch (Exception e) {
            System.out.println("[DEBUG_LOG] Exception caught: " + e.getMessage());
            e.printStackTrace();
            throw e; // Rethrow to fail the test
        }
    }
    
    @Test
    public void testSaveUser() {
        System.out.println("[DEBUG_LOG] Testing saveUser method");
        try {
            // Generate a unique user for testing
            String testUserId = "test-" + UUID.randomUUID().toString().substring(0, 8);
            
            User testUser = new User();
            testUser.setUserId(testUserId);
            testUser.setOperation("user");
            testUser.setUsername("testuser_" + testUserId);
            testUser.setEmail("test_" + testUserId + "@example.com");
            testUser.setFullName("Test User");
            testUser.setPhone("1234567890");
            testUser.setUserRole(UserRole.CUSTOMER);
            
            System.out.println("[DEBUG_LOG] Saving test user with ID: " + testUserId);
            userEndpoint.saveUser(testUser);
            System.out.println("[DEBUG_LOG] Test user saved successfully");
            
        } catch (Exception e) {
            System.out.println("[DEBUG_LOG] Exception caught: " + e.getMessage());
            e.printStackTrace();
            throw e; // Rethrow to fail the test
        }
    }
    
    @Test
    public void testUpdateUser() {
        System.out.println("[DEBUG_LOG] Testing updateUser method");
        try {
            // First create a user to update
            String testUserId = "test-update-" + UUID.randomUUID().toString().substring(0, 8);
            
            User testUser = new User();
            testUser.setUserId(testUserId);
            testUser.setOperation("user");
            testUser.setUsername("update_" + testUserId);
            testUser.setEmail("update_" + testUserId + "@example.com");
            testUser.setFullName("Test Update User");
            testUser.setPhone("1234567890");
            testUser.setUserRole(UserRole.CUSTOMER);
            
            System.out.println("[DEBUG_LOG] First saving test user with ID: " + testUserId);
            userEndpoint.saveUser(testUser);
            
            // Now update the user
            testUser.setFullName("Updated Test User");
            testUser.setPhone("9876543210");
            
            System.out.println("[DEBUG_LOG] Updating test user with ID: " + testUserId);
            userEndpoint.updateUser(testUser);
            System.out.println("[DEBUG_LOG] Test user updated successfully");
            
        } catch (Exception e) {
            System.out.println("[DEBUG_LOG] Exception caught: " + e.getMessage());
            e.printStackTrace();
            throw e; // Rethrow to fail the test
        }
    }
    
    @Test
    public void testSaveBooking() {
        System.out.println("[DEBUG_LOG] Testing saveBooking method");
        try {
            // Generate unique IDs for testing
            String testBookingId = "booking-" + UUID.randomUUID().toString().substring(0, 8);
            String testUserId = "test-booking-user-" + UUID.randomUUID().toString().substring(0, 8);
            
            // Create test booking
            Booking testBooking = new Booking();
            testBooking.setUserId(testUserId);
            testBooking.setOperation(testBookingId);
            testBooking.setStartDate("2025-06-01");
            testBooking.setEndDate("2025-06-07");
            testBooking.setTotalToPayment(350.0);
            testBooking.setStatusBooking("CONFIRMED");
            testBooking.setStatusPayment("PAID");
            
            System.out.println("[DEBUG_LOG] Saving test booking with ID: " + testBookingId + " for user: " + testUserId);
            userEndpoint.saveBooking(testBooking);
            System.out.println("[DEBUG_LOG] Test booking saved successfully");
            
        } catch (Exception e) {
            System.out.println("[DEBUG_LOG] Exception caught: " + e.getMessage());
            e.printStackTrace();
            throw e; // Rethrow to fail the test
        }
    }
}
