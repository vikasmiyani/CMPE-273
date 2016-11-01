/**
 * http://usejsdoc.org/
 */


app.controller('navbarController',function($scope,$rootScope,$window,$location,$http) {
	
	$scope.searchItems = function(){
		
		var sitem = $scope.sitem;

		var regexPattern = /<script\b[^>]*>([\s\S]*?)<\/script>/gim;
	
		var isScript = regexPattern.test(sitem);
		if(!isScript){
			
			var url = "http://localhost:3000/searchItem/"+sitem;
			
			 $http.get(url)
		      .success(function (data) {
		          console.log("Success" + data);
		          $rootScope.items = data.data;
		          $window.location.href = "/";
		      })
		      .error(function(data) {
		          console.log("Erro: "+data);
		      });
			
			
		}else{
			$scope.sitem = "";
		}
	};
	
});

/*app.controller('navbarController', [ '$scope', '$rootElement',
		function($scope, $rootElement) {
			console.log($rootElement.attr('ng-app')); // --> myApp
		} ]);*/