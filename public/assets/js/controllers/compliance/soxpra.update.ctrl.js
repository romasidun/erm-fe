(function () {

    "use strict";

    SOXPRAUpdateController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'ComplianceService', 'Utils'];
    app.controller('SOXPRAUpdateCtrl', SOXPRAUpdateController);


    function SOXPRAUpdateController($scope, $rootScope, $state, $stateParams, ComplianceService, Utils) {
    	$scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Upload a SOX Process Risk Analysis";

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
            if($scope.Form.SoxPra.$invalid) return false;

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.due_date);
            $scope.VM.due_date = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.dueDtStr = $scope.VM.due_date;

            var fileModel = $scope.VM.filemodel;
            var d = new Date();
            var idd = 'Pol' + d.getTime();
            $scope.VM.key = idd;
            ComplianceService.FileUpload(idd, fileModel).then(function(res){
                if(res.status === 200) {
                    for (var i in fileModel) {
                        fileModel[i].id = res.data.fileId;
                        fileModel[i].filePath = res.data.path;
                    }
                }
            }).finally(function () {
                ComplianceService.UpdateSOXPRAAssessment($stateParams.id, $scope.VM).then(function (res) {
                    console.log('res',res);
                }).finally(function () {
                    $state.go('app.compliance.soxpra.main');
                });
            });
        };

        $scope.cancelAction = function() {
            if($scope.Form.SoxPra.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function(){ $state.go('app.compliance.soxpra.main'); });
                return false;
            }
            $state.go('app.compliance.soxpra.main');
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
                    angular.isUndefined($scope.VM.business)? "" : $scope.VM.business + "",
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
            ComplianceService.DTExcelDownload(senddata).then(function (response) {
                var nodeUrl = $rootScope.app.NodeApi;
                location.assign(nodeUrl + '/control_excel_download/' + response.data);
            }).catch(function (error) {
                alert('error!');
            });
        };

        ComplianceService.GetSOXPRAAssessment($stateParams.id).then(function(data){
            $scope.VM = data;

            var dtype = 'MM-DD-YYYY';
            var d1 = moment($scope.VM.due_date);
            $scope.VM.due_date = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.dueDtStr = $scope.VM.due_date;

            $rootScope.app.Mask = false;
        });
    }
})();