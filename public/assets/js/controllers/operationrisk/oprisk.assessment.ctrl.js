(function(){
    "use strict";

    OprAssessmentCtrl.$inject = ['$scope','$rootScope','$state', '$filter', '$uibModal', 'OPRiskService', 'ChartFactory', 'Utils'];
    app.controller('OprAssessmentCtrl', OprAssessmentCtrl);

    function OprAssessmentCtrl ($scope, $rootScope, $state, $filter, $uibModal, OPRiskService, ChartFactory, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "RISK CONTROL SELF ASSESSMENTS";

        $scope.CurrCol = 'assessName';
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
            var rcsaChrt = [];
            Object.keys(data).forEach(function (k) {
                rcsaChrt.push({key: Utils.camelizeString(k), val: data[k]});
            });
            setupPieChart(rcsaChrt);
            return OPRiskService.GetRSAPeriod();
        }).then(function(data){
            setupPeriodChart(data);
            return OPRiskService.GetRSARegion();
        }).then(function(data){
            setupStatusChart(data);
            return OPRiskService.GetRSADept();
        }).then(function(data){
            setupDeptChart(data);
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
                $scope.Assess = data;
                $rootScope.app.Mask = false;
            });
        }

        function setupPieChart(rcsa) {
            var dataList = [];
            rcsa.forEach(function(o){ dataList.push([o.key, o.val]); });
            var chartObj = ChartFactory.CreatePieChartTemplate('RCSA by status', 'RCSA by status', dataList, ['#D936ED', '#2B35DF', '#8EB42E', '#159008', '#B49400', '#9F6CE5']);
            Highcharts.chart('rcsaStatus', chartObj);
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

        function setupPeriodChart(data){
            var month, opts = {
                Title: "By Period",
                YText: "Values",
                Categories : [],
                Series: [
                    { name: "High", data: [] },
                    { name: "Medium", data: [] },
                    { name: "Low", data: [] }
                ],
                Colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']

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

        function setupDeptChart(data) {

            var cats = [], currCats = [];
            var serList = [
                { name: 'Low', data: [] },
                { name: 'Medium', data: [] },
                { name: 'High', data: [] }
            ];

            Object.keys(data).forEach(function(ck){
                if(cats.indexOf(Utils.removeLastWord(ck))===-1) cats.push(Utils.removeLastWord(ck));
            });
            cats.forEach(function(cat, i){
                currCats = $filter('filter')(Object.keys(data), cat);
                currCats.forEach(function(c){
                    if(c.indexOf('Low')>-1) {
                        serList[0].data.push(data[c]);
                    }
                    if(c.indexOf('Med')>-1) {
                        serList[1].data.push(data[c]);
                    }
                    if(c.indexOf('High')>-1) {
                        serList[2].data.push(data[c]);
                    }
                });
            });

            Highcharts.chart('deptstacked', {
                chart: { type: 'bar' },
                title: { text: 'By Department' },
                xAxis: {
                    categories: cats
                },
                yAxis: {
                    min: 0,
                    title: { text: 'By Department' }
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
