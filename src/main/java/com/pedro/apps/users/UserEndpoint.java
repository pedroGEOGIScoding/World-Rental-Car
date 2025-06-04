package com.pedro.apps.users;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Endpoint
@AnonymousAllowed
public class UserEndpoint {
  
  private final UserRepository userRepository;
  
  @Autowired
  public UserEndpoint(UserRepository userRepository) {
	this.userRepository = userRepository;
  }
  
  //Save User
  public void saveUser(User user) {
	System.out.println("UserEndpoint.saveUser: " + user);
	userRepository.save(user);
  }
  
  //Update user
  public void updateUser(User user) {
	System.out.println("UserEndpoint.updateUser: " + user);
	userRepository.save(user);
  }
  
  //Delete user
  public void deleteUser(User user) {
	System.out.println("UserEndpoint.deleteUser: " + user);
	userRepository.deleteUser(user);
  }
  
  //Get all users
  public List<User> getAllUsersById(String operation) {
	return userRepository.getAllUsersById(operation);
  }
  
  //Save Booking
  public void saveBooking(Booking booking) {
	System.out.println("UserEndpoint.saveBooking: " + booking);
	userRepository.save(booking);
  }
  
  //Get all bookings for User
  public List<Booking> getBookingsByUser(String userId) {
	return userRepository.findBookingsByUserId(userId);
  }
  
  //Delete user by ID
  public void deleteUserById(String userId) {
    System.out.println("UserEndpoint.deleteUserById: " + userId);
    
    // Find the user first
    List<User> users = userRepository.getAllUsersById(userId);
    if (users != null && !users.isEmpty()) {
      User user = users.get(0);
      userRepository.deleteUser(user);
      System.out.println("User deleted: " + userId);
    } else {
      System.out.println("User not found for deletion: " + userId);
    }
  }
  
  //Get all bookings 
  public List<Booking> getAllBookings() {
    return userRepository.getAllBookings();
  }
}