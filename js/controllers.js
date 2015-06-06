angular.module('App.controllers', []).

controller('MainController', ['$scope', '$http', function($scope, $http) {
    'use strict';

    var setValues = function(){
    	$http({
	        url: 'my-service.com/api/v1/set/keys' + $scope.setKey,
	        method: 'POST',
	        dataType: 'JSON',
	        data: {
	            value: $scope.setValue
	        }
	    }).success(function(data, status, headers, config) {
	        // if (data.code == 200) {

	        // }else if (data.code == 400) {

	        // }
	    }).error(function(data, status, headers, config) {

	    }).finally(function(){

	    });
    };

    var getValues = function(){
    	$http({
	        url: 'my-service.com/api/v1/get/keys' + $scope.getKey,
	        method: 'GET',
	        dataType: 'JSON'
	    }).success(function(data, status, headers, config) {
	        // if (data.code == 200) {

	        // }else if (data.code == 400) {

	        // }
	    }).error(function(data, status, headers, config) {

	    }).finally(function(){

	    });
    };

    var sendMessages = function(){
    	$http({
	        url: 'my-service.com/api/v1/send-message/' + $scope.setTopic,
	        method: 'POST',
	        dataType: 'JSON',
	        data: {
	            message: $scope.setMessage
	        }
	    }).success(function(data, status, headers, config) {
	        // if (data.code == 200) {

	        // }else if (data.code == 400) {

	        // }
	    }).error(function(data, status, headers, config) {

	    }).finally(function(){

	    });
    };

    var getMessages = function(){
    	$http({
	        url: 'my-service.com/api/v1/get-message/' + $scope.getTopic +'/'+ $scope.getNumber,
	        method: 'POST',
	        dataType: 'JSON',
	        data: {
	            message: $scope.setMessage
	        }
	    }).success(function(data, status, headers, config) {
	        // if (data.code == 200) {

	        // }else if (data.code == 400) {

	        // }
	    }).error(function(data, status, headers, config) {

	    }).finally(function(){

	    });
    };


}]);