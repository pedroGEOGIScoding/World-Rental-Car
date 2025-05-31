package com.pedro.apps.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

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
	table.scan(ScanEnhancedRequest.builder().build()).items().forEach(users::add);
	return users;
  }
  
  @Override
  public List<Booking> findBookingsByUserId(String userId) {
    // This client creates a reference to our DynamoDB table
    // telling the SDK to map table items to our Booking Java class
    DynamoDbTable<Booking> table = enhancedClient.table(tableName, TableSchema.fromBean(Booking.class));
    
    // Create an empty list where we will collect all the bookings found for the user
    List<Booking> bookings = new ArrayList<>();
    
    try {
      // Query for all items with matching userId as the partition key
      // without specifying a sort key condition
      Iterator<Booking> results = table.query(
          QueryConditional.keyEqualTo(Key.builder()
              .partitionValue(userId)
              .build())
      ).items().iterator();
      
      // Loop over the query results and add them to the 'bookings' list
      results.forEachRemaining(bookings::add);
      
      // Filter bookings based on operation if needed (optional)
      // If you need to filter for only specific booking types, uncomment and modify below
      // return bookings.stream()
      //     .filter(b -> b.getOperation() != null && b.getOperation().startsWith("booking"))
      //     .collect(Collectors.toList());
      
      System.out.println("Found " + bookings.size() + " bookings for user ID: " + userId);
    } catch (Exception e) {
      System.err.println("Error querying bookings for user ID " + userId + ": " + e.getMessage());
      e.printStackTrace();
    }
    
    return bookings;
  }
}