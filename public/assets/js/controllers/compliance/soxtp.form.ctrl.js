(function () {

    "use strict";

    SOXTestPlanFormController.$inject = ['$scope', '$rootScope', '$state', 'ComplianceService', 'Utils'];
    app.controller('SOXTPFormCtrl', SOXTestPlanFormController);


    function SOXTestPlanFormController($scope, $rootScope, $state, ComplianceService, Utils) {

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Upload a Sox Test Plan Assessment";

        $scope.isEdit = false;

        $scope.Form = {};

        $scope.VM = {
            controlDataModel: [],
            actualName: "",
            approval: "",
            asmntType: "ACM011",
            asmntTypeName: "SOXTP",
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
            if ($scope.Form.SoxTp.$invalid) return false;

            $scope.VM.assessId = moment().format('X');

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
                ComplianceService.PostSOXTPAssessment($scope.VM).then(function (res) {
                    console.log('res',res);
                }).finally(function () {
                    $state.go('app.compliance.soxtp.main');
                });
            });
        };

        $scope.cancelAction = function(){
            if($scope.Form.SoxTp.$dirty || $scope.isEdit){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function(){
                    $state.go('app.compliance.soxtp.main');
                });
                return false;
            }
            $state.go('app.compliance.soxtp.main');
        };

        $scope.setOpt = function (op) {
            op.Selected = !op.Selected;
            if (op.Selected) {
                $scope.RiskCategories.SelCount++;
            } else {
                $scope.RiskCategories.SelCount--;
            }
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
                    $scope.isEdit = true;
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
            data.sheetName = "Sox Test Plan";
            data.heights = [];
            data.body = [];

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
                    angular.isUndefined($scope.VM.business) ? "" : $scope.VM.business + "",
                ],
                [
                    "Frequency",
                    angular.isUndefined($scope.VM.frequency) ? "" : $scope.VM.frequency + "",
                    "",
                    "Status",
                    angular.isUndefined($scope.VM.approval) ? "" : $scope.VM.approval + "",
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
            for (var i = 0; i < inputdata.length; i++) {
                for (var j = 0; j < inputdata[i].length; j++) {
                    data.body.push({
                        col: +j + 2,
                        row: +i + 1,
                        text: inputdata[i][j],
                        font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'true',iter:'true'},
                        border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'},
                        wrap: 'true',
                        fill: {type: 'solid', fgColor: '99b8ca'}
                    });
                }
                data.heights.push({row: (+i+1), height: 30});
            }

            var head_txt = [
                'Control Name',
                'Control Desc',
                'Control Source',
                'Control Category',
                'Control Version',
                'Control Active',
                'Business Process',
                'Sub Process',
                'Start Date',
                'End Date',
                'Control Type',
                'Risk Type',
                'Nature of Control',
                'Control Frequency',
                'Supporting IT Application',
                'Control Owner',
                'Control Test Plan',
                'Control Ref ID',
                'Control Definition'
            ];
            for (var i = 0; i < head_txt.length; i++) {
                data.body.push({
                    col: (+i + 1),
                    row: 6,
                    text: head_txt[i],
                    font: {name: 'Calibri', sz: '11', family: '3', scheme: '-'},
                    fill: {type: 'solid', fgColor: '99b8ca'},
                    border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'},
                    wrap: 'true'
                });
            }
            data.heights.push({row: 6, height: 30});

            var control_data = $scope.VM.controlDataModel;
            var num = 7;
            var newObj = []
            angular.forEach(control_data, function (obj, ind) {
                newObj.push([
                    obj.controlName,
                    obj.controlDescription,
                    obj.controlSource,
                    obj.controlCategory,
                    obj.controlVersionNumber,
                    obj.active,
                    obj.businessProcess,
                    obj.subprocess,
                    moment(obj.controlEffectiveStartdateStr).format('MM-DD-YYYY'),
                    moment(obj.controlEffectiveEnddateStr).format('MM-DD-YYYY'),
                    obj.controlType,
                    obj.riskTypes,
                    obj.natureOfControl,
                    obj.controlFrequency,
                    obj.supportingITApplication,
                    obj.controlOwner,
                    obj.controlTestPlan,
                    obj.controlRefID,
                    obj.controlDefinition
                ]);
                num++;
            });

            data.commonData = {
                data: newObj,
                font: {name: 'Calibri', sz: '11', family: '2', scheme: '-'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'},
                wrap: 'true',
                height: 30,
                srow: 7,
                scol: 1
            };

            data.cols = 21;
            data.rows = num * 1 + 2;

            var wval = [30, 30, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
            data.widths = [];
            for (var i = 0; i < wval.length; i++) {
                data.widths.push({col: +i + 1, width: wval[i]});
            }

            ComplianceService.DownloadExcel(data).then(function (response) {
                var nodeUrl = $rootScope.app.NodeApi;
                location.assign(nodeUrl + '/downloadExcel/' + response.data);
            }).catch(function (error) {
                alert('error!');
            });
        };

        $rootScope.app.Mask = false;
    }
})();