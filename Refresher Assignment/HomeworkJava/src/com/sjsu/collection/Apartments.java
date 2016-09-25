package com.sjsu.collection;

import java.util.ArrayList;
import java.util.HashMap;

public class Apartments {

	private int aptId;
	private String Type;
	private double rent;
	private HashMap<Integer, ArrayList<String>> aptMap;
	public int getAptId() {
		return aptId;
	}

	public void setAptId(int aptId) {
		this.aptId = aptId;
	}

	public String getType() {
		return Type;
	}

	public void setType(String type) {
		Type = type;
	}

	public double getRent() {
		return rent;
	}

	public void setRent(double rent) {
		this.rent = rent;
	}

	public HashMap<Integer, ArrayList<String>> getAptMap() {
		return aptMap;
	}

	public void setAptMap(HashMap<Integer, ArrayList<String>> aptMap) {
		this.aptMap = aptMap;
	}

}
