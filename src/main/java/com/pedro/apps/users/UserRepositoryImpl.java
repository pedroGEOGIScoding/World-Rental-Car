package com.pedro.apps.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest;
import software.amazon.awssdk.enhanced.dynamodb.Expression;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryEnhancedRequest;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class UserRepositoryImpl implements UserRepository {
  
  private final DynamoDbEnhancedClient enhancedClient;
  private final String tableName = "Users";
  
  @Autowired
  public UserRepositoryImpl(DynamoDbEnhancedClient enhancedClient) {
	this.enhancedClient = enhancedClient;
  }
  
  @Override
  public <T> void save(T item) {
	DynamoDbTable<T> table =
		enhancedClient.table(
			tableName,
			TableSchema.fromBean((Class<T>) item.getClass()));
	table.putItem(item);
  }
  
  @Override
  public List<User> getAllUsersById(String operation) {
	DynamoDbTable<User> table = enhancedClient.table(tableName, TableSchema.fromBean(User.class));
	List<User> users = new ArrayList<>();
	
	// If operation is empty, get all user records
	if (operation == null || operation.isEmpty()) {
	  // Create an expression to filter items where operation is either empty or "user"
	  // This ensures we only get user profile records and not other entities
	  Map<String, AttributeValue> expressionValues = new HashMap<>();
	  expressionValues.put(":userValue", AttributeValue.builder().s("user").build());
	  expressionValues.put(":emptyValue", AttributeValue.builder().s("").build());
	  
	  Expression filterExpression = Expression.builder()
	      .expression("operation = :userValue OR operation = :emptyValue")
	      .expressionValues(expressionValues)
	      .build();
	  
	  // Apply the filter to the scan
	  table.scan(ScanEnhancedRequest.builder()
	      .filterExpression(filterExpression)
	      .build())
	      .items()
	      .forEach(users::add);
	      
	  System.out.println("Found " + users.size() + " users in DynamoDB");
	} else {
	  // If operation is specified, use it in the query
	  Map<String, AttributeValue> expressionValues = new HashMap<>();
	  expressionValues.put(":operationValue", AttributeValue.builder().s(operation).build());
	  
	  Expression filterExpression = Expression.builder()
	      .expression("operation = :operationValue")
	      .expressionValues(expressionValues)
	      .build();
	  
	  table.scan(ScanEnhancedRequest.builder()
	      .filterExpression(filterExpression)
	      .build())
	      .items()
	      .forEach(users::add);
	}
	
	return users;
  }
  
  @Override
  public List<Booking> findBookingsByUserId(String userId) {
	// This client creates a reference to our DynamoDB table
	// telling the SDK to map table items to our Booking Java class
	// it uses the value of enhancedClient
	DynamoDbTable<Booking> table = enhancedClient.table(tableName, TableSchema.fromBean(Booking.class));
	
	// Assuming ''Booking'' has a partition key named "userId"
	// empty list where we will collect all the bookings found for the user.
	List<Booking> bookings = new ArrayList<>();
	
	// Query for items where the partition key equals userId and the sort key begins with "booking"
	// QueryConditional.keyEqualTo(...): Tells DynamoDB to return all items
	// where the partition key (here, userId) equals the value you provided.
	Iterator<Booking> results = table.query(
		r -> r.queryConditional(
			QueryConditional.sortBeginsWith(
				Key.builder()
					.partitionValue(userId)
					.sortValue("booking")
					.build()
			)
		)
	).items().iterator();
	// .items().iterator(): Gets an iterator over the query results.
	// Each item is mapped to a Booking object.
	
	// Loop over the query results and add them to the 'bookings' list
	// with the method reference: bookings::add
	results.forEachRemaining(bookings::add);
	return bookings;
  }
  
  
}