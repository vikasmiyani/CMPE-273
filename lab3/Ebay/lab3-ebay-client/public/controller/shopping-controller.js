/**
 * http://usejsdoc.org/
 */
var app = angular.module('app',[]);

app.controller('shoppingController', function($scope,$window,$location,$http,$document) {
	
	$scope.isError = false;
	$scope.fetchShoppingDetail = function(){
		
		 $http.get('http://localhost:3000/fetchShoppingDetail/')
	      .success(function (data) {
	          	  var total = 0;
	          	  for (var i = 0; i < data.length; i++) {
	          		  data[i].subtotal = Math.round(Number(data[i].price) * Number(data[i].ord_quantity) * 100) / 100;
	          		  total = total + data[i].subtotal;
				}
	          	  $scope.total = Math.round(total * 100)/100;
	          		$scope.sales_tax = 4.29;	
	          		 $scope.grandtotal = Math.round((total + $scope.sales_tax) * 100)/100;
	          	  if(data.length === 0){
	          		 $scope.sales_tax = 0;	
	          		$scope.grandtotal = 0;
	          	  }
		          $scope.shoppingItem_list = data;
	      })
	      .error(function(data) {
	          console.log("Erro: "+data);
	      });
		
		
	};
	
	
	$scope.checkout = function(){
		
		console.log(JSON.stringify($scope.shoppingItem_list));
		
		$scope.isError = false;
		if($scope.shoppingItem_list.length > 0){
			  $scope.isError = false;
			var d = {isBuyItNow:false};
			$http.post('http://localhost:3000/payment/',d)
			  .success(function (data) {
		          console.log("Success" + data);
		          if(data.success){
		              $window.location.href = "http://localhost:3000/paymentPg";
		          }else{
		        	  $scope.isError = true;
		        	  $scope.errorMsg = "We are facing some issue. Please try again later.";
		          }
		      })
		      .error(function(data) {
		    	  $scope.isError = true;
		    	  $scope.errorMsg = "We are facing some issue. Please try again later.";
		      });
		}else{
			$scope.isError = true;
			$scope.errorMsg = "Your cart is empty.";
		}
	};
	
	
	
	
	
	$scope.update = function(i){
		
		var qty = this.qty;
		var sd_qty = $scope.shoppingItem_list[i].quantity;
		if(qty > 0 && qty !== undefined){
			  $scope.isError = false;
			if(qty <= sd_qty){
				  $scope.isError = false;
				var sc_id = $scope.shoppingItem_list[i]._id;
				var quantity = qty;
				var d = {sc_id:sc_id,quantity:quantity};
				console.log(sc_id);
				$http.post('http://localhost:3000/updateShoppingcart/',d)
				  .success(function (data) {
					  $scope.isError = false;
			          if(data.success){
			        		var price = $scope.shoppingItem_list[i].price;
			    			var total = 0;
			    			$scope.shoppingItem_list[i].subtotal =  Number(price)*Number(qty);
			    			$scope.shoppingItem_list[i].ord_quantity = this.qty;
			    			 for (var j = 0; j < $scope.shoppingItem_list.length; j++) {
			    				 total = total + $scope.shoppingItem_list[j].subtotal;
			    			}
			    			 $scope.total = total;
			    			 $scope.sales_tax = 4.29;	
				          	 $scope.grandtotal = total + $scope.sales_tax;
			    			if($scope.total === 0){
			    			 $scope.sales_tax = 0;	
			    			 $scope.grandtotal = 0;
			    			}
			    			
			          }else{
			        	  $scope.isError = true;
				    	  $scope.errorMsg = "We are facing some issue. Please try again later.";
			          }
			      })
			      .error(function(data) {
			    	  $scope.isError = true;
			    	  $scope.errorMsg = "We are facing some issue. Please try again later.";
			      });	
			}else{
				$scope.isError = true;
				$scope.errorMsg = "Quantity should be less than or equal to item left .";
			}
		} else {
			$scope.isError = true;
			$scope.errorMsg = "Quantity should be more than or equal to one.";
		}
	};
	
	
	$scope.removeItem = function(i){
	
		var id = $scope.shoppingItem_list[i]._id;
		var d = {id:id};
		var myEl = angular.element(document.querySelector('#div'+i));
		myEl.remove();
		$http.delete('http://localhost:3000/deleteShoppingCartItem/'+id)
		  .success(function (data) {
	          console.log("Success" + data);
	          if(data.success){
	        	  console.log("item deleted");
		      			delete $scope.shoppingItem_list[i];
		      			console.log($scope.shoppingItem_list.length);
		      			if($scope.shoppingItem_list.length > 0){
		      				
			    			var total = 0;
			    			 for (var j = 0; j <= $scope.shoppingItem_list.length; j++) {
			    				 if($scope.shoppingItem_list[j] !== undefined){
			    				 total = total + $scope.shoppingItem_list[j].subtotal;
			    				 }
			    			}
			    			 $scope.total = total;
			    			 $scope.sales_tax = 4.29;	
				          	 $scope.grandtotal = total + $scope.sales_tax;
			    			if($scope.total === 0){
			    			  $scope.sales_tax = 0;	
			    			  $scope.grandtotal = 0;
			    			}
		      			}else{
		      				$scope.total = 0;
		      				$scope.sales_tax = 0;
		      				$scope.grandtotal = 0;
		      			} 		
	          }else{
	        	  $scope.isError = true;
			      $scope.errorMsg = "We are facing some issue. Please try again later.";
	          }
	      })
	      .error(function(data) {
	    	  $scope.isError = true;
		      $scope.errorMsg = "We are facing some issue. Please try again later.";
	      });	
			
	};
	
});