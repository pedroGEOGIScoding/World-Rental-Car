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
  
  //Save Booking
  public void saveBooking(Booking booking) {
	System.out.println("UserEndpoint.saveBooking: " + booking);
	userRepository.save(booking);
  }
  
  //Get all bookings for User
  public List<Booking> getBookingsByUser(String userId) {
	return userRepository.findBookingsByUserId(userId);
  }
}