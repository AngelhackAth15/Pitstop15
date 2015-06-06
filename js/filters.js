angular.module('App.filters', []).

filter('htmlToPlaintext', function() {
    return function(text) {
        return String(text).replace(/<[^>]+>/gm, '');
    };
}).

filter("formatHtml", ['$sce', function($sce) {
    return function(input) {
        return $sce.trustAsHtml(input);
    };
}]);
