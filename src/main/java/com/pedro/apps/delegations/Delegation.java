package com.pedro.apps.delegations;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;

@DynamoDbBean
public class Delegation {
  private String delegationId; //This is the partition key
  private String operation; //This is the sort key
  private String name;
  private String address;
  private String city;
  private float latDelegation;
  private float lonDelegation;
  private int availableCarQty;
  private String phone;
  private String email;
  
  public Delegation(String delegationId, String operation, String name, String address, String city, float latDelegation, float lonDelegation, int availableCarQty, String phone, String email) {
	this.delegationId = delegationId;
	this.operation = operation;
	this.name = name;
	this.address = address;
	this.city = city;
	this.latDelegation = latDelegation;
	this.lonDelegation = lonDelegation;
	this.availableCarQty = availableCarQty;
	this.phone = phone;
	this.email = email;
  }
  
  @DynamoDbPartitionKey
  public String getDelegationId() {
	return delegationId;
  }
  
  public void setDelegationId(String delegationId) {
	this.delegationId = delegationId;
  }
  
  @DynamoDbSortKey
  public String getOperation() {
	return operation;
  }
  
  public void setOperation(String operation) {
	this.operation = operation;
  }
  
  @DynamoDbAttribute("name")
  public String getName() {
	return name;
  }
  
  public void setName(String name) {
	this.name = name;
  }
  
  @DynamoDbAttribute("address")
  public String getAddress() {
	return address;
  }
  
  public void setAddress(String address) {
	this.address = address;
  }
  
  @DynamoDbAttribute("city")
  public String getCity() {
	return city;
  }
  
  public void setCity(String city) {
	this.city = city;
  }
  
  @DynamoDbAttribute("latDelegation")
  public float getLatDelegation() {
	return latDelegation;
  }
  
  public void setLatDelegation(float latDelegation) {
	this.latDelegation = latDelegation;
  }
  
  @DynamoDbAttribute("lonDelegation")
  public float getLonDelegation() {
	return lonDelegation;
  }
  
  public void setLonDelegation(float lonDelegation) {
	this.lonDelegation = lonDelegation;
  }
  
  @DynamoDbAttribute("availableCarQty")
  public int getAvailableCarQty() {
	return availableCarQty;
  }
  
  public void setAvailableCarQty(int availableCarQty) {
	this.availableCarQty = availableCarQty;
  }
  
  @DynamoDbAttribute("phone")
  public String getPhone() {
	return phone;
  }
  
  public void setPhone(String phone) {
	this.phone = phone;
  }
  
  @DynamoDbAttribute("email")
  public String getEmail() {
	return email;
  }
  
  public void setEmail(String email) {
	this.email = email;
  }
}