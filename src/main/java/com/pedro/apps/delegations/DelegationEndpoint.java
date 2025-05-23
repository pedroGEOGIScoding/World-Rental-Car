package com.pedro.apps.delegations;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

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
  public List<Delegation> listDelegations(String delegationId) {
	return delegationRepository.listByPartitionKey(delegationId, Delegation.class);
  }
  
  // List Cars by id (partition key)
  public List<Car> listCars(String carId) {
	return delegationRepository.listByPartitionKey(carId, Car.class);
  }
  
  //List all cars for all delegations
  public List<Car> listAllCars() {
	return delegationRepository.listAllCars();
  }
  
  //LIst all delegations with operation = "profile"
  public List<Delegation> listAllDelegations() {
	return delegationRepository.listAllDelegations();
  }
  
}