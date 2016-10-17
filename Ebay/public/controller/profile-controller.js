var app = angular.module('app',[]);

app.controller('accountController', function($scope,$window,$location,$http) {
	
	$scope.isError = false; 
	$scope.accountDetails = function(){
	      
	      // $window.location.href = '/signin.ejs';
		  $http.get('http://localhost:3000/accountDetails/')
	      .success(function (data) {
	          console.log("Success" + data);
	          var accountData = data;
	          $scope.first_name = accountData[0].first_name;
	          $scope.last_name = accountData[0].last_name;
	          $scope.dob = accountData[0].dob;
	          $scope.ebay_handle = accountData[0].ebay_handle;
	          $scope.email_id = accountData[0].email_id;
	          $scope.contact_info = accountData[0].contact_info;
	          $scope.address = accountData[0].address;
	          $scope.city = accountData[0].city;
	          $scope.zip = accountData[0].zip;
	      })
	      .error(function(data) {
	          console.log("Erro: "+data);
	      });
	  
	};
	
	
	$scope.update = function(){
		
		 var first_name = $scope.first_name; 
         var last_name = $scope.last_name; 
         var dob = $scope.dob; 
         var email_id = $scope.email_id; 
         var contact_info = $scope.contact_info;
         var address = $scope.address; 
         var city = $scope.city; 
         var zip = $scope.zip;
         
         if(first_name === "" || first_name === undefined ){
        	 $scope.isError = true; 
        	$scope.isErrorMsg = "First name can not be empty."
         } else if(email_id === "" || email_id === undefined){
        	 	$scope.isError = true; 
        	 	$scope.isErrorMsg = "Email id can not be empty."
         }else {
        	 var d= {first_name:first_name,last_name:last_name,dob:dob,ebay_handle:ebay_handle,email_id:email_id,contact_info:contact_info,address:address,city:city,zip:zip};
             $http.post('http://localhost:3000/accountUpdate/',d)
             .success(function (data) {
            	 $scope.isError = false;
                 if(data.success){
                     $window.location.href = "http://localhost:3000/";
                 }else{
                    $scope.isError = true;
                    $scope.isErrorMsg = "We are facing some issues. Please try again later.";
                 }
             })
             .error(function(data) {
            	 $scope.isError = true;
                 $scope.isErrorMsg = "We are facing some issues. Please try again later.";
             });

         }
         
        
	};
	
	
});