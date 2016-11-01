var app = angular.module('app',[]);

app.controller('signinController', function($scope,$window,$location,$http) {

  $scope.emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  $scope.passwordPattern = /^[a-zA-Z]\w{3,14}$/;
  $scope.isError = false;
  $scope.signin = function(){
    var email_id = $scope.email_id;
    var pwd = $scope.password;
    if(email_id !== "" && email_id !== undefined && pwd !== "" && pwd !== undefined){
    	$scope.isError = false;
    	 var d= {email_id:email_id,password:pwd};
         $http.post('http://localhost:3000/signin/',d)
         .success(function(data){
           if(data.success){
	           $scope.isError = false;
	           $window.location.href = "http://localhost:3000/";
           }else{
        	   $scope.isError = true;
        	   $scope.errorMsg = "We are facing some issue.Please try again later";
           }
         })
         .error(function(data) {
        	 $scope.isError = true;
        	 $scope.errorMsg = "Please enter correct email id or password.";
         });
    }else{
    	$scope.isError = true;
    	$scope.errorMsg = "Please enter email id or password.";
    }
     
  };

/*  $scope.signin = function(){
	  console.log("in signin");
	  var email_id = $scope.email_id;
	  var pwd = $scope.password;
      var d= {email_id:email_id,password:pwd};
      $http.post('http://localhost:3000/signin/',d)
      .success(function(data){
    	  console.log("here");
    	  $window.localStorage.setItem("token",data.data.token);
    	  $http.defaults.headers.common.Authorization = data.data.token;
    	  if(data.success){
    	  $window.location.href = "http://localhost:3000/";
    	  }else{
    		  $window.location.href = "http://localhost:3000/error";
    	  }
      })
      .error(function(data) {
          $window.location.href = "http://localhost:3000/error";
      });
};*/
$scope.signup = function(){

  var first_name = $scope.f_name;
  var last_name = $scope.l_name;
  var email_id = $scope.email_id;
  var password = $scope.password;
  var cnfrmPwd = $scope.confirmpassword;

  if(first_name !== "" && first_name !== undefined && email_id !== "" && email_id !== undefined && password !== "" && password !== undefined && cnfrmPwd !== "" && cnfrmPwd !== undefined){
	  $scope.isError = false;
	  if(last_name === "" && last_name === undefined){
		  last_name = " ";
	  }
	   if(password !== cnfrmPwd){
		   $scope.isError = true;
      	   $scope.errorMsg = "Confirm password does not match with password.";
	   }else{
	  var d= {first_name:first_name,last_name:last_name,email_id:email_id,password:password,cnfrmPwd:cnfrmPwd};
	     $http.post('http://localhost:3000/signup/',d)
	     .success(function (data) {
	    	 $scope.isError = false;
	        if(data.success){
	        $window.location.href = "http://localhost:3000/signinPg";
	        }else{
	        	 $scope.isError = true;
	        	 $scope.errorMsg = "This email id already registered with us.";
	        }
	     })
	     .error(function(data) {
	    	 $scope.isError = true;
        	 $scope.errorMsg = "We are facing some issue. Please try again later.";
	     });
	   }
	  }else{
		  $scope.isError = true;
		  $scope.errorMsg = "Please fill out mandatory details.";
	  }
	};
	  
 
   
});