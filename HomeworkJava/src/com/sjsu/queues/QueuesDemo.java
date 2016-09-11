package com.sjsu.queues;

import java.util.ArrayList;

public class QueuesDemo {

	private ArrayList<String> meetingRoom;
	private int availabelSeats;

	public QueuesDemo(int totalSeatsAvailabel) {
		availabelSeats = totalSeatsAvailabel;
		meetingRoom = new ArrayList<String>();
	}

	// enqueue
	public boolean addMemeber(String name) {
		if (!isMeetingRoomFull()) {
			return meetingRoom.add(name);
		} else {
			System.out.println("Sorry!! All the seats are taken.");
			return false;
		}
	}

	// dequeue
	public String seatsAssigned() {
		if (!isSeatAvailabel()) {
			System.out.println("Member has been assigned a seat.");
			return meetingRoom.remove(0);
		} else {
			return null;
		}
	}

	public boolean isSeatAvailabel() {
		// TODO Auto-generated method stub
		return (getSize() == 0);
	}

	public boolean isMeetingRoomFull() {
		// TODO Auto-generated method stub
		return (getSize() == availabelSeats);
	}

	public int getSize() {
		// TODO Auto-generated method stub

		return meetingRoom.size();
	}

	public boolean displayAllMember() {
		String disp;
		boolean isDisplay;
		if (!isSeatAvailabel()) {
			disp = "Below are the name of all the members who are in meeting room. \n";
			for (String member : meetingRoom) {
				disp += member + "\n";
			}
			isDisplay = true;
		} else {

			disp = "No member is in meeting room.";
			isDisplay = false;
		}

		System.out.println(disp);
		return isDisplay;
	}

}
