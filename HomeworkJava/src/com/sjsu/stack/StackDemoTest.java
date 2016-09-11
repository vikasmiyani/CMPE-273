package com.sjsu.stack;

import static org.junit.Assert.*;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class StackDemoTest {

	static StackDemo sd;
	static int size;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {

		System.out.println("Your business card holder : ");
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}

	@Before
	public void setUp() throws Exception {
		size = 5;
		sd = new StackDemo(size);
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testPlaceCard() {
		for (int i = 0; i < size; i++) {
			String businessCard = "card"+i+1;
			assertTrue(sd.placeCard(businessCard));
			System.out.println(businessCard);
		}
		assertFalse(sd.placeCard("Card6"));
	}

	@Test
	public void testRemoveCard() {
		for (int i = 0; i < size; i++) {
			String businessCard = "card"+i+1;
			sd.placeCard(businessCard);
			System.out.println(businessCard);
		}
		for (int i = size-1; i >= 0; i--) {
			String card = sd.removeCard();
			assertEquals("card"+i+1, card);	
		}
		assertNull(sd.removeCard());
	}

	@Test
	public void testPeekAnyCard() {
		
		assertNull(sd.peekAnyCard());
		sd.placeCard("Essx");
		assertEquals("Essx",sd.peekAnyCard());
	

	}

	@Test
	public void testDisplayAllCard() {
		for (int i = 0; i < size; i++) {
			String businessCard = "card"+i+1;
			sd.placeCard(businessCard);
			System.out.println(businessCard);
		}
		assertTrue(sd.displayAllCard());
		
		for (int i = 0; i < size; i++) {
			sd.removeCard();
		}
		assertFalse(sd.displayAllCard());
		
	}

}
