(function () {
    ITRiskAssController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'ITRiskService', 'ChartFactory', 'Utils'];
    app.controller('ITRiskAssCtrl', ITRiskAssController);

    function ITRiskAssController($scope, $rootScope, $state, $uibModal, $filter, ITRiskService, ChartFactory, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "RISK CONTROL SELF ASSESSMENTS";

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
            return ITRiskService.GetRamRegion();
        }).then(function (data) {
            setupRegionChart(data);
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
                            Templates: []
                        };
                    }
                }
            });

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

        function setupPieChart(data) {
            var series = [];
            Object.keys(data).forEach(function (k) {
                series.push([k, data[k]]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('Risk Type Severity', 'Risk Type Severity', series, ['#EDA300', '#1372DF', '#8EB42E', '#9F6CE5', '#4093E2', '#B49400']);
            Highcharts.chart('statusChart', chartObj);
        }

        function setupPeriodChart(data) {

            var month, opts = {
                Title: "By Period",
                YText: "Values",
                Categories: [],
                Series: [
                    {name: "High", data: [], color: '#c62733'},
                    {name: "Medium", data: [], color: '#db981f'},
                    {name: "Low", data: [], color: '#00d356'}
                ]

            };

            Object.keys(data).forEach(function (k) {
                if (k.indexOf('High') > -1) {
                    month = Utils.camelizeString(k.split('High')[0]);
                    opts.Series[0].data.push(data[k]);
                }
                if (k.indexOf('Med') > -1) {
                    month = Utils.camelizeString(k.split('Med')[0]);
                    opts.Series[1].data.push(data[k]);
                }
                if (k.indexOf('Low') > -1) {
                    month = Utils.camelizeString(k.split('Low')[0]);
                    opts.Series[2].data.push(data[k]);
                }
                if (opts.Categories.indexOf(month) === -1)
                    opts.Categories.push(month);
            });

            ChartFactory.SetupMultiColChart('periodChart', opts);
        }

        function setupRegionChart(data) {

            var opts = {
                Title: "By Region",
                YText: "Values",
                Categories: [],
                Series: [
                    {name: "In Progress", data: [], color: '#008000'},
                    {name: "Completed", data: [], color: '#ff0000'},
                    {name: "Submitted", data: [], color: '#ffff00'},
                    {name: "To Approve", data: [], color: '#ffc0cb'},
                    {name: "Ready To Approve", data: [], color: '#ffa500'},
                    {name: "Approved", data: [], color: '#0000ff'}
                ]
            }, cats = ['In Progress', 'Completed', 'Submitted', 'To Approve', 'Ready To Approve', 'Approved'];
            Object.keys(data).forEach(function (k) {
                if (opts.Categories.indexOf(Utils.removeLastWord(k)) === -1) opts.Categories.push(Utils.removeLastWord(k));
            });
            opts.Categories.forEach(function (c) {
                var filteredData = $filter('filter')(Object.keys(data), c);
                filteredData.forEach(function (ck) {
                    cats.forEach(function (ct, j) {
                        if (ck.indexOf(ct) > -1) {
                            opts.Series[j].data.push(data[ck]);
                        }
                    });
                });
            });

            ChartFactory.SetupMultiColChart('regionChart', opts);
        }

        function setupDeptChart(data) {

            var series = [];
            Object.keys(data).forEach(function (k) {
                series.push([k, data[k]]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('By Department', 'Risk Type Severity', series, ['#EDA300', '#1372DF', '#8EB42E', '#9F6CE5', '#4093E2', '#B49400']);
            Highcharts.chart('deptChart', chartObj);
        }

    }
})();