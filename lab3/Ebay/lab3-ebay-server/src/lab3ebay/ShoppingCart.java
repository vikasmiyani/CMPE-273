package lab3ebay;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.jws.WebService;

import org.json.JSONArray;
import org.json.JSONObject;
import com.google.gson.Gson;

import stubs.ShoppingCartItem;

@WebService
public class ShoppingCart {
	MySQL mysql = new MySQL();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	SimpleDateFormat sdf_last_login = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
	SimpleDateFormat sdf_timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	public String getCartItems(int user_id) {
		JSONArray res = new JSONArray();
		String sql = "select u.first_name, u.user_id, i.*, sc.id as sc_id, sc.quantity as ord_quantity, sd.quantity as sd_qty, sd.id as sd_id,sd.user_id from users u, sellers_data sd, items i, shopping_cart sc where sd.id = sc.seller_id and sd.user_id = u.user_id and sd.item_id = i.id and sc.user_id = '"+user_id+"'";
		Gson gson = new Gson();
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
				cart.setSelected_quantity(rs.getInt("selected_quantity"));
				cart.setFname(rs.getString("first_name"));
				res.put(cart);
			}
			rs.close();
			stmt.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		System.out.println(res);
		return gson.toJson(res);
	}

	public String placeBid(int user_id, int item_id, double bid) {
		System.out.println(user_id + ":" + item_id + ":" + bid);
		JSONObject res = new JSONObject();
		String sql = "UPDATE items SET bidding_price='"+bid+"' WHERE id='"+item_id+"'" +
				" and bidding_due_time_stamp > current_timestamp and bidding_price <'"+bid+"'";
		try {
			Connection conn = mysql.getConnection();
			PreparedStatement preparedStatement = conn.prepareStatement(sql);
			preparedStatement.setTimestamp(1, new java.sql.Timestamp(new Date().getTime()));
			if (preparedStatement.executeUpdate() > 0) {
				sql = "INSERT INTO bidding SET ? ";
				Statement stmt = conn.createStatement();
				stmt.execute(sql);
				stmt.close();
				res.put("status", 200);
			} else {
				res.put("status", 400);
			}
			preparedStatement.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		System.out.println(res);
		return new Gson().toJson(res);
	}

	public String addToCart(int user_id, int item_id, int quantity) {
		JSONObject res = new JSONObject();
		String sql = "select quantity from shopping_cart WHERE seller_id='"+user_id+"' and user_id='"+user_id+"'";
		try {
			Connection conn = mysql.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			if (rs.next()) {
				if (rs.getInt("quantity") > quantity) {
					sql = "INSERT INTO shopping_cart SET ?";
					stmt.execute(sql);
					res.put("status", 200);
				} else {
					res.put("status", 400);
				}
			} else {
				res.put("status", 400);
			}
			rs.close();
			stmt.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		System.out.println(res);
		return new Gson().toJson(res);
	}

	public String removeCartItem(int user_id, int item_id) {
		JSONObject res = new JSONObject();
		String sql = "DELETE FROM shopping_cart WHERE id='"+item_id+"'";
		try {
			Connection conn = mysql.getConnection();
			Statement stmt = conn.createStatement();
			stmt.execute(sql);
			res.put("status", 200);
			stmt.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		System.out.println(res);
		return new Gson().toJson(res);
	}
}
