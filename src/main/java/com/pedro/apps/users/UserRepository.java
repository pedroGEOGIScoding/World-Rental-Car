package com.pedro.apps.users;

import java.util.List;

public interface UserRepository {
  <T> void save(T item);
  
  List<Booking> findBookingsByUserId(String userId);
  
  List<User> getAllUsersById(String operation);
}