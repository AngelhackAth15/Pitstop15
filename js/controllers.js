angular.module('App.controllers', []).

controller('MainController', ['$scope', '$http', function($scope, $http) {
    'use strict';

    var setValues = function(){
    	$http({
	        url: 'my-service.com/api/v1/set/keys/' + $scope.setInputValues.key,
	        method: 'POST',
	        dataType: 'JSON',
	        data: $scope.setInputValues.value
	    }).success(function(data, status, headers, config) {
	        // if (data.code == 200) {

	        // }else if (data.code == 400) {

	        // }
	    }).error(function(data, status, headers, config) {

	    }).finally(function(){

	    });
    };

    $scope.setKeyValue = function(){
    	setValues();
    };

    var getValues = function(){
    	$http({
	        url: 'my-service.com/api/v1/get/keys/' + $scope.getInputValues.key,
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

    $scope.getKeyValue = function(){
    	getValues();
    };

    var sendMessages = function(){
    	$http({
	        url: 'my-service.com/api/v1/send-message/topics/' + $scope.setInputMessages.topic,
	        method: 'POST',
	        dataType: 'JSON',
	        data: $scope.setInputMessages.message
	    }).success(function(data, status, headers, config) {
	        // if (data.code == 200) {

	        // }else if (data.code == 400) {

	        // }
	    }).error(function(data, status, headers, config) {

	    }).finally(function(){

	    });
    };
    
    $scope.setTopicMessage = function(){
    	sendMessages();
    };

    var getMessages = function(){
    	$http({
	        url: 'my-service.com/api/v1/get-message/topics/' + $scope.getInputMessages.topic +'/'+ $scope.getInputMessages.message,
	        method: 'POST',
	        dataType: 'JSON',
	        data: {
	            message: $scope.getInputMessages.message
	        }
	    }).success(function(data, status, headers, config) {
	        // if (data.code == 200) {

	        // }else if (data.code == 400) {

	        // }
	    }).error(function(data, status, headers, config) {

	    }).finally(function(){

	    });
    };

    $scope.getTopicMessage = function(){
    	getMessages();
    };


}]);