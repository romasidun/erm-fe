(function () {

    "use strict";

    SOXRCMFormController.$inject = ['$scope', '$rootScope', '$state', 'ComplianceService', 'Utils'];
    app.controller('SOXRCMFormCtrl', SOXRCMFormController);


    function SOXRCMFormController($scope, $rootScope, $state, ComplianceService, Utils) {

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Upload a Risk Control Matrix Assessment";

        $scope.Form = {};

        $scope.VM = {
            controlDataModel: [],
            actualName: "",
            approval: "",
            asmntType: "ACM012",
            asmntTypeName: "SOXRCM",
            asmntType_name: "",
            assessDesc: "",
            assessId: 0,
            assessName: "",
            business: "",
            createdBy: "",
            createdOn: "",
            due_date: moment().format("MM-DD-YYYY"),
            filemodel: [],
            filename: "",
            frequency: "",
            modifiedBy: "",
            modifiedOn: "",
            period: "",
            priority: "",
            region: "",
            resPerson: ""
        };

        $scope.submitAction = function () {
            if ($scope.Form.SoxRcm.$invalid) return false;

            $scope.VM.assessId = moment().format('X');

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.due_date);
            $scope.VM.dueDtStr = (d1.isValid()) ? d1.format(dtype) : '';

            ComplianceService.PostSOXRCMAssessment($scope.VM).then(function (res) {
                if (res.status === 200) {
                    var fileModel = $scope.VM.filemodel;
                    ComplianceService.FileUpload(res.id, fileModel).then(function (res) {
                        console.log(res);
                    }).finally(function () {
                        $state.go('app.compliance.soxrcm.main');
                    });
                }
            });
        };

        $scope.cancelAction = function () {
            if ($scope.Form.SoxRcm.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.compliance.soxrcm.main');
                });
                return false;
            }
            $state.go('app.compliance.soxrcm.main');
        };

        $scope.setOpt = function (op) {
            op.Selected = !op.Selected;
            if (op.Selected) {
                $scope.RiskCategories.SelCount++;
            } else {
                $scope.RiskCategories.SelCount--;
            }

            console.log($scope.RiskCategories.SelCount);
        };

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
            var data = {};
            data.sheetName = "Risk Control Matrix";
            data.body = [];

            var head_txt = ['Control Category', 'Control Name', 'Control ID', 'Control Source', 'Business Process', 'Owner', 'status'];
            for (var i = 0; i < head_txt.length; i++) {
                data.body.push({
                    col: (+i + 1),
                    row: 6,
                    text: head_txt[i],
                    font: { name: 'Calibri', sz: '13', family: '2', scheme: '-', bold: 'true'},
                    fill: { type: 'solid', fgColor: '666666' },
                    border : { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' }
                });
            }

            var inputdata = [
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
            for(var i = 0; i < inputdata.length; i++){
                for(var j = 0; j < inputdata[i].length; j++){
                    data.body.push({
                        col: +j + 2,
                        row: +i + 1,
                        text: inputdata[i][j],
                        fill: { type: 'solid', fgColor: '99b8ca' }
                    });
                }
            }


            var control_data = $scope.VM.controlDataModel;
            var fieldAry = ['controlCategory', 'controlName', 'id', 'controlSource', 'businessProcess', 'controlOwner'];
            var status = angular.isUndefined($scope.VM.testStatus) ? "" : $scope.VM.testStatus + "";
            for (var i in control_data) {
                for (var j = 0; j < fieldAry.length; j++) {
                    data.body.push({
                        col: +j + 1,
                        row: +i + 7,
                        text: control_data[i][fieldAry[j]],
                        border : { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' }
                    });
                }
                data.body.push({
                    col: +j + 1,
                    row: +i + 7,
                    text: status,
                    border : { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' }
                });
            }
            data.cols = +j + 5;
            data.rows = +i + 12;

            data.widths = [];
            for(var c = 1; c <= data.cols; c++){
                data.widths.push({col: c, width: 25});
            }
            data.widths[1].width = 45;
            data.widths[2].width = 35;

            data.heights = [];
            for(var r = 1; r <= data.rows; r++){
                data.heights.push({row: r, height: 25});
            }

            ComplianceService.DownloadExcel(data).then(function (response) {
                location.assign('/downloadExcel/' + response.data);
            }).catch(function (error) {
                alert('error!');
            });
        };

        $rootScope.app.Mask = false;
    }
})();