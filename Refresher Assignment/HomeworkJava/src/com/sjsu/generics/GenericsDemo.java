package com.sjsu.generics;

import java.util.ArrayList;
import java.util.Iterator;

public class GenericsDemo {

	public boolean addProductInfo(ArrayList<String> product_list) {
		ArrayList<String> productList = product_list;

		if (productList.size() != 0) {
			ShoppingCart<ArrayList<String>> sc = new ShoppingCart<ArrayList<String>>(productList);

			System.out.println("Here is the list of product you have selected");

			ArrayList<String> selectedProdList = sc.getObject();
			Iterator<String> itr = selectedProdList.iterator();
			while (itr.hasNext()) {
				String product = (String) itr.next();
				System.out.println(product);
			}
			return true;
		} else {
			System.out.println("You have not selected any product.");
			return false;
		}

	}

	public boolean addContactDetails(Object email_id, Object ph_num) {

		String emailID = email_id.toString();

		ShoppingCart<String> emailObj = new ShoppingCart<String>(emailID);
		System.out.println("You have entered this email address");
		System.out.println(emailObj.getObject());

		try {
			Long phNum = Long.parseLong(ph_num.toString());
			ShoppingCart<Long> phObj = new ShoppingCart<Long>(phNum);
			System.out.println("You have entered this phone number");
			System.out.println(phObj.getObject());

		} catch (Exception e) {
			System.out.println("Phone number must be numeric.");
			return false;
		}

		return true;
	}

	public boolean addCardDetails(Object c_type) {

		String carDtype = c_type.toString();
		ShoppingCart<String> cardObj = new ShoppingCart<String>(carDtype);
		System.out.println("You have entered " + cardObj.getObject() + " as a type. Now please swipe your card.");

		return true;

	}
}
