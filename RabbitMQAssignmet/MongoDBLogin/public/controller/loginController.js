/**
 * http://usejsdoc.org/
 */
var login = angular.module('login', []); // defining the login controller
login.controller('login', function($scope, $http,$window) {
	$scope.error = false;
	$scope.login = function() {
		$http({
			method : "POST",
			url : '/doLogin',
			data : {
				"username" : $scope.username,
				"password" : $scope.password
			}
		}).success(function(data) {
			//checking the response data for
			if (data.success) {
				$scope.error = false;
				 $window.location.href = "http://localhost:3000/homepage";
			}else{
				$scope.error = true;
				$scope.errorMsg = "Incorrect username or password";
			}
		}).error(function(error) {
			$scope.error = true;
			$scope.errorMsg = "We are facing some issues";
		});
	};
	
	$scope.register = function() {
		$http({
			method : "POST",
			url : '/doSignup',
			data : {
				"username" : $scope.username,
				"password" : $scope.password,
				"email" : $scope.email
			}
		}).success(function(data) {
			//checking the response data for
			if (data.success) {
				 $window.location.href = "http://localhost:3000/";
			} 
		}).error(function(error) {
			$scope.error = true;
			$scope.errorMsg = "We are facing some issues";
		});
	};
	
});
