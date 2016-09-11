package com.sjsu.model;

public class Bus implements com.sjsu.interfaces.Bus {

	@Override
	public void enginePerformance() {
		// TODO Auto-generated method stub
		System.out.println("Horsepower : 200hp-350hp \n Topspeed: 60mph-120mph");
	}

	@Override
	public void mileageInfo() {
		// TODO Auto-generated method stub
		System.out.println("Milege: 8-12 mpg");
	}

	@Override
	public void passengerCapacityInBus() {
		// TODO Auto-generated method stub
		System.out.println("Maximum 20-50 person");
	}

}
