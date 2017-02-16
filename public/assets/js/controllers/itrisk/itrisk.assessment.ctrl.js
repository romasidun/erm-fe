(function () {
    ITRiskAssController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'ITRiskService', 'ChartFactory', 'Utils'];
    app.controller('ITRiskAssCtrl', ITRiskAssController);

    function ITRiskAssController($scope, $rootScope, $state, $uibModal, $filter, ITRiskService, ChartFactory, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "";
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

        ITRiskService.GetRamStatus().then(function (data) {
            ChartFactory.CreatePieChart('Risk Type Severity', 'Risk Type Severity', data, 'statusChart');
            // setupPieChart(data);
            return ITRiskService.GetRamPeriod();
        }).then(function (data) {
            ChartFactory.CreateMultiColChart('By Period', data, periodChart);
            // setupPeriodChart(data);
            return ITRiskService.GetRamDept();
        }).then(function (data) {
            //ChartFactory.CreateLabelChart('By Department', 'Risk Type Severity', '', '', '', data, 'deptChart');
            ChartFactory.CreatePieChart('By Department', 'Risk Type Severity', data, 'deptChart');
            // setupDeptChart(data);
            loadRam();
        });

        $scope.downloadTemp = function () {
            var dlTmpModal = $uibModal.open({
                templateUrl: 'tmpdownload.tpl.html',
                controller: 'TmpDlCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        return {
                            TempLoader: ITRiskService.GetTemplate()
                        };
                    }
                }
            });
            // // console.log('dlTmpModal',TempLoader);
            // return;
            //
            dlTmpModal.result.then(function (updEquip) {
                console.log("Done");
            });
        };

        $scope.deleteAction = function (r) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                console.log("U chose Yes");
                $rootScope.app.Mask = true;
                ITRiskService.DeleteRam(r.id).then(function (data) {
                    if (data.status === 200) loadRam();
                });
            });
        };

        $scope.editAction = function (r) {

        };

        function loadRam() {
            ITRiskService.GetRam().then(function (data) {
                data.forEach(function (r) {
                    r.IDate = Utils.createDate(r.modifiedOn);
                });

                $scope.Grid1.Total = data.length;
                $scope.Grid1.Data = data;

                $rootScope.app.Mask = false;
            });
        }

        function drawRegionChart() {
            if ($rootScope.app.Mask) return;
            var categories = [];
            $rootScope.app.Lookup.LIST001.forEach(function (item) {
                categories.push(item.val);
            });
            var tempAry = new Array();
            $scope.Grid1.Data.forEach(function (row) {
                var approval = row.approval;
                var region = row.region;
                if (region.indexOf('Asia') !== -1)
                    region = 'Asia';
                if (region.indexOf('EMEA') !== -1)
                    region = 'South America';

                if (typeof(tempAry[approval]) == 'undefined') {
                    var ary = Array.apply(null, Array(categories.length)).map(Number.prototype.valueOf, 0);
                    tempAry[approval] = ary;
                }

                var ind = categories.indexOf(region);
                if (ind < 0) return;
                tempAry[approval][ind]++;
            });

            var series = [];
            for (var k in tempAry) {
                series.push({
                    name: k,
                    data: tempAry[k]
                })
            }
            var config = {
                Text: 'By Region',
                Title: '',
                Categories: categories,
                Series: series
            };
            config = ChartFactory.SetupStackedChart(config);
            Highcharts.chart('regionChart', config);
        }

        $scope.$watch('Grid1.Data', function (n, o) {
            drawRegionChart();
        });

    }
})();