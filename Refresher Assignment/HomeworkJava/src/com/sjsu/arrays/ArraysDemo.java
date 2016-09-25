package com.sjsu.arrays;

import java.util.ArrayList;

public class ArraysDemo {

	private ArrayList<String> favoriteCars;

	public ArraysDemo() {
		favoriteCars = new ArrayList<String>();
	}

	public boolean addFavCar(String carName) {
		if (favoriteCars.add(carName)) {
			System.out.println("Your car " + carName + " is added in the list.");
			return true;
		} else
			return false;

	}

	public boolean removeFavCar(String carName) {
		String dispString = null;
		boolean isRemoved;
		if (favoriteCars.remove(carName)) {
			dispString = "Your car has been removed.";
			isRemoved = true;
		} else {
			dispString = "Your car is not in the list.";
			isRemoved = false;
		}

		System.out.println(dispString);
		return isRemoved;
	}

	public boolean searchYourFavCar(String carName) {
		String dispString = null;
		boolean isCarPresent = false;
		if (favoriteCars != null && favoriteCars.size() != 0) {
			if (favoriteCars.contains(carName)) {
				dispString = "Your car is in your favorite car list.";
				isCarPresent = true;
			} else {
				dispString = "This car is not in your favorite car list.";
				isCarPresent = false;
			}
		} else {
			dispString = "Your favorite car list it empty.";
			isCarPresent = false;
		}
		System.out.println(dispString);
		return isCarPresent;

	}

}
