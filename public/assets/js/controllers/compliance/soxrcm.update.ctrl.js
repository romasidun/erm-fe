(function () {

    "use strict";

    SOXRCMUpdateController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'ComplianceService', 'Utils'];
    app.controller('SOXRCMUpdateCtrl', SOXRCMUpdateController);


    function SOXRCMUpdateController($scope, $rootScope, $state, $stateParams, ComplianceService, Utils) {
    	$scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Upload a SOX Risk Control Matrix";

        $scope.Form = {};
        $scope.submitAction = function() {
            if($scope.Form.SoxRcm.$invalid) return false;
            ComplianceService.UpdateSOXRCMAssessment($stateParams.id, $scope.VM).then(function (res) {
                if(res.status===200) $state.go('app.compliance.soxrcm.main');
            });
        };

        $scope.cancelAction = function() {
            if($scope.Form.SoxRcm.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){ $state.go('app.compliance.soxrcm.main'); });
                return false;
            }
            $state.go('app.compliance.soxrcm.main');
        };

        ComplianceService.GetSOXRCMAssessment($stateParams.id).then(function(data){
            data.due_date = moment(data.due_date).format('YYYY-MM-DD');
            $scope.VM = data;
            $scope.VM.controlDataModel = [];
            $rootScope.app.Mask = false;
        });

        $scope.addControls = function () {
            var headers = ["Control Category", "Control ID", "Control Name", "Control Source", "Business Procee", "Owner"],
                cols = ["controlCategory", "controlRefID", "controlName", "controlSource", "businessProcess", "controlOwner"];

            $rootScope.app.Mask = true;
            ComplianceService.GetControlData().then(function (data) {
                data.forEach(function (c, i) {
                    c.Selected = false;
                    c.modifiedOn = Utils.createDate(c.modifiedOn);
                });
                var controlModal = Utils.CreateSelectListView("Select Controls", data, headers, cols);
                controlModal.result.then(function (list) {
                    $scope.VM.controlDataModel = $scope.VM.controlDataModel.concat(list);
                });
                $rootScope.app.Mask = false;
            });
        };
        $scope.removeItem = function (type, idx) {
            $scope.VM[type].splice(idx, 1);
        };
        $scope.downloadExcel = function () {
            var head_obj = [];
            var head_txt = ['Control Category', 'Control Name', 'Control ID', 'Control Source', 'Business Process', 'Owner', 'status'];
            var body_txt = [];
            var testPlan_data = [
                [
                    "Name",
                    angular.isUndefined($scope.VM.assessName) ? "" : $scope.VM.assessName + "",
                    "",
                    "Description",
                    angular.isUndefined($scope.VM.assessDesc) ? "" : $scope.VM.assessDesc + "",
                ],
                [
                    "Region",
                    angular.isUndefined($scope.VM.region) ? "" : $scope.VM.region + "",
                    "",
                    "Department",
                    angular.isUndefined($scope.VM.department) ? "" : $scope.VM.department[0].deptName + "",
                ],
                [
                    "Frequency",
                    angular.isUndefined($scope.VM.frequency) ? "" : $scope.VM.frequency + "",
                    "",
                    "Status",
                    angular.isUndefined($scope.VM.status) ? "" : $scope.VM.status + "",
                ],
                [
                    "Priority",
                    angular.isUndefined($scope.VM.priority) ? "" : $scope.VM.priority + "",
                    "",
                    "Responsible Person",
                    angular.isUndefined($scope.VM.resPerson) ? "" : $scope.VM.resPerson + ""
                ]/*,
                 [
                 "Due Date",
                 angular.isUndefined($scope.VM.due_date) ? "" : $scope.VM.due_date + "",
                 "",
                 "Files to upload",
                 angular.isUndefined($scope.VM.filemodel) ? "" : $scope.VM.filemodel + ""
                 ]*/
            ];
            var control_data = $scope.VM.controlDataModel;

            for (var i in head_txt) {
                head_obj.push({
                    bgcolor: '99b8ca',
                    text: head_txt[i]
                });
            }

            for (var i in control_data) {
                body_txt.push([
                    control_data[i].controlCategory + "",
                    control_data[i].controlName + "",
                    control_data[i].id + "",
                    control_data[i].controlSource + "",
                    control_data[i].businessProcess + "",
                    control_data[i].controlOwner + "",
                    angular.isUndefined($scope.VM.testStatus) ? "" : $scope.VM.testStatus + ""
                ]);
            }

            var senddata = {
                head: head_obj,
                body: body_txt,
                testPlan_data: testPlan_data
            };
            ComplianceService.DTExcelDownload(senddata).then(function (response) {
                location.assign('/control_excel_download/' + response.data);
            }).catch(function (error) {
                alert('error!');
            });
        };
    }
})();