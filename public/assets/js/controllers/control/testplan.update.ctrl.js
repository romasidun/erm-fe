(function(){
    TestPlanUpdateController.$inject = ['$scope','$rootScope','$state', '$stateParams', 'ControlService', 'OPRiskService', 'Utils', 'SoxTpService'];
    app.controller('TestPlanUpdateCtrl', TestPlanUpdateController);

    function TestPlanUpdateController ($scope, $rootScope, $state, $stateParams, ControlService, OPRiskService, Utils, SoxTpService){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Control Test Plan";

        $scope.Form = {};
        $scope.addControls = function(){
            $scope.VM = {
                 controlDataModel: []
            };
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
                });
                $rootScope.app.Mask = false;
            });
        };

        $scope.submitAction = function() {
            $rootScope.app.Mask = true;
            if($scope.Form.TestPlan.$invalid) return false;
            ControlService.UpdateTestPlans($stateParams.id, $scope.VM).then(function (res) {
                if(res.status===200) {
                    $rootScope.app.Mask = false;
                    $state.go('app.control.testplan.main');
                }
            });
        };

        $scope.cancelActions = function() {
            // if($scope.Form.TestPlan.$dirty) {
            //     var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
            //     confirm.result.then(function(){ $state.go('app.control.testplan.main'); });
            //     return false;
            // }
            $state.go('app.control.testplan.main');
        };

        $scope.removeItem = function (type, idx) {
            $scope.VM[type].splice(idx, 1);
        };

        $scope.downloadExcel = function() {
            var head_obj = [];
            var head_txt = ['Control Category', 'Control Name', 'Control ID', 'Control Source', 'Business Process', 'Owner', 'status'];
            var body_txt = [];
            var testPlan_data = [
                [
                    "Test Plan Name",
                    angular.isUndefined($scope.VM.testPlanName)? "" : $scope.VM.testPlanName + "",
                    "",
                    "Test Plan Desc",
                    angular.isUndefined($scope.VM.testPlanDesc)? "" : $scope.VM.testPlanDesc + "",
                ],
                [
                    "Region",
                    angular.isUndefined($scope.VM.regionName)? "" : $scope.VM.regionName + "",
                    "",
                    "Department",
                    angular.isUndefined($scope.VM.department)? "" : $scope.VM.department[0].deptName + "",
                ],
                [
                    "Test Due Date",
                    angular.isUndefined($scope.VM.controlEffectiveStartdate)? "" : $scope.VM.controlEffectiveStartdate + "",
                    "",
                    "Next Due Date",
                    angular.isUndefined($scope.VM.controlEffectiveEnddate)? "" : $scope.VM.controlEffectiveEnddate + "",
                ],
                [
                    "Test Plan File Name",
                    angular.isUndefined($scope.VM.controlRefID)? "" : $scope.VM.controlRefID + "",
                    "",
                    "Test Frequency",
                    angular.isUndefined($scope.VM.controlCategory)? "" : $scope.VM.controlCategory + ""
                ]
            ];
            var control_data = $scope.VM.controlDataModel;

            for(var i in head_txt){
                head_obj.push({
                    bgcolor: '99b8ca',
                    text: head_txt[i]
                });
            }

            for(var i in control_data){
                body_txt.push([
                    control_data[i].controlCategory + "",
                    control_data[i].controlName + "",
                    control_data[i].id + "",
                    control_data[i].controlSource + "",
                    control_data[i].businessProcess + "",
                    control_data[i].controlOwner + "",
                    angular.isUndefined($scope.VM.testStatus)? "" : $scope.VM.testStatus + ""
                ]);
            }

            var senddata = {
                head: head_obj,
                body: body_txt,
                testPlan_data: testPlan_data
            };
            ControlService.DTExcelDownload(senddata).then(function (response) {
                location.assign('/control_excel_download/' + response.data);
            }).catch(function (error) {
                alert('error!');
            });
        };

        ControlService.GetTestPlan($stateParams.id).then(function(data){
            $scope.VM = data;
            $rootScope.app.Mask = false;
        });
    }
})();