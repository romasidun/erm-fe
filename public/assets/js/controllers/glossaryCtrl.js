'use strict';
/** 
  * controller for Contact Us
*/
app.controller('GlossaryCtrl', [
    "$scope", "$rootScope", "$state", "Utils",
    function ($scope, $rootScope, $state, Utils) {
    $scope.mainTitle = $state.current.title || 'loading';
    $scope.mainDesc = "Glossary";


    $rootScope.app.Mask = false;
}]);