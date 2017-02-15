(function(){
    TestResultFormController.$inject = ['$scope','$rootScope','$state', 'ControlService', 'Utils'];
    app.controller('TestResultFormCtrl', TestResultFormController);

    function TestResultFormController ($scope, $rootScope, $state, ControlService, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Control Test Result";

        $scope.Form = {};
        $scope.VM = {
            controlDataModel: [],
            controlMethod: "",
            controlPriority: "",
            controlStatus: "",
            controlsTested: "",
            createdBy: "",
            createdOn: "",
            department: [{
                area: "",
                // deptId: "",
                deptName: "",
                id: ""
            }],
            // id: "",
            modifiedBy: "",
            modifiedOn: "",
            regionName: "",
            testCompletedDate: "",
            testDueDate: "",
            testFrequency: "",
            testPlans: "",
            testResultName: "",
            testResults: "",
            filemodel: []
        };


        $scope.addTestPlan = function(){
            var headers= ["Test Plan", "Region", "Status", "File Name", "Test Due Date", "Priority"],
                cols =["testPlanName", "regionName", "controlStatus", "fileName", "dueDate", "controlPriority"];

            $rootScope.app.Mask = true;
            ControlService.GetTestPlans(10, 1).then(function(data){
                data.forEach(function(c, i){
                    c.Selected = false;
                    c.dueDate = c.testDueDate? moment(Utils.createDate(c.testDueDate)).format('DD/MM/YYYY'):'None';
                });
                $rootScope.app.Mask = false;
            });
        };

        $scope.removeItem = function(type, idx) {
            $scope.VM[type].splice(idx, 1);
        };

        $scope.submitAction = function() {
            if($scope.Form.TestResult.$invalid) return false;

            var dtype = 'YYYY-MM-DD';
            var d1 = moment($scope.VM.testCompletedDate);
            var d2 = moment($scope.VM.testDueDate);
            $scope.VM.testCompletedDate = (d1.isValid()) ? d1.format(dtype) : '';
            $scope.VM.testDueDate = (d2.isValid()) ? d2.format(dtype) : '';
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
                    ControlService.AddTestResults($scope.VM).then(function (res) {
                        console.log('res',res);
                    }).finally(function () {
                        $state.go('app.control.testresult.main');
                    });
                }
            });
        };

        $scope.cancelAction = function() {
            if($scope.Form.TestResult.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){ $state.go('app.control.testresult.main'); });
                return false;
            }
            $state.go('app.control.testresult.main');
        };

        $rootScope.app.Mask = false;
    }
})();