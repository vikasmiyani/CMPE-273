package com.sjsu.queues;

import static org.junit.Assert.*;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class QueuesDemoTest {

	static QueuesDemo qd;
	static int size;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {

		System.out.println("Welcome to Member in meeting room:\n");
		
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {

	}

	@Before
	public void setUp() throws Exception {
		size = 5;
		qd = new QueuesDemo(size);
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void test1() {
		
		for (int i = 0; i < size; i++) {
			String memberName = "Member"+i+1;
			assertTrue(qd.addMemeber(memberName));
			System.out.println(memberName);
		}
		assertFalse(qd.addMemeber("Member6"));
	}

	@Test
	public void test2() {

		for (int i = 0; i < size; i++) {
			String memberName = "Member"+i+1;
			qd.addMemeber(memberName);
			System.out.println(memberName);
		}
		for (int i = 0; i < size; i++) {
			String rs = qd.seatsAssigned();
			assertEquals("Member"+i+1, rs);
		}
		assertNull(qd.seatsAssigned());
	}

	@Test
	public void test3() {
		
		for (int i = 0; i < size; i++) {
			String memberName = "Member"+i+1;
			qd.addMemeber(memberName);
			System.out.println(memberName);
		}
		assertTrue(qd.displayAllMember());
		for (int i = 0; i < size; i++) {
			qd.seatsAssigned();
		}
		assertFalse(qd.displayAllMember());

	}

}
