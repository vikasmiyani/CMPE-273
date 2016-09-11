package com.sjsu.generics;

import static org.junit.Assert.*;

import java.util.ArrayList;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class GenericsDemoTest {

	GenericsDemo gd;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}

	@Before
	public void setUp() throws Exception {
		gd = new GenericsDemo();
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testAddProductInfo() {
		ArrayList<String> product_list = new ArrayList<>();
		assertFalse(gd.addProductInfo(product_list));

		product_list.add("iPhone7");
		product_list.add("AirPods");
		product_list.add("Moscato italian Vine");

		assertTrue(gd.addProductInfo(product_list));
	}

	@Test
	public void testAddContactDetails() {

		Object email_id = "abc.123@gmail.com";
		Object ph_num = "123-678-8900";

		assertFalse(gd.addContactDetails(email_id, ph_num));
		ph_num = "1236788900";

		assertTrue(gd.addContactDetails(email_id, ph_num));

	}

	@Test
	public void testAddCardDetails() {
		Object card_type = "VISA";

		assertTrue(gd.addCardDetails(card_type));
	}

}
