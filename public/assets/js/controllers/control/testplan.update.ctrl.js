(function(){
    TestPlanUpdateController.$inject = ['$scope','$rootScope','$state', '$stateParams', 'ControlService', 'OPRiskService', 'Utils', '$filter'];
    app.controller('TestPlanUpdateCtrl', TestPlanUpdateController);

    function TestPlanUpdateController ($scope, $rootScope, $state, $stateParams, ControlService, OPRiskService, Utils, $filter){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Control Test Plan";

        $scope.Form = {};
        $scope.addControls = function(){
            $scope.VM.controlDataModel = [];
            var headers= ["Control Category", "Control ID", "Control Name", "Control Source", "Business Procee", "Owner"],
                cols =["controlCategory", "controlRefID", "controlName", "controlSource", "businessProcess", "controlOwner"];

            $rootScope.app.Mask = true;
            OPRiskService.GetControlData().then(function(data){
                data.forEach(function(c, i){
                    c.Selected = false;
                    c.modifiedOn = Utils.createDate(c.modifiedOn);
                });
                console.log('data',data);
                var controlModal = Utils.CreateSelectListView("Select Controls", data, headers, cols);
                controlModal.result.then(function(list){
                    $scope.VM.controlDataModel = $scope.VM.controlDataModel.concat(list);
                });
                $rootScope.app.Mask = false;
            });
        };

        $scope.submitAction = function() {
            if($scope.Form.TestPlan.$invalid) return false;
            $rootScope.app.Mask = true;

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.testDueDate);
            var d2 = moment($scope.VM.nextDueDate);
            $scope.VM.testDueDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.nextDueDate = (d2.isValid()) ? d2.format(dtype) : '';
            $scope.VM.testDueDateStr = $scope.VM.testDueDate;
            $scope.VM.nextDueDateStr = $scope.VM.nextDueDate;

            var tmpdept = $filter('filter')($rootScope.app.Lookup.Departments, {deptId: $scope.VM.department[0].deptId}, true);
            $scope.VM.department[0] = tmpdept[0];

            var fileModel = $scope.VM.testplanFileModel;
            var d = new Date();
            var idd = 'Pol' + d.getTime();
            $scope.VM.key = idd;
            ControlService.FileUpload(idd, fileModel).then(function(res){
                if(res.status === 200) {
                    for (var i in fileModel) {
                        fileModel[i].id = res.data.fileId;
                        fileModel[i].filePath = res.data.path;
                    }
                }
            }).finally(function () {
                ControlService.UpdateTestPlans($stateParams.id, $scope.VM).then(function (res) {
                    console.log('res',res);
                }).finally(function () {
                    $state.go('app.control.testplan.main');
                });
            });
        };

        $scope.cancelAction = function() {
            if ($scope.Form.TestPlan.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.control.testplan.main');
                });
                return false;
            }
            $state.go('app.control.testplan.main');
        };

        $scope.removeItem = function (type, idx) {
            $scope.VM[type].splice(idx, 1);
        };

        $scope.downloadExcel = function () {
            var tmpdept = $filter('filter')($rootScope.app.Lookup.Departments, {deptId: $scope.VM.department[0].deptId}, true);
            $scope.VM.department[0] = (tmpdept.length > 0) ? tmpdept[0] : {deptId:'', deptName:''};

            var data = {};
            data.heights = [];
            data.sheetName = "Control Test Plan";
            data.body = [];
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
                    angular.isUndefined($scope.VM.department[0].deptName)? "" : $scope.VM.department[0].deptName + "",
                ],
                [
                    "Test Due Date",
                    angular.isUndefined($scope.VM.testDueDate)? "" : $scope.VM.testDueDate + "",
                    "",
                    "Next Due Date",
                    angular.isUndefined($scope.VM.nextDueDate)? "" : $scope.VM.nextDueDate + "",
                ],
                [
                    "Test Plan File Name",
                    angular.isUndefined($scope.VM.testPlanFile)? "" : $scope.VM.testPlanFile + "",
                    "",
                    "Test Frequency",
                    angular.isUndefined($scope.VM.controlFrequency)? "" : $scope.VM.controlFrequency + ""
                ]
            ];

            for(var i=0; i<testPlan_data.length; i++){
                for(var j=0; j<=4; j++){
                    data.body.push({
                        col: (+j+2),
                        row: (+i+2),
                        text: testPlan_data[i][j],
                        font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'true',iter:'true'},
                        fill: {type: 'solid', fgColor: 'adadad'},
                        border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'},
                        wrap: 'true',
                        align:'center'
                    });
                }
                data.heights.push({row: (+i+2), height: 30});
            }

            var head_txt = ['Control Category', 'Control Name', 'Control ID', 'Control Source', 'Business Process', 'Owner', 'status'];
            for (var i = 0; i < head_txt.length; i++) {
                data.body.push({
                    col: (+i + 1),
                    row: 7,
                    text: head_txt[i],
                    font: {name: 'Calibri', sz: '11', family: '3', scheme: '-'},
                    fill: {type: 'solid', fgColor: '99b8ca'},
                    border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'},
                    wrap: 'true'
                });
            }
            data.heights.push({row: 7, height: 30});

            var control_data = $scope.VM.controlDataModel;
            var newObj = []
            var num = 8;
            for(var i in control_data){
                newObj.push([
                    control_data[i].controlCategory+"",
                    control_data[i].controlName+"",
                    control_data[i].id + "",
                    control_data[i].controlSource + "",
                    control_data[i].businessProcess + "",
                    control_data[i].controlOwner + "",
                    angular.isUndefined($scope.VM.testStatus)? "" : $scope.VM.testStatus + ""
                ]);
                num++;
            }

            data.commonData = {
                data: newObj,
                font: {name: 'Calibri', sz: '11', family: '2', scheme: '-'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'},
                wrap: 'true',
                height: 30,
                srow: 8,
                scol: 1
            };

            data.cols = 7;
            data.rows = num * 1 + 2;

            var wval = [21, 20, 25, 20, 24, 25, 25, 16];
            data.widths = [];
            for (var i = 0; i < wval.length; i++) {
                data.widths.push({col: +i + 1, width: wval[i]});
            }

            ControlService.DownloadExcel(data).then(function (response) {
                var nodeUrl = $rootScope.app.NodeApi;
                location.assign(nodeUrl+ '/downloadExcel/' + response.data);
            }).catch(function (error) {
                console.log('error!');
            });
        };

        ControlService.GetTestPlan($stateParams.id).then(function(data){
            $scope.VM = data;

            var dtype = 'MM-DD-YYYY';
            var d1 = moment($scope.VM.testDueDate);
            var d2 = moment($scope.VM.nextDueDate);
            $scope.VM.testDueDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.nextDueDate = (d2.isValid()) ? d2.format(dtype) : '';
            $scope.VM.testDueDateStr = $scope.VM.testDueDate;
            $scope.VM.nextDueDateStr = $scope.VM.nextDueDate;

            $rootScope.app.Mask = false;
        });
    }
})();