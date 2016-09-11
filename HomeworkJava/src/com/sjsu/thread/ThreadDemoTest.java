package com.sjsu.thread;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class ThreadDemoTest {

	ThreadDemo td;

	@Before
	public void setUp() throws Exception {
		td = new ThreadDemo();
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testAccountActivity() {
		assertNotNull(td);
		assertTrue(td.accountActivity());
		// assertTrue(true == td.accountActivity());

	}

}
