(function(){
    'use strict';

    RemediationsController.$inject = ['$scope','$rootScope','$state', '$filter', 'MitigateService', 'ChartFactory', 'Utils'];
    app.controller('RemediationsCtrl', RemediationsController);

    function RemediationsController ($scope, $rootScope, $state, $filter, MitigateService, ChartFactory, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Remediations";

        $scope.CurrCol = 'riskName';
        $scope.IsAsc = true;

        $scope.OpList = [10, 25, 50, 100];
        $scope.PerPage = 10;

        $scope.sortMe = function(col){
            if($scope.CurrCol === col)
                $scope.IsAsc = !$scope.IsAsc;
            else
                $scope.CurrCol = col;
        };

        $scope.resSort = function(col){
            if($scope.CurrCol === col){
                return $scope.IsAsc? 'fa-sort-up' : 'fa-sort-down';
            } else {
                return 'fa-unsorted';
            }
        };

        MitigateService.GetStatus().then(function(status){
            setupStatusChart(status);
            return MitigateService.GetPeriod();
        }).then(function(per){
            setupPeriodChart(per);
            return MitigateService.GetRiskCategory();
        }).then(function(cats){
            setupCatChart(cats);
            return MitigateService.GetSeverity();
        }).then(function(sev){
            setupSeverityChart(sev);
            $scope.$watch('PerPage', function(n, o){
                $rootScope.app.Mask = true;
                loadRemediations();
            });
        });

        function loadRemediations() {
            MitigateService.GetRemediations().then(function(data) {
                data.forEach(function(r, i){
                    // r.remediationDate = Utils.createDate(r.RemediationDate) || new Date();
                    // r.identifiedDate = r.IdentifiedDate.hasOwnProperty('year')? Utils.createDate(r.IdentifiedDate) : Date.parse(r.IdentifiedDate);
                });
                $scope.Data = data;
                $rootScope.app.Mask=false;
            });
        }

        function setupSeverityChart(data) {
            var dataList = [];
            Object.keys(data).forEach(function(k){ dataList.push([k, data[k]]); });
            var chartObj = ChartFactory.CreatePieChartTemplate('Risk Type Severity', 'Risk Type Severity', dataList, ['#DC3804', '#DFD200', '#ED7000']);
            Highcharts.chart('severityChart', chartObj);
        }

        function setupStatusChart(data) {
            var dataList = [];
            Object.keys(data).forEach(function(k){ dataList.push([k, data[k]]); });
            var chartObj = ChartFactory.CreatePieChartTemplate('Remediations By Status', 'emediations By Status', dataList, ['#E0ED00', '#1372DF', '#24CBE5', '#00E219', '#1CB400', '#8A8A8A']);
            Highcharts.chart('statusChart', chartObj);
        }

        function setupPeriodChart (data){

            var month, opts = {
                Title: "Remediations By Period",
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

            ChartFactory.SetupMultiColChart('periodChart', opts);
        }

        function setupCatChart(data){

            var opts = {
                Title: "Remediations By Risk Types",
                YText: "Values",
                Categories : [],
                Series: [
                    { name: "High", data: [], color:'#c62733'},
                    { name: "Medium", data: [], color:'#db981f' },
                    { name: "Low", data: [], color:'#00d356' }
                ]
            };

            Object.keys(data.categories).forEach(function(k){ opts.Categories.push(data.categories[k])});
            console.log(opts.Categories);
            opts.Categories.forEach(function(ck){
                $filter('filter')(Object.keys(data['risk category status']), ck).forEach(function(s, i){
                    if(s.indexOf(' High')>-1) opts.Series[0].data.push(data['risk category status'][s]);
                    if(s.indexOf(' Med')>-1)  opts.Series[1].data.push(data['risk category status'][s]);
                    if(s.indexOf(' Low')>-1)  opts.Series[2].data.push(data['risk category status'][s]);
                });
            });
            console.log(opts.Series);
            ChartFactory.SetupMultiColChart('categoryChart', opts);
        }
    }
})();
