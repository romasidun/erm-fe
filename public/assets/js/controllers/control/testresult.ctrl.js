(function(){
    TestResultController.$inject = ['$scope','$rootScope','$state', '$filter', 'ControlService', 'Utils'];
    app.controller('TestResultCtrl', TestResultController);

    function TestResultController ($scope, $rootScope, $state, $filter, ControlService, Utils){
       $scope.mainTitle = $state.current.title;
       $scope.mainDesc = "Control Test Result";

        $scope.OpList = [5, 10, 25, 50, 100];
        $scope.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'testResultName',
            IsAsc: true,
            Filter: "",
            Total: 0,
            Data: [],
            SortMe: function(col){
                if($scope.Grid1.Column === col)
                    $scope.Grid1.IsAsc = !$scope.Grid1.IsAsc;
                else
                    $scope.Grid1.Column = col;
            },
            GetIco: function(col){
                if($scope.Grid1.Column === col){
                    return $scope.Grid1.IsAsc? 'fa-sort-up' : 'fa-sort-down';
                } else {
                    return 'fa-unsorted';
                }
            }
        };
        $scope.$watch('Grid1.Filter', function(n, o){
            var searchedData = $filter('filter')($scope.Grid1.Data, $scope.Grid1.Filter);
            $scope.Grid1.Total = searchedData.length;
        });
        /*$scope.$watch('Grid1.PerPage', function(n, o){
            loadTestResults();
        });
        $scope.$watch('Grid1.CurrPage', function(n, o){
            loadTestResults();
        });*/

        $scope.delete = function(r){
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item", "Yes", "No");
            confirmation.result.then(function () {
                $rootScope.app.Mask = true;
                ControlService.DeleteTestResults(r.id).then(function(data){
                    if(data.status===200) loadTestResults();
                });
            }, function(){ $rootScope.app.Mask = false; });
        };

        loadTestResults();
        function loadTestResults() {
            ControlService.GetTestResults($scope.Grid1.PerPage, $scope.Grid1.CurrPage || 1).then(function (data) {
                $scope.TestResults = [];
                data.forEach(function(tr){
                    tr.dueDate = new Date(tr.testDueDate);
                    tr.testCompletedDate = new Date(tr.testCompletedDate);
                    if(tr.department != null)
                        tr.deptName = tr.department[0].deptName || '' ;
                });
                $rootScope.app.Mask = false;

                $scope.Grid1.Total = data.length;
                $scope.Grid1.Data = data;
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