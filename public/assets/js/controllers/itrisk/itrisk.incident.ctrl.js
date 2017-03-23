(function () {
    "use strict";

    ITRiskIncidentController.$inject = ['$scope', '$rootScope', '$state', '$filter', 'ITRiskService', 'ChartFactory', 'Utils'];
    app.controller('ITRiskIncCtrl', ITRiskIncidentController);

    function ITRiskIncidentController($scope, $rootScope, $state, $filter, ITRiskService, ChartFactory, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "IT Risk Incident Mangement Doashboard";

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

        ITRiskService.GetRimStatus()
            .then(function (data) {
                ChartFactory.CreatePieChart('Risk Type Severity', 'Risk Type Severity', data, 'statusChart');
                return ITRiskService.GetRimPeriod()
            })
            .then(function (data) {
                ChartFactory.CreateMultiColChart('By Period', data, 'periodChart');
                return ITRiskService.GetRimRiskCategory()
            })
            .then(function (data) {
                ChartFactory.CreateStackedChart($filter, data, 'catChart');
                loadRim()
            });

        $scope.deleteAction = function (r) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item", "Yes", "No");
            confirmation.result.then(function () {
                console.log("U chose Yes");
                $rootScope.app.Mask = true;
                ITRiskService.DeleteRim(r.id).then(function (data) {
                    if (data.status === 200) loadRim();
                });
            });
        };

        $scope.editAction = function (r) {

        };

        function loadRim() {
            ITRiskService.GetRim().then(function (data) {
                data.forEach(function (r) {
                    r.IDate = Utils.createDate(r.identifiedDate);
                });

                $scope.Grid1.Total = data.length;
                $scope.Grid1.Data = data;

                $rootScope.app.Mask = false;
            });
        }

    }
})();