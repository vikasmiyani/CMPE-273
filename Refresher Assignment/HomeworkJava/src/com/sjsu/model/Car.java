package com.sjsu.model;

public class Car implements com.sjsu.interfaces.Car {

	@Override
	public void enginePerformance() {
		// TODO Auto-generated method stub
		System.out.println("Horsepower : 70hp-320hp \n Topspeed: 120mph-200mph");
	}

	@Override
	public void mileageInfo() {
		// TODO Auto-generated method stub
		System.out.println("Milege: 12-25 mpg");
	}

	@Override
	public void passengerCapacityInCar() {
		// TODO Auto-generated method stub
		System.out.println("Maximum 5 person");
	}

}
