package lab3ebay;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.jws.WebService;
import org.json.JSONObject;
import com.google.gson.Gson;

import stubs.Item;

@WebService
public class Payment {
	MySQL mysql = new MySQL();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	SimpleDateFormat sdf_last_login = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");

	public String pay(int user_id, boolean is_cart, int item_id, int quantity) {
		JSONObject res = new JSONObject();
		String sql = "";
		if (is_cart) {
			String sqlSellerUpdateQuery = "insert into selleresultSet_data (id,user_id,item_id,quantity) values ? on duplicate key update quantity = IF(quantity < VALUES(quantity), quantity, quantity -  values(quantity))";
			try {
				Connection conn = mysql.getConnection();
				Statement stmt = conn.createStatement();
				ResultSet resultSet = stmt.executeQuery(sql);
				int total_amount = 0;
				List<Item> items = new ArrayList<>();
				while (resultSet.next()) {
					Item item = new Item();
					item.setId(resultSet.getInt("item_id"));
					item.setQuantity(resultSet.getInt("quantity"));
					item.setPrice(resultSet.getDouble("price"));
					total_amount += item.getQuantity() * item.getPrice();
					items.add(item);
				}
				sql = "UPDATE items i, selleresultSet_data sd SET  i.isSold = 1 WHERE  i.id = sd.item_id AND sd.quantity = 0";
				PreparedStatement prest = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
				prest.setDate(1, new java.sql.Date(new Date().getTime()));
				prest.executeUpdate();
				ResultSet resultSet1 = prest.getGeneratedKeys();
				if (resultSet1.next()) {
					int order_id = resultSet1.getInt(1);
					String insertSql = "DELETE FROM shopping_cart WHERE user_id='"+user_id+"'";
					PreparedStatement pstmt = conn.prepareStatement(insertSql);
					int[] ids = new int[items.size()];
					int i = 0;
					String query1 = "";
					String query2 = "";
					for (Item item : items) {
						pstmt.setInt(1, order_id);
						pstmt.setInt(2, item.getId());
						pstmt.setInt(3, item.getQuantity());
						pstmt.addBatch();
						ids[i++] = item.getId();
						query1 += "WHEN id='" + item.getId() + "' THEN (quantity - '" + item.getQuantity() + "') ";
						query2 += "WHEN id='" + item.getId() + "' THEN IF(quantity=0,1,0) ";
					}
					pstmt.executeBatch();
					pstmt.close();
					sql = "UPDATE item SET quantity = CASE " + query1 + "END WHERE id IN (" + ids + ")";
					stmt.execute(sql);
					sql = "UPDATE item SET is_sold = CASE " + query2 + "END WHERE id IN (" + ids + ")";
					stmt.execute(sql);
					sql = "DELETE FROM cart WHERE user_id=" + user_id;
					stmt.execute(sql);
					res.put("status", 200);
				} else {
					res.put("status", 400);
				}
				resultSet.close();
				stmt.close();
			} catch (Exception ex) {
				ex.printStackTrace();
				res.put("status", 400);
			}
		} else {
			sql = "SELECT i.* FROM item i WHERE i.id='" + item_id + "'";
			try {
				Connection conn = mysql.getConnection();
				Statement stmt = conn.createStatement();
				ResultSet resultSet = stmt.executeQuery(sql);
				if (resultSet.next()) {
					int item_quantity = resultSet.getInt("quantity");
					if (item_quantity >= quantity) {
						double total = quantity * resultSet.getDouble("price");
						sql = "INSERT INTO orderesultSet VALUES(DEFAULT, '" + user_id + "', ?, '" + total + "')";
						PreparedStatement prest = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
						prest.setDate(1, new java.sql.Date(new Date().getTime()));
						prest.executeUpdate();
						ResultSet resultSet1 = prest.getGeneratedKeys();
						if (resultSet1.next()) {
							int order_id = resultSet1.getInt(1);
							byte is_sold = (item_quantity == quantity) ? (byte) 1 : (byte) 0;
							sql = "INSERT INTO order_item VALUES(DEFAULT, '" + order_id + "', '" + item_id + "', '"
									+ quantity + "')";
							if (stmt.executeUpdate(sql) > 0) {
								sql = "UPDATE item SET quantity = '" + (item_quantity - quantity) + "', is_sold=b'"
										+ is_sold + "' WHERE id=" + item_id;
								if (stmt.executeUpdate(sql) > 0) {
									res.put("status", 200);
								} else {
									res.put("status", 400);
								}
							} else {
								res.put("status", 400);
							}
						} else {
							res.put("status", 400);
						}
						resultSet1.close();
						prest.close();
					} else {
						res.put("status", 400);
					}
				} else {
					res.put("status", 400);
				}
				resultSet.close();
				stmt.close();
			} catch (Exception ex) {
				ex.printStackTrace();
				res.put("status", 400);
			}
		}
		System.out.println(res);
		return new Gson().toJson(res);
	}
}
