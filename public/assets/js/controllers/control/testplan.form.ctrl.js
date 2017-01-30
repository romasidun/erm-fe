(function(){
    TestPlanFormController.$inject = ['$scope','$rootScope','$state', 'OPRiskService', 'Utils'];
    app.controller('TestPlanFormCtrl', TestPlanFormController);

    function TestPlanFormController ($scope, $rootScope, $state, OPRiskService, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Control Test Plan";

        $scope.Form = {};
        $scope.VM = {
            controlMethod: "",
            controlPriority: "",
            controlStatus: "",
            createdBy: "",
            createdOn: "",
            department: [
               {
                    area: "",
                    deptId: "",
                    deptName: "",
                    id: "string"
               }
            ],
            id: "",
            modifiedBy: "",
            modifiedOn: "",
            regionName: "",
            testDueDate: "",
            testPlanDesc: "",
            testPlanFile: "",
            testPlanName: "",
            testplanFileModel: [],
            controlDataModel: []
        };

        $scope.addControls = function(){
            var headers= ["Control Category", "Control ID", "Control Name", "Control Source", "Business Procee", "Owner"],
                cols =["controlCategory", "controlRefID", "controlName", "controlSource", "businessProcess", "controlOwner"];

            $rootScope.app.Mask = true;
            OPRiskService.GetControlData().then(function(data){
                data.forEach(function(c, i){
                    c.Selected = false;
                    c.modifiedOn = Utils.createDate(c.modifiedOn);
                });
                var controlModal = Utils.CreateSelectListView("Select Controls", data, headers, cols);
                controlModal.result.then(function(list){
                    $scope.VM.controlDataModel = $scope.VM.controlDataModel.concat(list);
                    console.log($scope.VM.controlDataModel);
                });
                $rootScope.app.Mask = false;
            });
        };

        $scope.removeItem = function (type, idx) {
            $scope.VM[type].splice(idx, 1);
        };

        $scope.submitAction = function() {
            if($scope.Form.TestResult.$invalid) return false;
            ControlService.AddTestPlans($scope.VM).then(function (res) {
                if(res.status===200) $state.go('app.control.testplan.main');
            });
        };

        $scope.cancelAction = function() {
            if($scope.Form.TestResult.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){ $state.go('app.control.testplan.main'); });
                return false;
            }
            $state.go('app.control.testplan.main');
        };

        $rootScope.app.Mask = false;
    }
})();