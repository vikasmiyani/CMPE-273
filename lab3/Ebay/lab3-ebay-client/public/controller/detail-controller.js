/**
 * http://usejsdoc.org/
 */
var app = angular.module('app',[]);

app.controller('detailController', function($scope,$window,$location,$http, $interval) {
	
	$scope.isError = false;
	$scope.buyNow = function(){
		
		var qty = $scope.order_qty;
		
		if(qty > 0 && qty !== undefined){
			  $scope.isError = false;
			if(qty <= $scope.quantity){
				  $scope.isError = false;
				var sd_id = $scope.item_id;
				var d = {quantity:qty,sd_id:sd_id,isBuyItNow:true,stock_qty:$scope.quantity};
				$http.post('http://localhost:3000/payment/',d)
				  .success(function (data) {
					  $scope.isError = false;
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
			} else {
				$scope.isError = true;
				$scope.errorMsg = "Quantity should be less than or equal to item left .";
			}
		}else{
			$scope.isError = true;
			$scope.errorMsg = "Quantity should be more than or equal to one.";
		}
	};
	
	
	$scope.addToCart = function(){
		
		var qty = $scope.order_qty;
		if(qty > 0 && qty !== undefined){
			  $scope.isError = false;
			if(qty <= $scope.quantity){
				  $scope.isError = false;
				var sd_id = $scope.item_id;
				var d = {quantity:qty,sd_id:sd_id};
				$http.post('http://localhost:3000/addToCart/',d)
				  .success(function (data) {
					  $scope.isError = false;
			          if(data.success){
			              $window.location.href = "http://localhost:3000/shoppingCartPg";
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
		}else{
			 $scope.isError = true;
			$scope.errorMsg = "Quantity should be more than or equal to one.";
		}
		
	};
	
	
	$scope.fetchDetail = function(){
		
		var item_id = window.x;
		 $http.get('http://localhost:3000/fetchDetail/'+item_id)
	      .success(function (data) {
	          console.log("Success" + data);
	          var detailData = data;
	          $scope.item_name = detailData[0].item_name;
	          $scope.item_desc = detailData[0].item_desc;
	          $scope.price = detailData[0].price;
	          $scope.quantity = detailData[0].quantity;
	          $scope.sold_quantity = detailData[0].sold_quantity;
	          $scope.isBidding = detailData[0].isBidding;
	          $scope.bidding_price = detailData[0].bidding_price;
	          $scope.sd_id = detailData[0].seller._id;
	          $scope.item_id = detailData[0]._id;
	          $scope.first_name = detailData[0].seller.first_name;
	          $scope.city = detailData[0].seller.city;
	          $scope.mysql_timestamp = detailData[0].bidding_due_time_stamp;
	         
	      })
	      .error(function(data) {
	          console.log("Erro: "+data);
	      });

	};
	
	
	$scope.placeBid = function(){
		
		var bid_price = $scope.place_bid;
		var current_bidding_price = $scope.bidding_price;
		if( $scope.diffDays > 0){
			if(bid_price > current_bidding_price){
				
				var item_id = $scope.item_id;
				var d = {item_id:item_id,bidding_price:bid_price};
				$http.post('http://localhost:3000/placeBid/',d)
				  .success(function (data) {
			          console.log("Success" + data);
			          if(data.success){
			           //   $window.location.href = "http://localhost:3000/shoppingCartPg";
			             $scope.title = "Bidding";
			             $scope.message = "Bidding placed with $"+bid_price;
			          }else{
			        	  $scope.title = "Bidding";
				          $scope.message = "Bid amount is less or Bidding time is over.";
			          }
			      })
			      .error(function(data) {
			    	  $scope.title = "Bidding";
			          $scope.message = "We are facing some issue. Please try again later.";
			      });
			}else{
				 $scope.title = "Bidding";
		         $scope.message = "Bid amount is less than current bid price.";
			}
		}else{
			 $scope.title = "Bidding";
	         $scope.message = "Bid time is over.";
		}
		
		
		
		
	};
		
	$scope.reload = function(){
		  $window.location.href = "http://localhost:3000/detailPg/"+$scope.item_id;
	};
		
	var tick = function() {
		 var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
         var firstDate = new Date(Date.parse($scope.mysql_timestamp));
         var secondDate = new Date();
         var diffMs = (firstDate - secondDate); // milliseconds between now & Christmas
         if(diffMs >= 0){
        	 $scope.diffDays = Math.round(diffMs / 86400000); // days
	         if($scope.diffDays === 1){
	        	  $scope.diffHrs = Math.round((diffMs % 86400000) / 3600000); // hours
	              $scope.diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
	         }
         }else{
        	 $scope.diffDays = 0;
         }
        // minute
	  };
	  tick();
	  $interval(tick, 1000);
	
});