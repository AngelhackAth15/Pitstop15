angular.module('App.controllers', []).

controller('MainController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
    'use strict';

    $scope.checkServiceTxt = 'Check Service';
    $scope.checkServiceClass = 'default';
    var pingService = function(){
    	$scope.startService = true;
    	$http({
	        url: $rootScope.href + 'ping',
	        method: 'GET',
	        dataType: 'JSON'
	    }).success(function(data, status, headers, config) {

	        if (data == 'pong') {
    			$scope.checkServiceTxt = 'Service Running';
    			$scope.checkServiceClass = 'success';
	        }
	    }).error(function(data, status, headers, config) {
	    	$scope.checkServiceTxt = 'Service Failed';
    		$scope.checkServiceClass = 'danger';
	    }).finally(function(){
	    	$scope.startService = false;
	    });
    };

    $scope.checkService = function(){
    	pingService();
    };

    var setValues = function(){
    	$scope.setValuesDisabledBtn = true;
    	$http({
    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	        url: $rootScope.href + 'api/v1/set/keys/' + $scope.setInputValues.key,
	        method: 'POST',
	        data: $scope.setInputValues.value
	    }).success(function(data, status, headers, config) {

	    }).error(function(data, status, headers, config) {

	    }).finally(function(){
    		$scope.setValuesDisabledBtn = false;
	    });
    };

    $scope.setKeyValue = function(){
    	setValues();
    };

    var getValues = function(){
    	$scope.getValuesDisabledBtn = true;
    	$http({
	        url: $rootScope.href + 'api/v1/get/keys/' + $scope.getInputValues.key,
	        method: 'GET',
	        dataType: 'JSON'
	    }).success(function(data, status, headers, config) {
	    	$scope.showValue = true;
	    	$scope.showErrorValue = false;
	    	$scope.responseValue = data.value;
	    }).error(function(data, status, headers, config) {
	    	$scope.showErrorValue = true;
	    	$scope.showValue = false;
	    	$scope.responseValue = data.message;

	    }).finally(function(){
    		$scope.getValuesDisabledBtn = false;
	    });
    };

    $scope.getKeyValue = function(){
    	getValues();
    };

    var sendMessages = function(){
    	$scope.setMessagesDisabledBtn = true;
    	$http({
    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	        url: $rootScope.href + 'api/v1/send-message/topics/' + $scope.setInputMessages.topic,
	        method: 'POST',
	        data: $scope.setInputMessages.message
	    }).success(function(data, status, headers, config) {

	    }).error(function(data, status, headers, config) {

	    }).finally(function(){
    		$scope.setMessagesDisabledBtn = false;
	    });
    };
    
    $scope.setTopicMessage = function(){
    	sendMessages();
    };

    // $scope.items = ['Hello', 'Hello1', 'Hello2'];

    var getMessages = function(){
    	$scope.getMessagesDisabledBtn = true;
    	$http({
	        url: $rootScope.href + 'api/v1/get-message/topics/' + $scope.getInputMessages.topic +'/'+ $scope.getInputMessages.number,
	        method: 'GET',
	        dataType: 'JSON',
	        data: {
	            message: $scope.getInputMessages.number
	        }
	    }).success(function(data, status, headers, config) {
	    	$scope.items = data.values;
	    	$scope.showMessageList = true;
	    	$scope.showErrorTopicValue = false;
	    }).error(function(data, status, headers, config) {
	    	$scope.showErrorTopicValue = true;
	    	$scope.showMessageList = false;
	    	$scope.responseErrorTopic = data.topic;
	    }).finally(function(){
    		$scope.getMessagesDisabledBtn = false;
	    });
    };

    $scope.getTopicMessage = function(){
    	getMessages();
    };


}]);