package stubs;

public class SignIn {
	public int status = 400;
	public String result;
	public String fname;
	public String last_logged_in;
	public int id;

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public String getFname() {
		return fname;
	}

	public void setFname(String fname) {
		this.fname = fname;
	}

	public String getLast_logged_in() {
		return last_logged_in;
	}

	public void setLast_logged_in(String last_logged_in) {
		this.last_logged_in = last_logged_in;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
}
