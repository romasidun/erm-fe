(function () {
    DashboardtestedController.$inject = ['$scope', '$rootScope', '$state', '$filter', 'ControlService', 'ChartFactory', 'Utils'];
    app.controller('ControlDashboardtestedCtrl', DashboardtestedController);

    function DashboardtestedController($scope, $rootScope, $state, $filter, ControlService, ChartFactory, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = 'Control TESTED Dashboard';

        $scope.IsAsc = true;

        $scope.OpList = [10, 25, 50, 100];
        $scope.PerPage = 10;


        ControlService.GetByTePeriod().then(function (per) {
            setupTePeriodChart(per);
            return ControlService.GetByTeCategory();
        }).then(function (per) {
            setupTeCategoryChart(per);
            return ControlService.GetTeRiskType();
        }).then(function (per) {
            setupTeRisktypeChart(per);
            return ControlService.GetTeBySoure();
        }).then(function (per) {
            setupTeSourceChart(per);
            $rootScope.app.Mask = false;
        });

        function setupTePeriodChart (data){

            var month, opts = {
                Title: "CONTROLS BEING TESTED by Period",
                YText: "Values",
                Categories : [],
                Series: [
                    { name: "High", data: [], color:'#c62733' },
                    { name: "Medium", data: [], color:'#db981f' },
                    { name: "Low", data: [], color:'#00d356' }
                ]

            };
            Object.keys(data).forEach(function(k){
                if(k.indexOf('High')>-1) {
                    month = Utils.camelizeString(k.split('High')[0]);
                    opts.Series[0].data.push(data[k]);
                }
                if(k.indexOf('Med')>-1) {
                    month = Utils.camelizeString(k.split('Med')[0]);
                    opts.Series[1].data.push(data[k]);
                }
                if(k.indexOf('Low')>-1) {
                    month = Utils.camelizeString(k.split('Low')[0]);
                    opts.Series[2].data.push(data[k]);
                }
                if(opts.Categories.indexOf(month)===-1)
                    opts.Categories.push(month);
            });

            ChartFactory.SetupMultiColChart('tePeriodChart', opts);
        }

        function setupTeCategoryChart(data) {
            var dataAry = data.bycateogry;
            var dataList = [];
            Object.keys(dataAry).forEach(function (k) {
                dataList.push([k, dataAry[k]]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('CONTROLS BEING TESTED by Category', 'CONTROLS BEING TESTED by Category', dataList, ['#E0ED00', '#1372DF', '#24CBE5', '#1CB400']);
            Highcharts.chart('teCategoryChart', chartObj);
        }

        function setupTeRisktypeChart(data) {
            var dataAry = data.bycateogry;
            var opts = {
                Title: "CONTROLS BEING TESTED by Risk Type",
                subTitle: "",
                yTitle: "",
                tooltip: "",
                Categories : [],
                Series: 'Risk Type',
                Data : null
            };
            var dataList = [];
            Object.keys(dataAry).forEach(function (k) {
                dataList.push([k, dataAry[k]]);
            });
            opts.Data = dataList;
            var chartObj = ChartFactory.SetupLabelChart(opts);
            console.clear();
            console.log(chartObj);
            Highcharts.chart('teRisktypeChart', chartObj);
        }

        function setupTeSourceChart(data) {
            var dataAry = data.bysource;
            var opts = {
                Title: "CONTROLS BEING TESTED by Source",
                YText: "Values",
                Categories : [],
                Series: 'Source',
                Data : []
            };

            Object.keys(dataAry).forEach(function (k) {
                opts.Categories.push(k);
                opts.Data.push(dataAry[k]);
            });
            console.log(opts);
            ChartFactory.SetupColChart('teSourceChart', opts);
        }
    }
})();
