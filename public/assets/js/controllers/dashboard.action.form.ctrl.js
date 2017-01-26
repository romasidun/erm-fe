/**
 * Created by Jafeez on 11/01/2017.
 */
(function(){
    ActionFormController.$inject = ['$scope','$rootScope','$state', '$stateParams', 'ControlService', 'OPRiskService', 'Utils'];
    app.controller('DashActionFormCtrl', ActionFormController);

    function ActionFormController ($scope, $rootScope, $state, $stateParams, ControlService, OPRiskService, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Control Test Plan";

        $scope.Form = {};

        $scope.submitAction = function() {
            if($scope.Form.CtrlRepo.$invalid) return false;
            ControlService.UpdateTestPlans($stateParams, $scope.VM).then(function (res) {
                if(res.status===200) $state.go('app.control.teestplan.main');
            });
        };

        $scope.cancelAction = function() {
            if($scope.Form.CtrlRepo.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){ $state.go('app.dashboard'); });
                return false;
            }
            $state.go('app.dashboard');
        };
    }
})();