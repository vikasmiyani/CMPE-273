package com.sjsu.collection;

import static org.junit.Assert.*;

import java.util.ArrayList;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class CollectionsDemoTest {

	CollectionsDemo cd;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}

	@Before
	public void setUp() throws Exception {
		cd = new CollectionsDemo();
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testAddApartmentDetails() {
		Object a_id = 101;
		Object a_type = "1bhk";
		Object a_rent = 3286;
		ArrayList<String> a_propertyAgents = new ArrayList<>();
		a_propertyAgents.add("Essx");
		a_propertyAgents.add("Villa Torino");

		assertTrue(cd.addApartmentDetails(a_id, a_type, a_rent, a_propertyAgents));

		a_id = "abc1";

		assertFalse(cd.addApartmentDetails(a_id, a_type, a_rent, a_propertyAgents));

		a_id = 101;
		a_rent = "Twenty two hundred";

		assertFalse(cd.addApartmentDetails(a_id, a_type, a_rent, a_propertyAgents));

		a_rent = 3286;
		a_type = "one bhk";

		assertFalse(cd.addApartmentDetails(a_id, a_type, a_rent, a_propertyAgents));

		a_type = "1bhk";
		a_propertyAgents.clear();

		assertFalse(cd.addApartmentDetails(a_id, a_type, a_rent, a_propertyAgents));

	}

	@Test
	public void testSearchApartmentByType() {

		Object a_type = "1bhk";

		assertFalse(cd.searchApartmentByType(a_type));

		Object a_id = 101;
		Object a_rent = 3286;
		ArrayList<String> a_propertyAgents = new ArrayList<>();
		a_propertyAgents.add("Essx");
		a_propertyAgents.add("Villa Torino");

		cd.addApartmentDetails(a_id, a_type, a_rent, a_propertyAgents);

		assertTrue(cd.searchApartmentByType(a_type));

		a_type = "one bhk";

		assertFalse(cd.searchApartmentByType(a_type));

		a_type = "1bhk";
		a_propertyAgents.clear();

		assertFalse(cd.searchApartmentByType(a_type));

	}

	@Test
	public void testDisplayAllApartments() {

		assertFalse(cd.displayAllApartments());

		Object a_id = 101;
		Object a_type = "1bhk";
		Object a_rent = 3286;
		ArrayList<String> a_propertyAgents = new ArrayList<>();
		a_propertyAgents.add("Essx");
		a_propertyAgents.add("Villa Torino");

		cd.addApartmentDetails(a_id, a_type, a_rent, a_propertyAgents);

		assertTrue(cd.displayAllApartments());

	}

}
