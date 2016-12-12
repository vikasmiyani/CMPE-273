package lab3ebay;

import java.sql.Connection;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import javax.jws.WebService;

import com.google.gson.Gson;

import stubs.UserRegistration;
import stubs.SignIn;

@WebService
public class Auth {

	MySQL mysql = new MySQL();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	SimpleDateFormat sdf_last_login = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");

	public String signin(String username, String password) {
		username = username.toLowerCase();
		SignIn response = new SignIn();
		String sql = "select password,user_id,first_name,last_name from users where email_id='"+username+"'";
		try {
			Connection conn = mysql.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			if (rs.next()) {
				String pass = rs.getString("password");
				if (password.equals(pass)) {
					response.setResult("Authentication Successful");
					response.setStatus(200);
					response.setFname(rs.getString("fname"));
					if (rs.getDate("last_logged_in") != null) {
						response.setLast_logged_in(sdf_last_login.format(rs.getTimestamp("last_logged_in")));
					}
					response.setId(rs.getInt("id"));
					
					sql = "UPDATE users SET last_access='"+new Timestamp(new java.util.Date().getTime())+"' WHERE user_id='"+username+"'"; 
					stmt.execute(sql);
				} else {
					response.setResult("Incorrect password");
				}
			} else {
				response.setResult("Email not registered");
			}
			rs.close();
			stmt.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return new Gson().toJson(response);
	}

	public String register(String fname, String lname, String email, String bdate, String phone,
			String password, String line_1, String city, String state, String zipcode) {
		email = email.toLowerCase();
		String sql = "Select * from users where email_id= '" + email + "'";
		UserRegistration response = new UserRegistration();
		try {
			Connection conn = mysql.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			if (rs.next()) {
				response.setStatus(400);
				response.setResult("Email already registered");
			} else {
				sql = "INSERT INTO users SET ?";
				stmt.execute(sql);
				response.setStatus(200);
				stmt.close();
			}
			rs.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		System.out.println(response);
		return new Gson().toJson(response);
	}
}
