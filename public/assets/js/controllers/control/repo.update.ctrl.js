(function(){
    RepoUpdateController.$inject = ['$scope','$rootScope','$state', '$stateParams', 'ControlService', 'Utils'];
    app.controller('RepoUpdateCtrl', RepoUpdateController);

    function RepoUpdateController ($scope, $rootScope, $state, $stateParams, ControlService, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Control Data Repository";
        $scope.Form = {};

        $scope.submitAction = function(){
            if($scope.Form.CtrlRepo.$invalid) return false;
            ControlService.UpdateRepo($stateParams.id, $scope.VM).then(function(res){
                if(res.status===200) $state.go('app.control.repo.main');
            });
        };

        $scope.cancelAction = function(){
            if($scope.Form.CtrlRepo.$dirty){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(re){
                    $state.go('app.control.repo.main');
                });
                return false;
            }
            $state.go('app.control.repo.main');
        };

        ControlService.GetRepo($stateParams.id).then(function (data) {
            $scope.controlEffectiveStartdate = Utils.GetDPDate(data.controlEffectiveStartdate);
            $scope.controlEffectiveEnddate = Utils.GetDPDate(data.controlEffectiveEnddate);
            data.controlEffectiveStartdate = new Date(data.controlEffectiveStartdate);
            data.controlEffectiveEnddate =  new Date(data.controlEffectiveEnddate);
            $scope.VM = data;

            $rootScope.app.Mask = false;
        });
    }

})();