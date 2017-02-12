(function () {
    TestPlanController.$inject = ['$scope', '$rootScope', '$state', '$filter', 'ControlService', 'Utils'];
    app.controller('TestPlanCtrl', TestPlanController);

    function TestPlanController($scope, $rootScope, $state, $filter, ControlService, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Control Test Plan";

        $scope.OpList = [5, 10, 25, 50, 100];
        $scope.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'riskName',
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

        $scope.delete = function (r) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                $rootScope.app.Mask = true;
                ControlService.DeleteTestPlans(r.id).then(function (data) {
                    console.log(data);
                    if (data.status === 200) loadTestPlans();
                });
            }, function () {
                $rootScope.app.Mask = false;
            });
        };

        loadTestPlans();
        function loadTestPlans() {
            ControlService.GetTestPlans($scope.PerPage, $scope.CurrPage).then(function (data) {

                for(var i in data){
                    var tp = data[i];
                    if(tp.department == null) continue;
                    if(tp.department.length < 1) continue;

                    tp.deptName = tp.department[0].deptName;
                }

                $scope.Grid1.Total = data.length;
                $scope.Grid1.Data = data;

                $rootScope.app.Mask = false;
            });
        }

        $scope.selectAll = function () {
            var chk = $scope.all_check;
            $('.table>tbody').find('input:checkbox').each(function (i) {
                this.checked = chk;
            });
        }

    }
})();