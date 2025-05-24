package com.pedro.apps.users;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;

@DynamoDbBean
public class User {
  private String userId;
  private String operation;
  private String username;
  private String email;
  private String fullName;
  private String phone;
  
  public User(String userId, String operation, String username, String email, String fullName, String phone) {
	this.userId = userId;
	this.operation = operation;
	this.username = username;
	this.email = email;
	this.fullName = fullName;
	this.phone = phone;
  }
  @DynamoDbPartitionKey
  public String getUserId() {
	return userId;
  }
  
  public void setUserId(String userId) {
	this.userId = userId;
  }
  
  @DynamoDbSortKey
  public String getOperation() {
	return operation;
  }
  
  public void setOperation(String operation) {
	this.operation = operation;
  }
  
  @DynamoDbAttribute("username")
  public String getUsername() {
	return username;
  }
  
  public void setUsername(String username) {
	this.username = username;
  }
  
  @DynamoDbAttribute("email")
  public String getEmail() {
	return email;
  }
  
  public void setEmail(String email) {
	this.email = email;
  }
  
  @DynamoDbAttribute("fullName")
  public String getFullName() {
	return fullName;
  }
  
  public void setFullName(String fullName) {
	this.fullName = fullName;
  }
  
  @DynamoDbAttribute("phone")
  public String getPhone() {
	return phone;
  }
  
  public void setPhone(String phone) {
	this.phone = phone;
  }
}