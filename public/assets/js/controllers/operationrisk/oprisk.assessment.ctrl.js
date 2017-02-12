(function(){
    "use strict";

    OprAssessmentCtrl.$inject = ['$scope','$rootScope','$state', '$filter', '$uibModal', 'OPRiskService', 'ChartFactory', 'Utils', 'APIHandler'];
    app.controller('OprAssessmentCtrl', OprAssessmentCtrl);

    function OprAssessmentCtrl ($scope, $rootScope, $state, $filter, $uibModal, OPRiskService, ChartFactory, Utils, APIHandler){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "RISK CONTROL SELF ASSESSMENTS";

        $scope.OpList = [5, 10, 25, 50, 100];
        $scope.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'assessName',
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

        $scope.downloadTemp = function(){
            var dlTmpModal = $uibModal.open({
                templateUrl: 'tmpdownload.tpl.html',
                controller: 'TmpDlCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        return {
                            TempLoader: OPRiskService.GetRSATemplates()
                        };
                    }
                }
            });

            dlTmpModal.result.then(function (updEquip) {
                console.log("Done");
            });
        };

        OPRiskService.GetRSAStatus().then(function(data){
            ChartFactory.CreatePieChart('Risk Type Severity', 'Risk Type Severity', data, 'rcsaStatus');
            return OPRiskService.GetRSAPeriod();
        }).then(function(data){
            ChartFactory.CreateMultiColChart('By Period', data, 'periodChart')
            // setupPeriodChart(data);
            return OPRiskService.GetRSARegion();
        }).then(function(data){
            setupStatusChart(data);
            return OPRiskService.GetRSADept();
        }).then(function(data){
            ChartFactory.CreateLabelChart('Risk Type Severity', '', '', '', 'severity', data, 'deptstacked');
            // setupDeptChart(data);
            $rootScope.app.Mask = false;
        });

        $scope.$watch('PerPage', function(n, o) {
            $rootScope.app.Mask = true;
            loadAssessments();
        });

        $scope.deleteAction = function(r){
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                console.log("U chose Yes");
                $rootScope.app.Mask = true;
                OPRiskService.DeleteAssessment(r.id).then(function(data){
                    if(data.status===200) loadAssessments();
                });
            });
        };

        $scope.editAction = function(r){

        };

        function loadAssessments() {
            OPRiskService.GetAssessments().then(function (data) {

                $scope.Grid1.Total = data.length;
                $scope.Grid1.Data = data;

                $rootScope.app.Mask = false;
            });
        }

        function setupStatusChart(data) {
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
            ChartFactory.SetupMultiColChart('regionstacked', opts);
        }

        // function setupPeriodChart(data){
        //     var month, opts = {
        //         Title: "",
        //         YText: "Values",
        //         Categories : [],
        //         Series: [
        //             { name: "High", data: [] },
        //             { name: "Medium", data: [] },
        //             { name: "Low", data: [] }
        //         ],
        //         Colors: ['#ffa500', '#a52a2a', '#ffff00']
        //
        //     };
        //     Object.keys(data).forEach(function(k){
        //         if(k.indexOf('High')>-1) {
        //             month = Utils.camelizeString(k.split('High')[0]);
        //             opts.Series[0].data.push(data[k]);
        //         }
        //         if(k.indexOf('Med')>-1) {
        //             month = Utils.camelizeString(k.split('Med')[0]);
        //             opts.Series[1].data.push(data[k]);
        //         }
        //         if(k.indexOf('Low')>-1) {
        //             month = Utils.camelizeString(k.split('Low')[0]);
        //             opts.Series[2].data.push(data[k]);
        //         }
        //         if(opts.Categories.indexOf(month)===-1)
        //             opts.Categories.push(month);
        //     });
        //     ChartFactory.SetupMultiColChart('', opts);
        // }

        // function setupDeptChart(data) {
        //     var series = [];
        //     Object.keys(data).forEach(function (k) {
        //         series.push([k, data[k]]);
        //     });
        //     var chartObj = ChartFactory.CreatePieChartTemplate(, series, ['#EDA300', '#1372DF', '#8EB42E', '#9F6CE5', '#4093E2', '#B49400']);
        //     Highcharts.chart('', chartObj);
        // }
    }
})();
