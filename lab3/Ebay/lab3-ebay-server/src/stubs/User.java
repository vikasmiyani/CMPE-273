package stubs;

import java.sql.Date;
import java.sql.Timestamp;

public class User {
	public int id;
	public String fname;
	public String lname;
	public String email;
	public String password;
	public String bdate;
	public String phone;
	public String last_logged_in;
	public String line_1;
	public String city;
	public String state;
	public String zipcode;
	public String country;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getFname() {
		return fname;
	}

	public void setFname(String fname) {
		this.fname = fname;
	}

	public String getLname() {
		return lname;
	}

	public void setLname(String lname) {
		this.lname = lname;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getBdate() {
		return bdate;
	}

	public void setBdate(String bdate) {
		this.bdate = bdate;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getLast_logged_in() {
		return last_logged_in;
	}

	public void setLast_logged_in(String last_logged_in) {
		this.last_logged_in = last_logged_in;
	}

	public String getLine_1() {
		return line_1;
	}

	public void setLine_1(String line_1) {
		this.line_1 = line_1;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getZipcode() {
		return zipcode;
	}

	public void setZipcode(String zipcode) {
		this.zipcode = zipcode;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}
}
