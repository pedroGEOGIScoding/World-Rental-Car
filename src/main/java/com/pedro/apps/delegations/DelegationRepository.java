package com.pedro.apps.delegations;

import java.util.List;

//This interface defines methods for interacting with a DynamoDB database in a car delegation/rental system
public interface DelegationRepository {
  
  // These below are generic methods. <T> is a conventional letter that stands for "Type". <T> refers to the concept of Generics in Java. You can use any letter, but <T> is widely preferred.
  <T> void save(T item);
  
  <T> T get(String partitionKey, String sortKey, Class<T> clazz);
  
  <T> List<T> listByPartitionKey(String partitionKey, Class<T> clazz);
  
  //Specific methods where both Car and Delegation classes are annotated with DynamoDB and use @DynamoDbBean annotations
  List<Car> listAllCars();
  
  List<Delegation> listAllDelegations();
  
  <T> List<T> listAllItems(Class<T> clazz);
}