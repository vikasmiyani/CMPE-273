package com.sjsu.arrays;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class ArraysDemoTest {

	ArraysDemo ad;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {

		System.out.println("Your favourite car list");

	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {

	}

	@Before
	public void setUp() throws Exception {
		ad = new ArraysDemo();
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testAddFavCar() {
		System.out.println("Add a new fav car: ");
		assertTrue(ad.addFavCar("Audi"));
	}

	@Test
	public void testRemoveFavCar() {
		String carName = "Audi";
		ad.addFavCar(carName);
		assertTrue(ad.removeFavCar(carName));
		carName = "BMW";
		assertFalse(ad.removeFavCar(carName));
	}

	@Test
	public void testSearchYourFavCar() {
		String carName = "Audi";
		assertFalse(ad.searchYourFavCar(carName));
		ad.addFavCar(carName);
		assertTrue(ad.searchYourFavCar(carName));
		carName = "BMW";
		assertFalse(ad.searchYourFavCar(carName));
	}

}
