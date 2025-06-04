package com.pedro.apps.delegations;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Endpoint
@AnonymousAllowed
public class DelegationEndpoint {

  private final DelegationRepository delegationRepository;

  @Autowired
  public DelegationEndpoint(DelegationRepository delegationRepository) {
	this.delegationRepository = delegationRepository;
  }

  //Save Delegation
  public void saveDelegation(Delegation delegation) {
	delegationRepository.save(delegation);
  }

  //Save Car
  public void saveCar(Car car) {
	delegationRepository.save(car);
  }

  //Get Delegation by keys
  public Delegation getDelegation(String delegationId, String operation) {
	return delegationRepository.get(delegationId, operation, Delegation.class);
  }

  //Get Car by keys
  public Car getCar(String carId, String operation) {
	return delegationRepository.get(carId, operation, Car.class);
  }

  // List Delegations by delegationId
  public List<Delegation> listDelegationsById(String delegationId) {
	return delegationRepository.listByPartitionKey(delegationId, Delegation.class);
  }

  // List Cars by id (partition key)
  public List<Car> listCarsById(String carId) {
	return delegationRepository.listByPartitionKey(carId, Car.class);
  }

  //List all cars for all delegations
  public List<Car> getAllCars() {
    try {
      System.out.println("DelegationEndpoint: Starting getAllCars method");
      List<Car> cars = delegationRepository.listAllCars();
      System.out.println("DelegationEndpoint: Retrieved " + cars.size() + " cars");

      // Initialize any null fields to prevent serialization issues
      for (Car car : cars) {
        if (car.getBookingDates() == null) {
          car.setBookingDates(new HashMap<>());
        }
        if (car.getStatus() == null) {
          car.setStatus(CarStatus.AVAILABLE);
        }
      }

      return cars;
    } catch (Exception e) {
      System.err.println("DelegationEndpoint: Error in getAllCars: " + e.getMessage());
      e.printStackTrace();
      throw e; // Rethrow to propagate the error
    }
  }

  //LIst all delegations with operation = "profile"
  public List<Delegation> getAllProfileDelegations() {
	return delegationRepository.listAllDelegations();
  }
  
  public List<Delegation> getAllDelegations() {
    return delegationRepository.listAllItems(Delegation.class);
  }

}