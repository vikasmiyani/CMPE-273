/**
 * http://usejsdoc.org/
 */
var app = angular.module('app',[]);

app.controller('sellItemController', function($scope,$http, $window) {

	$scope.isError = false;
    $scope.save = function(){
    	
    	 var f_1 = $scope.item_name;
         var f_2 = $scope.item_desc;
         var f_5 = $scope.result;
         var f_6,f_3,f_4,f_7,currentDate,d;
         
         if(f_5){
        	   f_6 = $scope.bid_price;
               currentDate = new Date();
               f_7 = currentDate.setDate(currentDate.getDate()+4);
               if(f_6 < 0){
            	   $scope.isError = true;
            	   $scope.errorMsg = "bidding price can not be less than zero.";
               } else {
            	   $scope.isError = false;
            	   d= {item_name:f_1,item_desc:f_2,isBidding:f_5,bid_price:f_6,bid_days:f_7};
               }
              
         }else{
        	  f_3 = $scope.price;
        	  f_4 = $scope.qty;
        	  if(f_3 < 0 || f_4 < 1){
        		  $scope.isError = true;
        		  $scope.errorMsg = "Price  or Quantity can not be less than zero.";
        	  } else {
        		  $scope.isError = false;
         		  d= {item_name:f_1,item_desc:f_2,price:f_3,qty:f_4,isBidding:f_5};
        	  }
         }
       
         
         $http.post('http://localhost:3000/sellItem/',d)
         .success(function (data) {
             console.log("Success" + data);
             if(data.success){
            	 $scope.isError = false; 
                 $window.location.href = "http://localhost:3000/";
             }else{
            	 $scope.isError = true;
            	 $scope.errorMsg = "We are facing some issues. Please try again later.";
             }
         })
         .error(function(data) {
        	 $scope.isError = true;
        	 $scope.errorMsg = "We are facing some issues. Please try again later.";
         });
  };
    
});