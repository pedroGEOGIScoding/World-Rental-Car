package com.pedro.apps.delegations;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class DelegationEndpointTest {

    @Autowired
    private DelegationEndpoint delegationEndpoint;

    @Test
    public void testGetAllCars() {
        System.out.println("[DEBUG_LOG] Testing getAllCars method");
        try {
            List<Car> cars = delegationEndpoint.getAllCars();
            assertNotNull(cars, "Cars list should not be null");
            System.out.println("[DEBUG_LOG] Number of cars retrieved: " + cars.size());
            for (Car car : cars) {
                System.out.println("[DEBUG_LOG] Car: " + car.getMake() + " " + car.getModel() + ", Operation: " + car.getOperation() + ", Status: " + car.getStatus());
            }
        } catch (Exception e) {
            System.out.println("[DEBUG_LOG] Exception caught: " + e.getMessage());
            e.printStackTrace();
            throw e; // Rethrow to fail the test
        }
    }
}