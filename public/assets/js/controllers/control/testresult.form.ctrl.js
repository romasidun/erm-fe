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
             department: [],
             id: "",
             modifiedBy: "",
             modifiedOn: "",
             regionName: "",
             testCompletedDate: "",
             testDueDate: "",
             testFrequency: "",
             testPlans: "",
             testResultName: "",
             testResults: "",
             testresultFileModel: []
        };

        $scope.addControls = function () {
            var headers = ["Control Category", "Control ID", "Control Name", "Control Source", "Business Procee", "Owner"],
                cols = ["controlCategory", "controlRefID", "controlName", "controlSource", "businessProcess", "controlOwner"];

            $rootScope.app.Mask = true;
            OPRiskService.GetControlData().then(function (data) {
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

        $scope.addtestResult = function(){

            console.log("Getsss");
            var headers= ["Test Plan", "Region", "Status", "Test Due Date", "Priority"],
                cols =["testPlanName", "regionName", "controlStatus",, "testDueDate", "controlPriority"];

            $rootScope.app.Mask = true;
            ControlService.GetTestPlans(10, 1).then(function(data){
                data.forEach(function(c, i){
                    c.Selected = false;
                    c.fileName = c.testplanFileModel.length? "See attached": "None";
                    c.dueDate = c.testDueDate? moment(Utils.createDate(c.testDueDate)).format('DD/MM/YYYY'):'None';
                });
                console.log(data);
                var controlModal = Utils.CreateSelectListView("Select Controls", data, headers, cols);
                console.log(controlModal);
                controlModal.result.then(function(list){
                    $scope.VM.testresultFileModel = $scope.VM.testresultFileModel.concat(list);
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
            ControlService.AddTestResults($scope.VM).then(function (res) {
                console.log(res);
                if(res.status===200) $state.go('app.control.testresult.main');
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