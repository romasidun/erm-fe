/**
 * Created by Jafeez on 26/01/2017.
 */
(function(){
    'use strict';

    ScoreController.$inject = ['$scope','$rootScope','$state',  'RiskDataService', 'ChartFactory', 'Utils'];
    app.controller('VendScoreCardCtrl', ScoreController);

    function ScoreController ($scope, $rootScope, $state, RiskDataService, ChartFactory, Utils){

        $scope.mainTitle = $state.current.title;
        $rootScope.app.Mask = false;

        $scope.VendList = {};
        $scope.VendOpts = [];
        RiskDataService.GetRiskMetrics().then(function(data){
            //Setup Model for Single Vendor Chart Control
            data.forEach(function(v){
                if(!$scope.VendList.hasOwnProperty(v.vendorName)){
                    $scope.VendOpts.push(v.vendorName);
                    $scope.VendList[v.vendorName] = [];
                }
                $scope.VendList[v.vendorName].push(v);       
            });

            //init Single Vendor Chart
            $scope.CurrVendor  = $scope.VendOpts[0];
            $scope.$watch('CurrVendor', function(nv){
                setupVendorChart(nv);
            });

            //MultiVendor Chart load
            setupMultiVendChart(data);
        });

        $scope.selectVendor = function(v){ $scope.CurrVendor = v };
        $scope.$watch('CurrVendor', function(nv){
            if(nv) setupVendorChart(nv);
        });

        function setupMultiVendChart(data){
            var XCategories = ['overallRiskWeight', 'overallFindingWeight'];
            var ChartOpts = {
                Title: 'Multi-Vendor Risk  Ratings',
                XCategories: [],
                YCategories: [],
                SeriesName: 'Risk Ratings',
                SeriesData: []
            };

            for(var i in $scope.VendOpts){
                ChartOpts.XCategories.push($scope.VendOpts[i]+'-ORW');
                ChartOpts.XCategories.push($scope.VendOpts[i]+'-OFW');
            }
            console.log(ChartOpts.XCategories);

            $scope.VendList[$scope.VendOpts[0]].forEach(function(li){ 
                ChartOpts.YCategories.push(li.riskCategory);
            });

            var xval1, xval2, yval;
            data.forEach(function(li){
                yval = ChartOpts.YCategories.indexOf(li.riskCategory);
                xval1 = ChartOpts.XCategories.indexOf(li.vendorName+'-ORW');
                xval2 = ChartOpts.XCategories.indexOf(li.vendorName+'-OFW');
                ChartOpts.SeriesData.push({ y: yval, x: xval1, value: li.overallRiskWeight, color: cellColor(li.overallRiskWeight) });
                ChartOpts.SeriesData.push({ y: yval, x: xval2, value: li.overallFindingWeight, color: cellColor(li.overallFindingWeight) });
            });

            console.log(ChartOpts);

            ChartFactory.BuildHeatMap('multiVendHeatMap', ChartOpts);
        }

        function setupVendorChart(vend){
            var XCategories = ['responsesNumYes', 'responsesNumNo', 'responsesNumNA', 'findingTotal', 'overallRiskWeight', 'overallFindingWeight'];
            var ChartOpts = {
                Title: vend +' Risk  Ratings',
                XCategories: ['RY', 'RN', 'RNA', 'TF', 'RS', 'TFW'],
                YCategories: [],
                SeriesName: 'Risk Ratings',
                SeriesData: []
            };

            $scope.VendList[vend].reverse().forEach(function(li, i){
                ChartOpts.YCategories.push(li.riskCategory);
                XCategories.forEach(function(xc, j){
                    ChartOpts.SeriesData.push({ y: i, x: j, value: li[xc], color: cellColor(li[xc]) });
                });
            });
            ChartFactory.BuildHeatMap('vendorHeatMap', ChartOpts);
        }

        function cellColor(val) {
            var ranges = [0, 20, 40, 60, 80, 100, 120, 150, 180];
            var colors = ['#F34A4D', '#E3500A', '#FF9109', '#FFDB27', '#D3FF12', '#35D321', '#92F115', '#229C00'];
            var resCol = '#E3001F';
            for(var i in ranges){
                if(i>0){
                    if(val > ranges[i]) resCol = colors[i-1];
                }
            }

            return resCol;
        }

    }
})();