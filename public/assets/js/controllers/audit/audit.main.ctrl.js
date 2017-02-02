(function () {
    AuditMainController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'ChartFactory', 'Utils'];
    app.controller('AuditMainCtrl', AuditMainController);

    function AuditMainController($scope, $rootScope, $state, $uibModal, $filter, AuditService, ChartFactory, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "AUDIT MANAGEMENT";

        AuditService.Audit_statusChart().then(function (data) {
            setupPieChart(data);
            return AuditService.OpenAudit_periodChart();
        }).then(function (data) {
            setupPeriodChart(data);
            return AuditService.Status_regionChart();
        }).then(function (data) {
            setupRegionChart(data);
            return AuditService.Action_statusChart();
        }).then(function (data) {
            setupDeptChart(data);
            $scope.$watch('PerPage', function (n, o) {
                $rootScope.app.Mask = true;
                loadRam();
            });
        });

        function loadRam() {
            AuditService.GetRam().then(function (data) {
                data.forEach(function (r) {
                    r.IDate = Utils.createDate(r.modifiedOn);
                });
                $scope.Incidents = data;
                $rootScope.app.Mask = false;
            });
        }

        function setupPieChart(data) {
            var series = [];
            Object.keys(data).forEach(function (k) {
                series.push([k, data[k]]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('Risk Type Severity', 'Risk Type Severity', series, ['#EDA300', '#1372DF', '#8EB42E', '#9F6CE5', '#4093E2', '#B49400']);
            Highcharts.chart('audit_statusChart', chartObj);
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

            ChartFactory.SetupMultiColChart('openAudit_periodChart', opts);
        }

        function setupRegionChart(data) {

            var opts = {
                Title: "By Region",
                YText: "Values",
                Categories: [],
                Series: [
                    {name: "In Progress", data: [], color: '#1016c6'},
                    {name: "Completed", data: [], color: '#00db72'},
                    {name: "Submitted", data: [], color: '#d37619'},
                    {name: "To Approve", data: [], color: '#d3000d'},
                    {name: "Ready To Approve", data: [], color: '#d3a209'},
                    {name: "Approved", data: [], color: '#c807d3'}
                ]
            }, cats = [' in_progress', ' completed', ' submitted', ' to_approve', ' ready_to_approve', ' approved'];
            Object.keys(data).forEach(function (k) {
                if (opts.Categories.indexOf(Utils.removeLastWord(k)) === -1) opts.Categories.push(Utils.removeLastWord(k));
            });
            opts.Categories.forEach(function (c) {
                $filter('filter')(Object.keys(data), c).forEach(function (ck) {
                    cats.forEach(function (ct, j) {
                        if (ck.indexOf(ct) > -1) opts.Series[j].data.push(data[ck]);
                    });
                });
            });
            console.log(opts);

            ChartFactory.SetupMultiColChart('status_regionChart', opts);
        }

        function setupDeptChart(data) {

            var dept, opts = {
                Title: "By Department",
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
                    dept = k.split('High')[0];
                    opts.Series[0].data.push(data[k]);
                }
                if (k.indexOf('Med') > -1) {
                    dept = k.split('Med')[0];
                    opts.Series[1].data.push(data[k]);
                }
                if (k.indexOf('Low') > -1) {
                    dept = k.split('Low')[0];
                    opts.Series[2].data.push(data[k]);
                }
                if (opts.Categories.indexOf(dept) === -1)
                    opts.Categories.push(dept);
            });

            ChartFactory.SetupMultiColChart('action_statusChart', opts);
        }

    }
})();