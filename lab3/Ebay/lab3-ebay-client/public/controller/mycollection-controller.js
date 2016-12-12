/**
 * http://usejsdoc.org/
 */
var app = angular.module('app',[]);

app.controller('mycollectionController', function($scope,$window,$location,$http) {
	
	$scope.isSellingHis = false;
	$scope.isOrderHis = false;
	$scope.displayHis = function(req,res){
		
		var isOrderHis = window.isOrderHis;
			$scope.isOrderHis = isOrderHis;
			var url;
		if(isOrderHis === 'true'){
			$scope.title = "Order History";
			$scope.isSellingHis = false;
			$scope.isOrderHis = true;
			url = "http://localhost:3000/orderHis/";
		}else{
			$scope.title = "Selling History";
			$scope.isSellingHis = true;
			$scope.isOrderHis = false;
			url = "http://localhost:3000/sellingHis/";
		}
			
		 $http.get(url)
	      .then(function (data) {
	          $scope.hisList = data.data;
	      })
	      .catch(function(data) {
	          console.log("Erro: "+data);
	      });
	}; 
	
	$scope.getOrderHis = function(){
		
		$scope.title = "Order History";
		 $http.get("http://localhost:3000/orderHis/")
	      .then(function (data) {
	          $scope.hisList = data.data;
	          $scope.isOrderHis = true;
	          $scope.isSellingHis = false;
	      })
	      .catch(function(data) {
	          console.log("Erro: "+data);
	      });
	};
	
	$scope.getSellingHis=  function(){
		
		$scope.title = "Selling History";
		 $http.get("http://localhost:3000/sellingHis/")
	      .then(function (data) {
	          $scope.hisList = data.data;
	          $scope.isOrderHis = false;
	          $scope.isSellingHis = true;
	      })
	      .catch(function(data) {
	    	  console.log("Erro: "+data);
	      });
	    	 
	};
});