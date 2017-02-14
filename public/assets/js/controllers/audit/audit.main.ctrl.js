(function () {
    AuditMainController.$inject = ['$scope', '$rootScope', '$state', 'AuditService', 'ChartFactory', 'Utils', '$filter'];
    app.controller('AuditMainCtrl', AuditMainController);

    function AuditMainController($scope, $rootScope, $state, AuditService, ChartFactory, Utils, $filter) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "AUDIT MANAGEMENT";

        $scope.OpList = [5, 10, 25, 50, 100];
        $scope.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'auditName',
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

        AuditService.GetManageDept()
            .then(function (data) {
                setupMGDeptChart(data);
                return AuditService.GetFindingOpen();
            })
            .then(function (data) {
                setupFDOpenChart(data);
                return AuditService.GetManageStatus();
            })
            .then(function (data) {
                setupMGStatusChart(data);
                return AuditService.GetManagePeriod();
            })
            .then(function (data) {
                ChartFactory.CreateMultiColChart('By FindingOpen', data, 'audit_MGPeriod');
                return AuditService.GetManageRegion();
            })
            .then(function (data) {
                ChartFactory.CreateRegionChart(data, 'openFinding_periodChart', $filter );
                return AuditService.GetActionStatus();
            })
            .then(function (data){
                ChartFactory.CreatePieChart('By Status', 'action status', data, 'status_department');
                return AuditService.GetAudits();
            })
            .then(function (data){
                $scope.TestResults = [];
                data.forEach(function(tr){
                    tr.dueDate = new Date(tr.dateOccurance);
                });
                $rootScope.app.Mask = false;

                $scope.Grid1.Total = data.length;
                $scope.Grid1.Data = data;
                $scope.VM = data;
            });

        function CreateRegionChart(data) {
            console.log('datadata',data);
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
            console.log('optsoptsopts',opts);
            opts.Categories.forEach(function (c) {
                var filteredData = $filter('filter')(Object.keys(data), c);
                console.log('filteredDatafilteredDatafilteredData',filteredData);
                filteredData.forEach(function (ck) {
                    cats.forEach(function (ct, j) {
                        if (ck.indexOf(ct) > -1) {
                            opts.Series[j].data.push(data[ck]);
                        }
                    });
                });
            });
            console.log('optsoptsopts',opts);
            ChartFactory.SetupMultiColChart('openFinding_periodChart', opts);
        }

        function setupMGDeptChart(data) {
            var series = [];
            Object.keys(data).forEach(function (k) {
                series.push([k, data[k]]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('Management Department', 'Audit Management Department', series, ['#EDA300', '#1372DF', '#8EB42E', '#9F6CE5', '#4093E2', '#B49400']);
            Highcharts.chart('audit_MGDeptChart', chartObj);
        }

        function setupFDOpenChart(data) {
            var month, opts = {
                Title: "By FindingOpen",
                YText: "Values",
                Categories: [],
                Series: [
                    {name: "Draft", data: [], color: '#c62733'},
                    {name: "Review", data: [], color: '#db981f'},
                ]
            };

            Object.keys(data).forEach(function (k) {
                if (k.indexOf('Draft') > -1) {
                    month = Utils.camelizeString(k.split('High')[0]);
                    opts.Series[0].data.push(data[k]);
                }
                if (k.indexOf('Review') > -1) {
                    month = Utils.camelizeString(k.split('Med ')[0]);
                    opts.Series[1].data.push(data[k]);
                }
                if (opts.Categories.indexOf(month) === -1)
                    opts.Categories.push(month);
            });

            ChartFactory.SetupMultiColChart('audit_FDOpenChart', opts);
        }

        function setupMGStatusChart(data) {
            var series = [];
            Object.keys(data).forEach(function (k) {
                series.push([k, data[k]]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('Management Status', 'Management Status', series, ['#EFF300', '#E172DF', '#8EB33E', '#9F6CE5', '#4093E2', '#B49400']);
            Highcharts.chart('audit_MGStatus', chartObj);
        }


    }
})();