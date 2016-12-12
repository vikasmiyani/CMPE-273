package lab3ebay;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import javax.jws.WebService;
import com.google.gson.Gson;

import stubs.Item;

@WebService
public class Index {
	MySQL mysql = new MySQL();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	SimpleDateFormat sdf_last_login = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");

	public String getItems(int user_id) {
		ArrayList<Item> response = new ArrayList<Item>();
		String sql;
		if (user_id > 0) {
			 sql = "select s.id as s_id, s.quantity, u.first_name, u.city, i.* from users u, items i, sellers_data s where s.item_id = i.id and s.user_id = u.user_id and i.id <> '"+user_id+"' ";
		} else {
			 sql = "select s.id as s_id, s.quantity, u.first_name, u.city, i.* from users u, items i, sellers_data s where s.item_id = i.id and s.user_id = u.user_id";
		}
		try {
			Connection conn = mysql.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()) {
				Item item = new Item();
				item.setId(rs.getInt("id"));
				item.setUser_id(rs.getInt("user_id"));
				item.setName(rs.getString("name"));
				item.setDescription(rs.getString("description"));
				item.setPrice(rs.getDouble("price"));
				item.setQuantity(rs.getInt("quantity"));
				item.setBidding_price(rs.getDouble("bidding_price"));
				item.setIs_bidding(rs.getByte("is_bidding"));
				item.setBidding_due_time((rs.getTimestamp("bidding_due_time") != null)
						? sdf_last_login.format(rs.getTimestamp("bidding_due_time")) : "");
				item.setIs_sold(rs.getByte("isSold"));
				response.add(item);
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
