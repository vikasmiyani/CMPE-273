package com.sjsu.stack;

import java.util.ArrayList;

public class StackDemo {

	private ArrayList<String> businessCardHolder;
	private int totalCapacity;

	public StackDemo(int totalCapacity) {
		// TODO Auto-generated constructor stub
		businessCardHolder = new ArrayList<String>(totalCapacity);
		this.totalCapacity = totalCapacity;
	}

	public boolean placeCard(String businessCard) {

		if (!isCardHolderFull()) {
			return businessCardHolder.add(businessCard);
		} else {
			System.out.println("It has no space to place a new card.");
			return false;
		}
	}

	public String removeCard() {

		if (!isCardHolderEmpty()) {
			System.out.println("Your card removed");
			return businessCardHolder.remove(getCapacity() - 1);
		} else {
			return null;
		}

	}

	public String peekAnyCard() {
		String disp = null;
		if (!isCardHolderEmpty()) {
			disp = businessCardHolder.get(getCapacity() - 1);
		} else {
			disp = null;
		}

		return disp;
	}

	public boolean displayAllCard() {

		String disp = null;
		boolean isDisplay;
		if (!isCardHolderEmpty()) {
			disp = "Availabel business cards. \n";
			for (String card : businessCardHolder) {
				disp += card + "\n";
			}
			isDisplay = true;
		} else {
			disp = "Sorry!! No card is in Card Holder.";
			isDisplay = false;
		}
		System.out.println(disp);
		return isDisplay;
	}

	public boolean isCardHolderEmpty() {

		return (getCapacity() == 0);
	}

	public boolean isCardHolderFull() {

		return (getCapacity() == totalCapacity);
	}

	private int getCapacity() {
		// TODO Auto-generated method stub
		return businessCardHolder.size();
	}

}
