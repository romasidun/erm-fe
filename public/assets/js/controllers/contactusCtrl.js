'use strict';
/** 
  * controller for Contact Us
*/
app.controller('ContactusCtrl', [
    "$scope", "$rootScope", "$state", "Utils",
    function ($scope, $rootScope, $state, Utils) {
    $scope.mainTitle = $state.current.title || 'loading';
    $scope.mainDesc = "Contact Us";

    $scope.Form = {};

    $scope.VM = {
        name: "",
        email: "",
        message: ""
    };


    $scope.submitAction = function(){
        if($scope.Form.Contactus.$invalid) return false;

        return false;
    };

    $scope.cancelAction = function(){
        if($scope.Form.Contactus.$dirty){
            var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
            confirm.result.then(function(){ $state.go('app'); });
        }
    };

    $rootScope.app.Mask = false;
}]);