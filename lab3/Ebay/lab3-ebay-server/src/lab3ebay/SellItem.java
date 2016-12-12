package lab3ebay;

import java.sql.Connection;
import java.sql.Statement;
import java.text.SimpleDateFormat;

import javax.jws.WebService;
import org.json.JSONObject;
import com.google.gson.Gson;

@WebService
public class SellItem {
	MySQL mysql = new MySQL();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	SimpleDateFormat sdf_last_login = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");

	public String sellItem(int user_id, String name, String description, Double price, Integer quantity,
			Double bidding_price, Integer is_bidding, String bidding_due_time) {
		JSONObject response = new JSONObject();
		String sql = "INSERT INTO items SET ?";
		try {
			Connection conn = mysql.getConnection();
			Statement stmt = conn.createStatement();
			if (stmt.executeUpdate(sql) > 0) {
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
}
