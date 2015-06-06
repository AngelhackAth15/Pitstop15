angular.module('App.controllers', []).

controller('MainController', ['$scope', '$http', function($scope, $http) {
    'use strict';

    $http({
        url: '',
        method: 'POST',
        dataType: 'JSON',
        data: {
            tag: addTag
        }
    }).success(function(data, status, headers, config) {
        if (data.code == 200) {

        }else if (data.code == 400) {

        }
    }).error(function(data, status, headers, config) {

    }).finally(function(){

    });

}]);