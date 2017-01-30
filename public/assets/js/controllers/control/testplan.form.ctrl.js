(function(){
    TestPlanFormController.$inject = ['$scope','$rootScope','$state', 'OPRiskService', 'SoxTpService', 'Utils'];
    app.controller('TestPlanFormCtrl', TestPlanFormController);

    function TestPlanFormController ($scope, $rootScope, $state, OPRiskService, SoxTpService, Utils){
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

        $scope.downloadExcel = function() {
            var head_txt = ['Control Category','Control ID','Control Name','Control Source','Business Procee','Owner'];
            var head_obj = [];
            var body_txt = [];
            var control_data = $scope.VM.controlDataModel;
            var control_data_fir = control_data[0];
            for(var i in head_txt){
                head_obj.push({
                    bgcolor: 'ffffff',
                    width: 20,
                    text: head_txt[i]
                });
            }

            for(var i in control_data){
                body_txt.push([
                    control_data[i].controlCategory,
                    control_data[i].controlRefID,
                    control_data[i].controlName,
                    control_data[i].controlSource,
                    control_data[i].businessProcess,
                    control_data[i].controlOwner
                ]);
            }

            var senddata = {
                head: head_obj,
                body: body_txt
            };
            SoxTpService.ExcelDownload(senddata).then(function (response) {
                location.assign('/download-excel/' + response.data);
            }).catch(function (error) {
                alert('error!');
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