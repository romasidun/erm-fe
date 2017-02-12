(function(){
    OprIncidentController.$inject = ['$scope','$rootScope','$state', '$filter', 'OPRiskService', 'ChartFactory', 'Utils'];
    app.controller('OprIncidentCtrl', OprIncidentController);

    function OprIncidentController ($scope, $rootScope, $state, $filter, OPRiskService, ChartFactory, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "OPERATIONAL RISK INCIDENT";

        $scope.OpList = [5, 10, 25, 50, 100];
        $scope.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'rcsa_name',
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

        $scope.deleteAction = function(r){
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                console.log("U chose Yes");
                $rootScope.app.Mask = true;
                OPRiskService.DeleteRisk(r.id).then(function(data){
                    if(data.status===200) loadRisksList();
                });
            });
        };

        $scope.editAction = function(r){
            console.log(111);
        };

        OPRiskService.GetRiskStatus().then(function (data) {
            ChartFactory.CreatePieChart('ORI by status', 'ORI by status', data, 'oriChart');
            return OPRiskService.GetRiskPeriod();
        }).then(function (data) {
            ChartFactory.CreateMultiColChart("Status by Period",data,'periodChart');
            return OPRiskService.GetRiskCategories();
        }).then(function (data) {
            ChartFactory.CreateStackedChart($filter, data, 'oristacked');
            loadRisksList();
        });

        function loadRisksList(next) {
            OPRiskService.LoadOpRiskList().then(function(data) {
                data.forEach(function(r){ r.IDate = Utils.createDate(r.identifiedDate); });

                $scope.Grid1.Total = data.length;
                $scope.Grid1.Data = data;

                if(next) next();
                $rootScope.app.Mask = false;
            });
        }
    }
})();