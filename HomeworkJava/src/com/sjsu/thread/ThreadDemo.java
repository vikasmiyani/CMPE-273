package com.sjsu.thread;

class AccountOperation {

	static double balance;

	protected double depositMoney(double amount) {
		balance += amount;
		return balance;
	}

	protected double withdrawal(double amount) {
		balance -= amount;
		return balance;
	}

	protected double showBalance() {
		return balance;
	}
}

class TestThread extends Thread {

	private Thread thrd;
	private String thrdName;
	AccountOperation ao;
	double amount;

	public TestThread(String thrdName, double amount, AccountOperation ao) {
		this.thrdName = thrdName;
		this.ao = ao;
		this.amount = amount;
	}

	public TestThread(String thrdName, AccountOperation ao) {
		this.thrdName = thrdName;
		this.ao = ao;
	}

	@Override
	public void run() {

		synchronized (ao) {
			if (thrdName.equalsIgnoreCase("desposit")) {
				System.out.println("After deposit your balance " + ao.depositMoney(amount));

			} else if (thrdName.equalsIgnoreCase("withdrawal")) {
				System.out.println("After withdrawal your balance " + ao.withdrawal(amount));

			} else {
				System.out.println("Your balance " + ao.showBalance());
			}
		}

	}

	public void start() {
		System.out.println("Thread started " + thrdName);
		if (thrd == null) {
			thrd = new Thread(this, thrdName);
			thrd.start();
		}
	}

}

public class ThreadDemo {

	public boolean accountActivity() {

		AccountOperation ao = new AccountOperation();

		TestThread deposit = new TestThread("desposit", 200, ao);
		TestThread withdrawal = new TestThread("withdrawal", 20, ao);
		TestThread showBalance = new TestThread("accountBalance", ao);

		deposit.start();
		withdrawal.start();
		showBalance.start();
		// wait for threads to end
		try {
			deposit.join();
			withdrawal.join();
			showBalance.join();

		} catch (Exception e) {
			System.out.println("Interrupted");
			return false;
		}
		return true;
	}

}
