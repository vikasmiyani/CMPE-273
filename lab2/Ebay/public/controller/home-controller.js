/**
 * http://usejsdoc.org/
 */
var app = angular.module('app',[]);
app.controller('homeController', function($scope,$window,$location,$http) {
 /*   $scope.sellItem = function(){
    	
    	 $window.location.href = 'http://localhost:3000/sellItemPg/';
    	// $window.location.href = '/signin.ejs';
  
  };
  
  $scope.signin = function(){
      
       $window.location.href = 'http://localhost:3000/signinPg/';
      // $window.location.href = '/signin.ejs';
  
  };*/
	
  $scope.getItemList = function(){
	  

	  if($scope.items === undefined){
		  $http.get('http://localhost:3000/itemList/')
	      .then(function (data) {
	          console.log("Success" + data);
	          $scope.items = data.data;
	      
	      })
	      .catch(function(data) {
	          console.log("Erro: "+data);
	      });
	  }
	
  };
  
  $scope.getSearchItemList = function(){
	  
	  $scope.search_item = window.search_item;

	  if($scope.search_item !== undefined && $scope.search_item !== ""){
		  var search_item = $scope.search_item;
		  $http.get('http://localhost:3000/searchItemList/'+search_item)
	      .then(function (data) {
	          console.log("Success" + data);
	          $scope.items = data.data;
	          $scope.length = data.data.length;
	      
	      })
	      .catch(function(data) {
	          console.log("Erro: "+data);
	      });
	  }
  };
  
  $scope.getDetail = function(event){
	  $http.get("http://localhost:3000/detailPg", {
		    params: { item_id:event.target.id}
		});
	 /* var d = {item_id:event.target.id};
	  $http.post('http://localhost:3000/fetchDetail/',d)
	  .success(function (data) {
          console.log("Success" + data);
          if(data.success){
              $window.location.href = "http://localhost:3000/detailPg";
          }else{
              $window.location.href = "http://localhost:3000/error";
          }
      })
      .error(function(data) {
     	 $window.location.href = "http://localhost:3000/error";
      });*/
  };
	  
 
  
});

