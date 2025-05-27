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
  private float lat;
  private float lon;
  private int price;
  public CarStatus carStatus;
  private Map<String, String> bookingDates;

  // Default constructor required for DynamoDB's enhanced client
  public Car() {
    this.bookingDates = new HashMap<>();
    this.carStatus = CarStatus.AVAILABLE; // Default status
  }

  public Car(String delegationId, String operation, String carId, String make, String model, String year, String color, Boolean rented, float lat, float lon, int price, CarStatus carStatus, Map<String, String> bookingDates) {
	this.delegationId = delegationId;
	this.operation = operation;
	this.carId = carId;
	this.make = make;
	this.model = model;
	this.year = year;
	this.color = color;
	this.lat = lat;
	this.lon = lon;
	this.price = price;
	this.carStatus = carStatus;
	this.bookingDates = bookingDates;
  }

  //Setters & Getters
  
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

  @DynamoDbAttribute("carStatus")
  public CarStatus getStatus() {
	return carStatus;
  }

  public void setStatus(CarStatus carStatus) {
	this.carStatus = carStatus;
  }

  @DynamoDbAttribute("bookingDates")
  public Map<String, String> getBookingDates() {
	return bookingDates;
  }

  public void setBookingDates(Map<String, String> bookingDates) {
	this.bookingDates = bookingDates;
  }

}