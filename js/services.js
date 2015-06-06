angular.module('App.services', []).

/**
 * Service: DataService
 * Returns a promise for data.
 * @param  {Object} $q
 * @param  {Function} $http
 * @return {Function} get -> getData
 */
factory('DataService', ['$q', '$http', function($q, $http) {
    'use strict';

    function getData(path) {
        // The $http API is based on the deferred/promise APIs exposed by the $q service
        // so it returns a promise for us by default.
        return $http({
            url: path,
            method: 'get'
        }).then(function(response) {
            if (typeof response.data === 'object') {
                return response.data;
            }
        }, function(response) {
            // Something went wrong.
            return $q.reject(response.data);
        });
    }

    return {
        get: getData
    };
}]);