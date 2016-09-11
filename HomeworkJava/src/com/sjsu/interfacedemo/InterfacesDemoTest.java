package com.sjsu.interfacedemo;

import static org.junit.Assert.*;

import java.util.Scanner;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class InterfacesDemoTest {

	static InterfacesDemo id;
	static Scanner in;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		id = new InterfacesDemo();
		in = new Scanner(System.in);
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
		in.close();
	}

	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testVehicleInfo() {

		assertNotNull(id);
		assertNotNull(in);

		System.out.println("Vehicle information:");
		System.out.println("Choices are below");
		System.out.println("1. Car");
		System.out.println("2. Bus");

		try {
			int c = in.nextInt();
			if (c >= 1 && c < 3) {
				assertTrue(true == id.vehicleInfo(in, c));
			} else {
				assertTrue(true != id.vehicleInfo(in, c));
			}
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("Choice must be int only");
		}

	}

}
