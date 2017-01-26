(function(){
    TestResultController.$inject = ['$scope','$rootScope','$state', 'ControlService', 'Utils'];
    app.controller('TestResultCtrl', TestResultController);

    function TestResultController ($scope, $rootScope, $state, ControlService, Utils){
       $scope.mainTitle = $state.current.title;
       $scope.mainDesc = "Control Test Result";

        $scope.CurrCol = 'testResultName';
        $scope.IsAsc = true;

        $scope.OpList = [10, 25, 50, 100];
        $scope.PerPage = 10;

        $scope.$watch('PerPage', function(n, o){
            $rootScope.app.Mask = true;
            loadTestResults();
        });

        $scope.sortMe = function(col){
            if($scope.CurrCol === col)
                $scope.IsAsc = !$scope.IsAsc;
            else
                $scope.CurrCol = col;
        };

        $scope.resSort = function(col){
            if($scope.CurrCol === col){
                return $scope.IsAsc? 'fa-sort-up' : 'fa-sort-down';
            } else {
                return 'fa-unsorted';
            }
        };

        $scope.delete = function(r){
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                $rootScope.app.Mask = true;
                ControlService.DeleteTestResults(r.id).then(function(data){
                    if(data.status===200) loadRepos();
                });
            }, function(){ $rootScope.app.Mask = false; });
        };

        function loadTestResults() {
            ControlService.GetTestResults($scope.PerPage, $scope.CurrPage || 1).then(function (data) {
                $scope.TestResults = [];
                data.forEach(function(tr){
                    tr.dueDate = new Date(tr.testDueDate);
                    tr.testCompletedDate = new Date(tr.testCompletedDate);
                    tr.deptName = tr.department[0].departmentName;
                });
                $scope.TestResults = data;
                $rootScope.app.Mask = false;
            });
        }

        $scope.selectAll = function(){
            var chk = $scope.all_check;
            $('.table>tbody').find('input:checkbox').each(function (i) {
                this.checked = chk;
            });
        }

    }
})();