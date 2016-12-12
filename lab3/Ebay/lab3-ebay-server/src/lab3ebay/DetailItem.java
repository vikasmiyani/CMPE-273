package lab3ebay;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;

import javax.jws.WebService;
import org.json.JSONObject;
import com.google.gson.Gson;

@WebService
public class DetailItem {
	MySQL mysql = new MySQL();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	SimpleDateFormat sdf_last_login = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");

	public String getItemDetails(int item_id) {
		JSONObject response = new JSONObject();
		
		String sql = "select s.id as s_id, s.quantity, u.first_name, u.city, i.* from users u, items i, sellers_data s where s.item_id = i.id and s.user_id = u.user_id and i.id <> '"+item_id+"' ";
		
		try {
			Connection conn = mysql.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			if (rs.next()) {
				response.put("status", 200);
				response.put("id", rs.getInt("id"));
				response.put("user_id", rs.getInt("user_id"));
				response.put("name", rs.getString("name"));
				response.put("description", rs.getString("description"));
				response.put("price", rs.getDouble("price"));
				response.put("quantity", rs.getInt("quantity"));
				response.put("bidding_price", rs.getDouble("bidding_price"));
				response.put("is_bidding", rs.getByte("is_bidding"));
				response.put("bidding_due_time", (rs.getTimestamp("bidding_due_time") != null)
						? sdf_last_login.format(rs.getTimestamp("bidding_due_time")) : "");
				response.put("isSold", rs.getByte("isSold"));
				response.put("first_name", rs.getString("first_name"));
				response.put("last_name", rs.getString("last_name"));
				response.put("city", rs.getString("city"));
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
