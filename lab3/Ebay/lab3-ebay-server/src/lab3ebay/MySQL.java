package lab3ebay;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class MySQL {
	// JDBC driver name and database URL
	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	static final String DB_URL = "jdbc:mysql://localhost:3306/ebay?autoReconnect=true&useSSL=false";

	// Database credentials
	static final String USER = "ebay-server";
	static final String PASS = "password123";
	Connection conn = null;

	public Connection getConnection() {
		try {
			if (conn == null || conn.isClosed()) {
				Class.forName("com.mysql.jdbc.Driver");
				conn = DriverManager.getConnection(DB_URL, USER, PASS);
			}
			return conn;
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}

	public void closeConnection() {
		try {
			if (conn != null && !conn.isClosed()) {
				conn.close();
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
}
