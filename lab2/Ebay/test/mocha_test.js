/**
 * http://usejsdoc.org/
 */
/**
 * New node file
 */
var request = require('request');
var express = require('express');
var assert = require("assert");
var http = require("http");

describe('Signin test', function(){

	it('Unit test case for signin', function(done) {
		request.post(
			    'http://localhost:3000/signin',
			    { form: { email_id: 'vicky.miyani@gmail.com',password:'1234' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
    });
	

	it('Unit Test for fetching item list for homepage', function(done) {
		request.get(
			    'http://localhost:3000/itemList',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Unit Test for fetching single item for detailpage', function(done) {
		request.get(
			    'http://localhost:3000/fetchDetail/581ed512609dded458da6774',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Unit Test for fetching items for shopping cart detail', function(done) {
		request.get(
			    'http://localhost:3000/fetchShoppingDetail',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Unit Test for searching items', function(done) {
		request.get(
			    'http://localhost:3000/searchItemList/ta',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Unit Test for displaying order history', function(done) {
		request.get(
			    'http://localhost:3000/orderHis',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Unit Test for displaying selling history', function(done) {
		request.get(
			    'http://localhost:3000/sellingHis',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	it('Unit Test for signout', function(done) {
		request.get(
			    'http://localhost:3000/signout',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	it('Unit Test for accountdetails', function(done) {
		request.get(
			    'http://localhost:3000/accountDetails',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Unit Test for validating card', function(done) {
		request.post(
			    'http://localhost:3000/validateCard',
			    {form:{cardNumber:1234567812345678,expMonth:11,expYear:2016,cvvNumber:222}},
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	
});