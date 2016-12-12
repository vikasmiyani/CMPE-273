package lab3calculator;

import javax.jws.WebService;

@WebService
public class Calculator {
	public double add(double arg1, double arg2) {
		return arg1 + arg2;
	}

	public double subtract(double arg1, double arg2) {
		return arg1 - arg2;
	}

	public double multiply(double arg1, double arg2) {
		return arg1 * arg2;
	}

	public double divide(double arg1, double arg2) {
		if (arg2 != 0) {
			return arg1 / arg2;
		}else{
			return Double.NEGATIVE_INFINITY;
		}
	}
}
