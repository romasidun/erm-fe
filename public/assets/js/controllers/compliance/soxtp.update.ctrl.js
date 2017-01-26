(function(){
    SOXTestPlanUpdateController.$inject = ['$scope','$rootScope','$state', '$stateParams', 'ControlService', 'ComplianceService', 'Utils'];
    app.controller('SOXTestPlanUpdateCtrl', SOXTestPlanUpdateController);

    function SOXTestPlanUpdateController ($scope, $rootScope, $state, $stateParams, ControlService, ComplianceService, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "SOX Test Plan";

        $scope.Form = {};

        $scope.addControls = function(){
            var headers= ["Control Category", "Control ID", "Control Name", "Control Source", "Business Procee", "Owner"],
                cols =["controlCategory", "controlRefID", "controlName", "controlSource", "businessProcess", "controlOwner"];

            $rootScope.app.Mask = true;
            ComplianceService.GetControlData().then(function(data){
                data.forEach(function(c, i){
                    c.Selected = false;
                    c.modifiedOn = Utils.createDate(c.modifiedOn);
                });
                var controlModal = Utils.CreateSelectListView("Select Controls", data, headers, cols);
                controlModal.result.then(function(list){
                    $scope.VM.controlDataModel = $scope.VM.controlDataModel.concat(list);
                });
                $rootScope.app.Mask = false;
            });
        };

        $scope.submitAction = function() {
            if($scope.Form.CtrlRepo.$invalid) return false;
            ComplianceService.UpdateSOXTP($stateParams, $scope.VM).then(function (res) {
                if(res.status===200) $state.go('app.compliance.soxtp.main');
            });
        };

        $scope.cancelAction = function() {
            if($scope.Form.CtrlRepo.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){ $state.go('app.compliance.soxtp.main'); });
                return false;
            }
            $state.go('app.compliance.soxtp.main');
        };

        ComplianceService.GetSOXTP($stateParams.id).then(function(data){
            $scope.VM = data;
            $rootScope.app.Mask = false;
        });
    }
})();