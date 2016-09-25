package com.sjsu.collection;

import java.util.ArrayList;
import java.util.HashMap;

public class CollectionsDemo {

	ArrayList<String> propertyAgents = new ArrayList<String>();
	ArrayList<Apartments> aptList = new ArrayList<Apartments>();
	HashMap<Integer, ArrayList<String>> aptMap = new HashMap<Integer, ArrayList<String>>();

	public boolean addApartmentDetails(Object a_id, Object a_type, Object a_rent, ArrayList<String> a_propertyAgents) {
		Apartments apt = new Apartments();
		try {
			int aptId = Integer.parseInt(a_id.toString());
			double rent = Double.parseDouble(a_rent.toString());
			String type = String.valueOf(a_type);
			propertyAgents = a_propertyAgents;

			if (type.equalsIgnoreCase("1bhk") || type.equalsIgnoreCase("2bhk") || type.equalsIgnoreCase("3bhk")) {
				if (!propertyAgents.isEmpty()) {
					apt.setAptId(aptId);
					apt.setRent(rent);
					apt.setType(type);
					// apt.setPropertyAgents(propertyAgents);
					aptMap.put(aptId, propertyAgents);
					apt.setAptMap(aptMap);
					aptList.add(apt);
					return true;
				} else {
					System.out.println("There must be one property agent.");
					return false;
				}
			} else {
				System.out.println("Type must be 1bhk / 2bhk / 3bhk.");
				return false;
			}

		} catch (NumberFormatException e) {
			System.out.println("Apt id or Rent is not valid input.");
			return false;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean searchApartmentByType(Object a_type) {

		try {
			String type = String.valueOf(a_type);
			if (type.equalsIgnoreCase("1bhk") || type.equalsIgnoreCase("2bhk") || type.equalsIgnoreCase("3bhk")) {
				if (aptList.size() > 0) {
					for (Apartments apartments : aptList) {
						if (type.equalsIgnoreCase(apartments.getType())) {

							System.out.println("Below apartments are availabel");
							System.out.println("Apartment ID " + apartments.getAptId());
							System.out.println("Apartment Type" + apartments.getType());
							System.out.println("Apartment Rent " + apartments.getRent());
							if (!propertyAgents.isEmpty()) {
								for (String agent : apartments.getAptMap().get(apartments.getAptId())) {
									System.out.println("Apartment agent " + agent);
								}
								return true;
							} else {
								System.out.println("There must be one property agent.");
								return false;
							}
						} else {
							System.out.println("No apartment availabel");
							return false;
						}
					}
					return true;
				} else {
					System.out.println("No apartment availabel");
					return false;
				}
			} else {
				System.out.println("Search type must be like 1bhk, 2bhk or 3bhk");
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean displayAllApartments() {
		try {
			if (aptList.size() > 0) {
				System.out.println("Below apartments are availabel");
				for (Apartments apartments : aptList) {
					System.out.println("Below apartments are availabel");
					System.out.println("Apartment ID " + apartments.getAptId());
					System.out.println("Apartment Type" + apartments.getType());
					System.out.println("Apartment Rent " + apartments.getRent());
					for (String agent : apartments.getAptMap().get(apartments.getAptId())) {
						System.out.println("Apartment agent " + agent);
					}
				}
				return true;
			} else {
				System.out.println("No apartment availabel");
				return false;
			}
		} catch (Exception e) {
			return false;
		}
	}
}
