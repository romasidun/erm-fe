(function(){
    RepoUpdateController.$inject = ['$scope','$rootScope','$state', '$stateParams', 'ControlService', 'Utils'];
    app.controller('RepoUpdateCtrl', RepoUpdateController);

    function RepoUpdateController ($scope, $rootScope, $state, $stateParams, ControlService, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Control Data Repository";
        $scope.Form = {};

        $scope.submitAction = function(){
            if($scope.Form.CtrlRepo.$invalid) return false;

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.controlEffectiveStartdate);
            var d2 = moment($scope.VM.controlEffectiveEnddate);
            $scope.VM.controlEffectiveStartdate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.controlEffectiveEnddate = (d2.isValid()) ? d2.format(dtype) : '';
            $scope.VM.controlEffectiveStartdateStr = $scope.VM.controlEffectiveStartdate;
            $scope.VM.controlEffectiveEnddateStr = $scope.VM.controlEffectiveEnddate;

            ControlService.UpdateRepo($stateParams.id, $scope.VM).then(function(res){
                $state.go('app.control.repo.main');
                if(res.status===200){
                    var fileModel = $scope.VM.filemodel;
                    ControlService.FileUpload(res.id, fileModel).then(function (res) {
                        console.log(123);
                        // console.log(res);
                    }).finally(function () {
                        console.log(456);
                    });
                }
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
            $scope.VM = data;

            var dtype = 'MM-DD-YYYY';
            var d1 = moment($scope.VM.controlEffectiveStartdate);
            var d2 = moment($scope.VM.controlEffectiveEnddate);
            $scope.VM.controlEffectiveStartdate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.controlEffectiveEnddate = (d2.isValid()) ? d2.format(dtype) : '';
            $scope.VM.controlEffectiveStartdateStr = $scope.VM.controlEffectiveStartdate;
            $scope.VM.controlEffectiveEnddateStr = $scope.VM.controlEffectiveEnddate;

            $rootScope.app.Mask = false;
        });

    }

})();