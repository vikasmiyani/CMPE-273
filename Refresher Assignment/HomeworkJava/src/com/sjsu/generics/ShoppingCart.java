package com.sjsu.generics;

public class ShoppingCart<T> {

	T object;

	public ShoppingCart(T object) {
		this.object = object;
	}
	public T getObject() {
		return object;
	}

	public void setObject(T object) {
		this.object = object;
	}
}
