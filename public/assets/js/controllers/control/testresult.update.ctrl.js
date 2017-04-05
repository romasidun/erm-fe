(function(){
    TestResultUpdateController.$inject = ['$scope','$rootScope','$state', '$stateParams', 'ControlService', 'OPRiskService', 'Utils', '$filter'];
    app.controller('TestResultUpdateCtrl', TestResultUpdateController);

    function TestResultUpdateController ($scope, $rootScope, $state, $stateParams, ControlService, OPRiskService, Utils, $filter){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Control Test Result";

        $scope.isEdit = false;

        $scope.Form = {};

        $scope.addTestPlan = function(){
            var headers= ["Test Plan", "Region", "Status", "File Name", "Test Due Date", "Priority"],
                cols =["testPlanName", "regionName", "controlStatus", "testPlanFile", "dueDate", "controlPriority"];

            $rootScope.app.Mask = true;
            ControlService.GetTestPlans(10, 1).then(function(data){
                data.forEach(function(c, i){
                    c.Selected = false;

                    var tmpRow = $filter('filter')($scope.VM.controlTestPlanModel, {id: c.id});
                    if(tmpRow.length > 0){
                        c.Selected = true;
                    }

                    c.dueDate = c.testDueDate? moment(Utils.createDate(c.testDueDate)).format('DD/MM/YYYY'):'None';
                });
                var controlModal = Utils.CreateSelectListView("Select Test Plans", data, headers, cols);
                controlModal.result.then(function(list){
                    $scope.isEdit = true;
                    $scope.VM.controlTestPlanModel = list;
                });
                $rootScope.app.Mask = false;
            });
        };

        $scope.removeItem = function(type, idx) {
            $scope.VM[type].splice(idx, 1);
        };

        $scope.submitAction = function() {
            if($scope.Form.TestResult.$invalid) return false;

            $rootScope.app.Mask = true;

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.testCompletedDate);
            var d2 = moment($scope.VM.testDueDate);
            var d3 = moment($scope.VM.createdOnStr);
            var d4 = moment($scope.VM.modifiedOnStr);
            $scope.VM.testCompletedDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.testDueDate = (d2.isValid()) ? d2.format(dtype) : '';
            $scope.VM.createdOnStr = (d3.isValid()) ? d3.format(dtype) : '';
            $scope.VM.modifiedOnStr = (d4.isValid()) ? d4.format(dtype) : '';
            $scope.VM.testCompletedDateStr = $scope.VM.testCompletedDate;
            $scope.VM.testDueDateStr = $scope.VM.testDueDate;

            var tmpdept = $filter('filter')($rootScope.app.Lookup.Departments, {id: $scope.VM.department[0].id}, true);
            $scope.VM.department[0] = tmpdept[0];

            var fileModel = $scope.VM.testresultFileModel;
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
                ControlService.UpdateTestResults($stateParams.id, $scope.VM).then(function (res) {
                    //console.log('res',res);
                }).finally(function () {
                    $state.go('app.control.testresult.main');
                });
            });
        };

        $scope.cancelAction = function() {
            if($scope.Form.TestResult.$dirty || $scope.isEdit) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function(){ $state.go('app.control.testresult.main'); });
                return false;
            }
            $state.go('app.control.testresult.main');
        };

        ControlService.GetTestResult($stateParams.id).then(function(data){
            $scope.VM = data;
            // console.log('$scope.VM.testCompletedDate',$scope.VM);
            var dtype = 'MM-DD-YYYY';
            var d1 = moment($scope.VM.testCompletedDate);
            var d2 = moment($scope.VM.testDueDate);
            $scope.VM.testCompletedDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.testDueDate = (d2.isValid()) ? d2.format(dtype) : '';
            $scope.VM.testCompletedDateStr = $scope.VM.testCompletedDate;
            $scope.VM.testDueDateStr = $scope.VM.testDueDate;

            $rootScope.app.Mask = false;
        });
    }
})();