/**
 * http://usejsdoc.org/
 */
var app = angular.module('app',[]);

app.controller('paymentController', function($scope,$window,$location,$http) {

		$scope.isError = false;
		$scope.isValidCard = false;
		$scope.isNotValidCard = false;
		$scope.isMissing = false;
		
		$scope.setDetails = function(){
			
			
		var isBuyItNow = window.isBuyItNow;
		$scope.isBuyItNow = isBuyItNow;
		$scope.address = window.address;
		$scope.city = window.city;
		$scope.zip = window.zip;
		$scope.contact_info = window.contact_info;
		
		if(isBuyItNow === 'true'){
			var sd_id = window.sd_id;
			var order_qty = window.order_qty;
			 $http.get('http://localhost:3000/fetchDetail/'+sd_id)
		      .success(function (data) {
		          console.log("Success" + data);
		          	data[0].ord_quantity = order_qty;
		          	$scope.item_list = data;
		          	calcTotal();
		      })
		      .error(function(data) {
		          console.log("Erro: "+data);
		      });
			
		}else{
			 $http.get('http://localhost:3000/fetchShoppingDetail/')
		      .success(function (data) {
		          console.log("Success" + data);
			      $scope.item_list = data;
		          calcTotal();
			   
		      })
		      .error(function(data) {
		          console.log("Erro: "+data);
		      });
		}

		
		};
		

	$scope.update = function(i) {

		var isBuyItNow = $scope.isBuyItNow;
		var qty = this.qty;
		var q = $scope.item_list[i].quantity;
		if (qty > 0 && qty !== undefined) {
			  $scope.isError = false;
			if (isBuyItNow === 'false') {

				q = $scope.item_list[i].sd_qty;

				var sc_id = $scope.item_list[i].sc_id;
				var quantity = qty;
				var d = {
					sc_id : sc_id,
					quantity : quantity
				};
				if(quantity <= q){
					 $scope.isError = false;
				$http.post('http://localhost:3000/updateShoppingcart/', d)
						.success(function(data) {
							 $scope.isError = false;
							if (data.success) {
								
							} else {
								 $scope.isError = true;
						    	 $scope.errorMsg = "We are facing some issue. Please try again later.";
							}
						}).error(function(data) {
							 $scope.isError = true;
					    	  $scope.errorMsg = "We are facing some issue. Please try again later.";
						});
				}
			}

			if (qty <= q) {
				 $scope.isError = false;
				var price = $scope.item_list[i].price;
				var total = 0;
				var total_item = 0;
				$scope.item_list[i].subtotal = Math.round(Number(price) * Number(qty) * 100) / 100;
				$scope.item_list[i].ord_quantity = this.qty;
				for (var j = 0; j < $scope.item_list.length; j++) {
					if($scope.item_list[j] !== undefined){
	    				 total = total + $scope.item_list[j].subtotal;
	       				 total_item = Number(total_item) + Number($scope.item_list[j].ord_quantity);
	    			}
				}
				$scope.total = Math.round(total * 100)/100;
				$scope.sales_tax = 4.29;	
				  $scope.grandtotal = Math.round((total + $scope.sales_tax) * 100)/100;
          	 	$scope.total_item = total_item;
          	  if($scope.total === 0){
          		 $scope.sales_tax = 0;	
          		$scope.grandtotal = 0;
          		$scope.total_item =0;
          	  }
			}else{
				$scope.isError = true;
				$scope.errorMsg = "Quantity should be less than or equal to item left .";
			}
		}else{
			$scope.isError = true;
			$scope.errorMsg = "Quantity should be more than or equal to one.";
		}

	};
	
	
	$scope.order = function(){
		var isValidCard = $scope.isValidCard;
		var isError = $scope.isError;
		var isBuyItNow = $scope.isBuyItNow;
		if(isValidCard && $scope.item_list.length > 0){
				$scope.isMissing = false;
					if(!isError){
						/*var arr = [];
						for (var int = 0; int <  $scope.item_list.length; int++) {
							var item_id =  $scope.item_list[int].id;
							var quantity = $scope.item_list[int].ord_quantity;
							var sd_id = $scope.item_list[int].sd_id;
							var user_id = $scope.item_list[int].user_id;
							var isBuyItNow = $scope.isBuyItNow;
							var jObj = {item_id:item_id,quantity: quantity,sd_id:sd_id,user_id:user_id,};
							arr[int] = jObj;
						}*/
						var d = {items:$scope.item_list,isBuyItNow:isBuyItNow};
				
						$http.post('http://localhost:3000/order/',d)
						.success(function(data) {
							console.log("Success" + data);
							if (data.success) {
								$window.location.href = "http://localhost:3000/";
							} else {
						    	 $scope.errorMsg = "We are facing some issue. Please try again later.";
							}
						}).error(function(data) {
					    	 $scope.errorMsg = "We are facing some issue. Please try again later.";
						});
					}else{
						$scope.errorMsg = "Quantity should be less than Item left and more than or equal to one"
					}
		}else{
			$scope.isMissing = true;
		}
	};
	
	$scope.removeItem = function(i){
		
		var id = $scope.item_list[i].sc_id;
		var d = {id:id};
		var myEl = angular.element(document.querySelector('#div'+i));
		myEl.remove();
		if($scope.isBuyItNow === 'true'){
			delete $scope.item_list[i];
			calcTotal();
		}else{
		$http.delete('http://localhost:3000/deleteShoppingCartItem/'+id)
		  .success(function (data) {
	          console.log("Success" + data);
	          if(data.success){
	        	  console.log("item deleted");
		      			delete $scope.item_list[i];
		      			calcTotal();
		      		
	          }else{
	        	  $scope.isError = true;
			      $scope.errorMsg = "We are facing some issue. Please try again later.";
	          }
	      })
	      .error(function(data) {
		    	 $scope.isError = true;
			     $scope.errorMsg = "We are facing some issue. Please try again later.";
	      });	
		}	
	};
	
	$scope.validateCard = function(){
		
		var cardNumber = $scope.cardnumber;
		var expMonth = $scope.expMonth
		var expYear = $scope.expYear;
		var cvvNumber = $scope.cvv;
		
		var cardPattrn = /^([0-9]{16})$/;
		var expMonthPattern = /^(0[1-9]|1[0-2])$/;
		var expyearPattern = /^(\d{4})$/;
		var cvvPattern = /^(\d{3})$/;
			
			if(cardPattrn.test(cardNumber) && expMonthPattern.test(expMonth) && expyearPattern.test(expYear) && cvvPattern.test(cvvNumber) && ((parseInt(expYear) > new Date().getFullYear()) || (parseInt(expYear)=== new Date().getFullYear() && parseInt(expMonth) >= new Date().getMonth()))){
				
				var d = {cardNumber: cardNumber,expMonth:expMonth,expYear:expYear,cvvNumber:cvvNumber};
				
				$http.post('http://localhost:3000/validateCard/', d)
				.success(function(data) {
					if (data.success) {
						$scope.isValidCard = true;
						$scope.isNotValidCard = false;
					} else {
						$scope.isValidCard = false;
						$scope.isNotValidCard = true;
					}
				}).error(function(data) {
					$scope.isValidCard = false;
					$scope.isNotValidCard = true;
				});
			}else{
				$scope.isValidCard = false;
				$scope.isNotValidCard = true;
			}
		
		
	};
	
	function calcTotal(){

	var data = $scope.item_list;
  	if(data.length > 0 && data[0] !== undefined){
		
  		var total = 0;
		var total_item = 0;
		 for (var i = 0; i < data.length; i++) {
	 		  if(data[i] !== undefined){
	 		  data[i].subtotal = Math.round(Number(data[i].price) * Number(data[i].ord_quantity) * 100) / 100;
	 		  total = total + data[i].subtotal;
	 		  total_item = Number(total_item) +Number(data[i].ord_quantity);
	 		  }
	 	  }
		 $scope.total = Math.round(total * 100)/100;
	 	  $scope.sales_tax = 4.29;	
	 	 
	  	  $scope.grandtotal = Math.round((total + $scope.sales_tax) * 100)/100;
	  	  $scope.total_item = total_item;
	  	  if(data.length === 0){
	  		$scope.sales_tax = 0;	
	  		$scope.grandtotal = 0;
	  	  }
		}else{
			$scope.total = 0;
			$scope.sales_tax = 0;
			$scope.grandtotal = 0;
			$scope.total_item = 0;
		}
  	  
  	  
	}
	
});