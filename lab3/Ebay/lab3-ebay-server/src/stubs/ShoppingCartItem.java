package stubs;

public class ShoppingCartItem {
	public int id;
	public int user_id;
	public String name;
	public String description;
	public double price;
	public int quantity;
	public Double bidding_price;
	public byte is_bidding;
	public String bidding_due_time;
	public byte is_sold;
	public int selected_quantity;
	public String fname;
	public String date;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUser_id() {
		return user_id;
	}

	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public Double getBidding_price() {
		return bidding_price;
	}

	public void setBidding_price(Double bidding_price) {
		this.bidding_price = bidding_price;
	}

	public byte getIs_bidding() {
		return is_bidding;
	}

	public void setIs_bidding(byte is_bidding) {
		this.is_bidding = is_bidding;
	}

	public String getBidding_due_time() {
		return bidding_due_time;
	}

	public void setBidding_due_time(String bidding_due_time) {
		this.bidding_due_time = bidding_due_time;
	}

	public byte getIs_sold() {
		return is_sold;
	}

	public void setIs_sold(byte is_sold) {
		this.is_sold = is_sold;
	}

	public int getSelected_quantity() {
		return selected_quantity;
	}

	public void setSelected_quantity(int selected_quantity) {
		this.selected_quantity = selected_quantity;
	}

	public String getFname() {
		return fname;
	}

	public void setFname(String fname) {
		this.fname = fname;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}
}
