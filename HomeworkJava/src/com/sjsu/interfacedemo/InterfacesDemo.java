package com.sjsu.interfacedemo;

import java.util.Scanner;

import com.sjsu.interfaces.Vehicle;
import com.sjsu.model.Bus;
import com.sjsu.model.Car;

public class InterfacesDemo {

	public boolean vehicleInfo(Scanner in, int c) {

		try {

			Vehicle vehicle = null;

			switch (c) {
			case 1:
				vehicle = new Car();
				vehicle.enginePerformance();
				vehicle.mileageInfo();
				((Car) vehicle).passengerCapacityInCar();
				return true;
			case 2:
				vehicle = new Bus();
				vehicle.enginePerformance();
				vehicle.mileageInfo();
				((Bus) vehicle).passengerCapacityInBus();
				return true;
			default:
				System.out.println("Please enter correct choice!");
				return false;
			}

		} catch (Exception e) {
			System.out.println("Exception: " + e.getMessage());
			e.printStackTrace();
			return false;
		}
	}

}
