/**
 * http://usejsdoc.org/
 */
var demo = angular.module('eBay',[]);

demo.controller('indexController', function($scope,$window,$location,$http) {
    $scope.signinPg = function(){
    	$window.location.href = 'http://localhost:3000/signinPg/';
    	// $window.location.href = '/signin.ejs';
  };
  
});