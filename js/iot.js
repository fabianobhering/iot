angular.module('iot', [])
	.controller('sensor', function($scope, $http) {
	    $http.get('http://35.199.76.183:3000/temperatura').
	        then(function(response) {
	            $scope.sensor = response.data;
	        });
	});