(function(){
    TestResultUpdateController.$inject = ['$scope','$rootScope','$state', '$stateParams', 'ControlService', 'OPRiskService', 'Utils'];
    app.controller('TestResultUpdateCtrl', TestResultUpdateController);

    function TestResultUpdateController ($scope, $rootScope, $state, $stateParams, ControlService, OPRiskService, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Control Test Result";

        $scope.Form = {};

        $scope.addTestPlan = function(){
            $scope.VM = {
                controlDataModel: []
            };
            var headers= ["Test Plan", "Region", "Status", "File Name", "Test Due Date", "Priority"],
                cols =["testPlanName", "regionName", "controlStatus", "fileName", "dueDate", "controlPriority"];

            $rootScope.app.Mask = true;
            ControlService.GetTestPlans(10, 1).then(function(data){
                data.forEach(function(c, i){
                    c.Selected = false;
                    c.dueDate = c.testDueDate? moment(Utils.createDate(c.testDueDate)).format('DD/MM/YYYY'):'None';
                });
                console.log('data',data);
                var controlModal = Utils.CreateSelectListView("Select Test Plans", data, headers, cols);
                controlModal.result.then(function(list){
                    $scope.VM.controlDataModel = $scope.VM.controlDataModel.concat(list);
                });
                $rootScope.app.Mask = false;
            });
        };

        $scope.submitAction = function() {
            if($scope.Form.TestResult.$invalid) return false;
            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.testCompletedDate);
            var d2 = moment($scope.VM.testDueDate);
            var d3 = moment($scope.VM.createdOnStr);
            var d4 = moment($scope.VM.modifiedOnStr);
            var d5 = moment($scope.VM.testDtStr);
            var d6 = moment($scope.VM.testCompleteStr);
            $scope.VM.testCompletedDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.testDueDate = (d2.isValid()) ? d2.format(dtype) : '';
            $scope.VM.createdOnStr = (d3.isValid()) ? d3.format(dtype) : '';
            $scope.VM.modifiedOnStr = (d4.isValid()) ? d4.format(dtype) : '';
            $scope.VM.testDtStr = (d5.isValid()) ? d5.format(dtype) : '';
            $scope.VM.testCompleteStr = (d6.isValid()) ? d6.format(dtype) : '';
            $scope.VM.testCompletedDateStr = $scope.VM.testCompletedDate;
            $scope.VM.testDueDateStr = $scope.VM.testDueDate;

            var fileModel = $scope.VM.filemodel;
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
                    console.log('res',res);
                }).finally(function () {
                    $state.go('app.control.testresult.main');
                });
            });
        };

        $scope.cancelAction = function() {
            if($scope.Form.TestResult.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){ $state.go('app.control.testresult.main'); });
                return false;
            }
            $state.go('app.control.testResult.main');
        };

        ControlService.GetTestResult($stateParams.id).then(function(data){
            $scope.VM = data;
            console.log('$scope.VM.testCompletedDate',$scope.VM);
            var dtype = 'MM-DD-YYYY';
            var d1 = moment($scope.VM.testCompletedDate);
            var d2 = moment($scope.VM.testDueDate);
            $scope.VM.testCompletedDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.testDueDate = (d2.isValid()) ? d2.format(dtype) : '';
            $scope.VM.testCompleteStr = $scope.VM.testCompletedDate;
            $scope.VM.testDtStr = $scope.VM.testDueDate;

            $rootScope.app.Mask = false;
        });
    }
})();