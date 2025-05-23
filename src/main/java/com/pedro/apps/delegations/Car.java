package com.pedro.apps.delegations;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;

import java.util.*;

@DynamoDbBean
public class Car {
  private String delegationId;
  private String operation;
  private String carId;
  private String make;
  private String model;
  private String year;
  private String color;
  private Boolean rented;
  private float lat;
  private float lon;
  private int price;
  public enum status {AVAILABLE, RENTED, MAINTENANCE, OUT_OF_ORDER}
  private Map<String, Boolean> bookingDates;
  
  public Car(String delegationId, String operation, String carId, String make, String model, String year, String color, Boolean rented, float lat, float lon, int price, Map<String, Boolean> bookingDates) {
	this.delegationId = delegationId;
	this.operation = operation;
	this.carId = carId;
	this.make = make;
	this.model = model;
	this.year = year;
	this.color = color;
	this.rented = rented;
	this.lat = lat;
	this.lon = lon;
	this.price = price;
	this.bookingDates = bookingDates;
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
  
  @DynamoDbAttribute("carId")
  public String getCarId() {
	return carId;
  }
  
  public void setCarId(String carId) {
	this.carId = carId;
  }
  
  @DynamoDbAttribute("make")
  public String getMake() {
	return make;
  }
  
  public void setMake(String make) {
	this.make = make;
  }
  
  @DynamoDbAttribute("model")
  public String getModel() {
	return model;
  }
  
  public void setModel(String model) {
	this.model = model;
  }
  
  @DynamoDbAttribute("year")
  public String getYear() {
	return year;
  }
  
  public void setYear(String year) {
	this.year = year;
  }
  
  @DynamoDbAttribute("color")
  public String getColor() {
	return color;
  }
  
  public void setColor(String color) {
	this.color = color;
  }
  
  @DynamoDbAttribute("rented")
  public Boolean getRented() {
	return rented;
  }
  
  public void setRented(Boolean rented) {
	this.rented = rented;
  }
  
  @DynamoDbAttribute("lat")
  public float getLat() {
	return lat;
  }
  
  public void setLat(float lat) {
	this.lat = lat;
  }
  
  @DynamoDbAttribute("lon")
  public float getLon() {
	return lon;
  }
  
  public void setLon(float lon) {
	this.lon = lon;
  }
  
  @DynamoDbAttribute("price")
  public int getPrice() {
	return price;
  }
  
  public void setPrice(int price) {
	this.price = price;
  }
  
  @DynamoDbAttribute("status")
  public status getStatus(status status) {
	return status;
  }
  
  @DynamoDbAttribute("bookingDates")
  public Map<String, Boolean> getBookingDates() {
	return bookingDates;
  }
  
  public void setBookingDates(Map<String, Boolean> bookingDates) {
	this.bookingDates = bookingDates;
  }
  
}