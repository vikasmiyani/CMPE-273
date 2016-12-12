 var demo = angular.module('demo',[]);

demo.controller('calcController', function($scope,$http) {
    $scope.addition = function(){
    	console.log("addition");
        var f_1 = $scope.field_1;
        var f_2 = $scope.field_2;
        var d= {field_1:f_1,field_2:f_2};
        $http.post('http://localhost:3000/addition/',d)
        .then(function (data) {
            console.log("Success" + data);
            $scope.result = data.data.Result;
        })
        .catch(function(data) {
            console.log("Erro: "+data);
        });
        };
     $scope.subtraction = function(){
        var f_1 = $scope.field_1;
        var f_2 = $scope.field_2;
        var d= {field_1:f_1,field_2:f_2};
        $http.post('http://localhost:3000/subtraction/',d)
        .then(function (data) {
            console.log("Success" + data);
            $scope.result = data.data.Result;
        })
        .catch(function(data) {
            console.log("Erro: "+data);
        });
    };
     $scope.multiplication = function(){
        var f_1 = $scope.field_1;
        var f_2 = $scope.field_2;
        var d= {field_1:f_1,field_2:f_2};
        $http.post('http://localhost:3000/multiplication/',d)
        .then(function (data) {
            console.log("Success" + data);
           $scope.result = data.data.Result;
        })
        .catch(function(data) {
            console.log("Erro: "+data);
        });
    };
     $scope.division = function(){
        var f_1 = $scope.field_1;
        var f_2 = $scope.field_2;
        var d= {field_1:f_1,field_2:f_2};
        $http.post('http://localhost:3000/division/',d)
        .then(function (data) {
            console.log("Success" + data);
           $scope.result = data.data.Result;
        })
        .catch(function(data) {
            console.log("Erro: "+data);
        });
    };
    
    
});


