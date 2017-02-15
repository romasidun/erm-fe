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

        MitigateService.GetStatus().then(function(data){
            ChartFactory.CreatePieChart('Remediations By Status', 'emediations By Status', data, 'statusChart');
            return MitigateService.GetPeriod();
        }).then(function(data){
            ChartFactory.CreateMultiColChart('By Period', data, 'periodChart');
            return MitigateService.GetSeverity();
        }).then(function(data){
            console.log('datadatadatadata',data);
            return;
            ChartFactory.CreatePieChart('Remediations By Severity', 'Remediations By Severity', data, 'severityChart');
            return MitigateService.GetRiskCategory();
        }).then(function(data){
            // ChartFactory.CreateLabelChart('Risk Type Severity', 'Risk Type Severity', '', '', '', data, 'categoryChart');
            // setupSeverityChart(data);
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
            var opts = {
                Title: "Remediations By Severity",
                YText: "Values",
                Categories : [],
                Series: [
                    { name: "High", data: [], color:'#ffa500'},
                    { name: "Medium", data: [], color:'#a52a2a' },
                    { name: "Low", data: [], color:'#ffff00' }
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

            ChartFactory.SetupMultiColChart('categoryChart', opts);
        }

        function setupCatChart(data){
            var opts = {
                Title: "Remediations By Category",
                YText: "Values",
                Categories : [],
                Series: [
                    { name: "High", data: [], color:'#ffa500'},
                    { name: "Medium", data: [], color:'#a52a2a' },
                    { name: "Low", data: [], color:'#ffff00' }
                ]
            };

            Object.keys(data.categories).forEach(function(k){ opts.Categories.push(data.categories[k])});
            opts.Categories.forEach(function(ck){
                $filter('filter')(Object.keys(data['risk category status']), ck).forEach(function(s, i){
                    if(s.indexOf(' High')>-1) opts.Series[0].data.push(data['risk category status'][s]);
                    if(s.indexOf(' Med')>-1)  opts.Series[1].data.push(data['risk category status'][s]);
                    if(s.indexOf(' Low')>-1)  opts.Series[2].data.push(data['risk category status'][s]);
                });
            });

            ChartFactory.SetupMultiColChart('statusChart', opts);
        }
    }
})();
