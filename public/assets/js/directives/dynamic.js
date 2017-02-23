app.directive('dynamic', ['$compile', function($compile){
    return {
        restrict: 'AE',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function(html) {
                console.log(html);
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
}]);