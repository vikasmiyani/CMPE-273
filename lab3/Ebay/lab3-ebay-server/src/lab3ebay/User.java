package lab3ebay;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;

import javax.jws.WebService;

import org.json.JSONArray;
import org.json.JSONObject;
import com.google.gson.Gson;

import stubs.ShoppingCartItem;

@WebService
public class User {
	MySQL mysql = new MySQL();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	SimpleDateFormat sdf_last_login = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");

	public String getUserDetails(int user_id) {
		JSONObject response = new JSONObject();
		String sql = "select * from users where user_id='"
				+ user_id + "'";
		try {
			Connection conn = mysql.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			if (rs.next()) {
				response.put("id", user_id);
				response.put("status", 200);
				response.put("first_name", rs.getString("first_name"));
				response.put("last_name", rs.getString("last_name"));
				response.put("email", rs.getString("email"));
				response.put("dob", (rs.getDate("dob") != null) ? sdf.format(rs.getDate("dob")) : "");
				response.put("phone", rs.getString("phone"));
				response.put("last_logged_in", (rs.getTimestamp("last_logged_in") != null)
						? sdf_last_login.format(rs.getTimestamp("last_logged_in")) : "");
				response.put("line_1", rs.getString("line_1"));
				response.put("cartty", rs.getString("cartty"));
				response.put("state", rs.getString("state"));
				response.put("zip", rs.getString("zip"));
				response.put("country", rs.getString("country"));
			}
			rs.close();
			stmt.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		System.out.println(response);
		return new Gson().toJson(response);
	}

	public String saveUserDetails(int user_id, String fname, String lname, String phone, String bdate, String line_1,
			String cartty, String state, String zipcode) {
		JSONObject response = new JSONObject();
		String sql = "UPDATE users SET ? WHERE ? ";
		try {
			Connection conn = mysql.getConnection();
			Statement stmt = conn.createStatement();
			if (stmt.execute(sql)) {
				response.put("status", 200);
			} else {
				response.put("status", 400);
			}
			stmt.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		System.out.println(response);
		return new Gson().toJson(response);
	}

	public String getBaughtItems(int user_id) {
		JSONArray response = new JSONArray();
		String sql = "select i.*, sd.quantity as quantity, SUM(bd.quantity) as sold_quantity from sellers_data as sd Join items as i on i.id = sd.item_id Left Join buyers_data as bd on bd.item_id = i.id where sd.user_id = '"
			+ user_id + "'group by i.id";
		try {
			Connection conn = mysql.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()) {
				ShoppingCartItem cart = new ShoppingCartItem();
				cart.setId(rs.getInt("id"));
				cart.setUser_id(rs.getInt("user_id"));
				cart.setName(rs.getString("name"));
				cart.setDescription(rs.getString("description"));
				cart.setPrice(rs.getDouble("price"));
				cart.setQuantity(rs.getInt("quantity"));
				cart.setBidding_price(rs.getDouble("bidding_price"));
				cart.setIs_bidding(rs.getByte("is_bidding"));
				cart.setBidding_due_time((rs.getTimestamp("bidding_due_time") != null)
						? sdf_last_login.format(rs.getTimestamp("bidding_due_time")) : "");
				cart.setIs_sold(rs.getByte("is_sold"));
				cart.setSelected_quantity(rs.getInt("selected_quantity"));
				cart.setDate(sdf.format(rs.getDate("date")));
				response.put(cart);
			}
			rs.close();
			stmt.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		System.out.println(response);
		return new Gson().toJson(response);
	}

	public String getSoldItems(int user_id) {
		JSONArray response = new JSONArray();
		String sql = "select i.*, sum(bd.quantity) as quantity from buyers_data as bd, items as i where i.id = bd.item_id and bd.user_id = '"
			+ user_id + "' GROUP BY i.id";
		try {
			Connection conn = mysql.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()) {
				ShoppingCartItem cart = new ShoppingCartItem();
				cart.setId(rs.getInt("id"));
				cart.setUser_id(rs.getInt("user_id"));
				cart.setName(rs.getString("name"));
				cart.setDescription(rs.getString("description"));
				cart.setPrice(rs.getDouble("price"));
				cart.setQuantity(rs.getInt("quantity"));
				cart.setBidding_price(rs.getDouble("bidding_price"));
				cart.setIs_bidding(rs.getByte("is_bidding"));
				cart.setBidding_due_time((rs.getTimestamp("bidding_due_time") != null)
						? sdf_last_login.format(rs.getTimestamp("bidding_due_time")) : "");
				cart.setIs_sold(rs.getByte("isSold"));
				response.put(cart);
			}
			rs.close();
			stmt.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		System.out.println(response);
		return new Gson().toJson(response);
	}

	public String getAuctionItems(int user_id) {
		JSONArray response = new JSONArray();
		String sql = "select i.*, sum(bd.quantity) as quantity from buyers_data as bd, items as i where i.id = bd.item_id and bd.user_id = '"
			+ user_id + "' GROUP BY i.id";
		try {
			Connection conn = mysql.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()) {
				ShoppingCartItem cart = new ShoppingCartItem();
				cart.setId(rs.getInt("id"));
				cart.setUser_id(rs.getInt("user_id"));
				cart.setName(rs.getString("name"));
				cart.setDescription(rs.getString("description"));
				cart.setPrice(rs.getDouble("price"));
				cart.setQuantity(rs.getInt("quantity"));
				cart.setBidding_price(rs.getDouble("bidding_price"));
				cart.setIs_bidding(rs.getByte("is_bidding"));
				cart.setBidding_due_time((rs.getTimestamp("bidding_due_time") != null)
						? sdf_last_login.format(rs.getTimestamp("bidding_due_time")) : "");
				cart.setIs_sold(rs.getByte("isSold"));
				response.put(cart);
			}
			rs.close();
			stmt.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		System.out.println(response);
		return new Gson().toJson(response);
	}
}
