(function () {
    DashboardController.$inject = ['$scope', '$rootScope', '$state', '$filter', 'ControlService', 'ChartFactory', 'Utils'];
    app.controller('ControlDashboardCtrl', DashboardController);

    function DashboardController($scope, $rootScope, $state, $filter, ControlService, ChartFactory, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = 'Control Dashboard';

        $scope.IsAsc = true;

        $scope.OpList = [10, 25, 50, 100];
        $scope.PerPage = 10;


        ControlService.GetByCategory().then(function (status) {
            setupCategoryChart(status);
            return ControlService.GetByCtrlDefn();
        }).then(function (per) {
            setupDefinitionChart(per);
            return ControlService.GetBySoure();
        }).then(function (per) {
            setupSourceChart(per);
            return ControlService.GetRiskType();
        }).then(function (per) {
            setupRisktypeChart1(per);
            return ControlService.GetByTePeriod();
        }).then(function (per) {
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


        function setupCategoryChart(data) {
            var dataAry = data.bycateogry;
            var dataList = [];
            Object.keys(dataAry).forEach(function (k) {
                dataList.push([k, dataAry[k]]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('Controls by Category', 'Controls by Category', dataList, ['#E0ED00', '#1372DF', '#24CBE5', '#1CB400']);
            Highcharts.chart('categoryChart', chartObj);
        }

        function setupDefinitionChart(data) {
            var dataAry = data.byctrldefn;
            var dataList = [];
            Object.keys(dataAry).forEach(function (k) {
                dataList.push([k, dataAry[k]]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('Controls by Definition', 'Controls by Definition', dataList, ['#1372DF', '#E0ED00']);
            Highcharts.chart('definitionChart', chartObj);
        }


        function setupRisktypeChart(data) {
            var dataAry = data.bycateogry;
            var dataList = [];
            Object.keys(dataAry).forEach(function (k) {
                dataList.push([k, dataAry[k]]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('Controls by RiskType', 'Controls by RiskType', dataList, ['#E0ED00', '#24CBE5', '#1372DF', '#00E219', '#1CB400', '#8A8A8A']);
            Highcharts.chart('risktypeChart', chartObj);
        }

        function setupSourceChart(data) {
            var dataAry = data.bysource;
            var opts = {
                Title: "Controls By Source",
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
            ChartFactory.SetupColChart('sourceChart', opts);
        }

        function setupRisktypeChart1(data) {
            var dataAry = data.bycateogry;
            var opts = {
                Title: "Controls By Risk Type",
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
            Highcharts.chart('risktypeChart', chartObj);
        }

        function setupTePeriodChart (data){

            var month, opts = {
                Title: "CONTROLS BEING TESTED By Period",
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
                Title: "CONTROLS BEING TESTED By Risk Type",
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
                Title: "CONTROLS BEING TESTED By Source",
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

        function setupStatusChart(data) {

            var serTypes = { approved: 'Approved', completed: 'Completed', in_progress: 'In Progress', ready_to_approve: 'Ready to Approve', submitted: 'Submitted', to_approve: 'To Approve' };
            var cats = [], currCats = [];
            var serList = [
                { name: 'Approved', data: [] },
                { name: 'Completed', data: [] },
                { name: 'In Progress', data: [] },
                { name: 'Ready to Approve', data: [] },
                { name: 'Submitted', data: [] },
                { name: 'To Approve', data: [] }
            ];

            Object.keys(serTypes).forEach(function(ck){
                cats.push(ck);
            });

            cats.forEach(function(cat, i){
                currCats = $filter('filter')(Object.keys(data), cat);
                currCats.forEach(function(c){
                    if(c.indexOf(' approved')>-1) {
                        serList[0].data.push(data[c]);
                    }
                    if(c.indexOf(' completed')>-1) {
                        serList[1].data.push(data[c]);
                    }
                    if(c.indexOf(' in_progress')>-1) {
                        serList[2].data.push(data[c]);
                    }
                    if(c.indexOf(' ready_to_approve')>-1) {
                        serList[3].data.push(data[c]);
                    }
                    if(c.indexOf(' submitted')>-1) {
                        serList[4].data.push(data[c]);
                    }
                    if(c.indexOf(' to_approve')>-1) {
                        serList[5].data.push(data[c]);
                    }
                });
            });

            cats.forEach(function(c, i){ cats[i] = serTypes[c]; });
            console.log(serList);

            Highcharts.chart('regionstacked', {
                chart: { type: 'bar' },
                title: { text: 'By Region' },
                xAxis: {
                    categories: cats
                },
                yAxis: {
                    min: 0,
                    title: { text: 'By Re' }
                },
                legend: {  reversed: false },
                plotOptions: {
                    series: { stacking: 'normal' }
                },
                series: serList
            });
        }
    }
})();
