(function(){
    OprIncidentController.$inject = ['$scope','$rootScope','$state', '$filter', 'OPRiskService', 'ChartFactory', 'Utils'];
    app.controller('OprIncidentCtrl', OprIncidentController);

    function OprIncidentController ($scope, $rootScope, $state, $filter, OPRiskService, ChartFactory, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "OPERATIONAL RISK INCIDENT";

        $scope.CurrCol = 'rcsa_name';
        $scope.IsAsc = true;

        $scope.OpList = [10, 25, 50, 100];
        $scope.PerPage = 10;

        $scope.$watch('PerPage', function(n, o){
            $rootScope.app.Mask = true;
            loadRisksList();
        });

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

        $scope.deleteAction = function(r){
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                console.log("U chose Yes");
                $rootScope.app.Mask = true;
                OPRiskService.DeleteRisk(r.id).then(function(data){
                    if(data.status===200) loadRisksList();
                });
            });
        };

        $scope.editAction = function(r){
            console.log(111);
        };

        OPRiskService.GetRiskStatus().then(function (data) {
            $scope.ORI = [];
            Object.keys(data).forEach(function (k) {
                $scope.ORI.push({key: Utils.camelizeString(k), val: data[k]});
            });
            setupPieChart($scope.ORI);
            return OPRiskService.GetRiskPeriod();
        }).then(function (data) {
            setupPeriodChart(data);
            return OPRiskService.GetRiskCategories();
        }).then(function (data) {
            setupStackedChart(data);
            loadRisksList();
        });


        function loadRisksList(next) {
            OPRiskService.LoadOpRiskList().then(function(data) {
                data.forEach(function(r){ r.IDate = Utils.createDate(r.identifiedDate); });
                $scope.Risks = data;
                if(next) next();
                $rootScope.app.Mask = false;
            });
        }

        function setupPieChart(ori) {
            var dataList = [];
            ori.forEach(function(o){ dataList.push([o.key, o.val]); });
            var chartObj = ChartFactory.CreatePieChartTemplate('ORI by status', 'ORI by status', dataList, ['#E0ED00', '#1372DF', '#24CBE5', '#00E219', '#1CB400', '#06540E']);
            Highcharts.chart('oriChart', chartObj);
        }

        function setupPeriodChart(data){
            var month, opts = {
                Title: "Status by Period",
                YText: "Values",
                Categories : [],
                Series: [
                    { name: "High", data: [] },
                    { name: "Medium", data: [] },
                    { name: "Low", data: [] }
                ],
                Colors: ['#EC1400', '#BD830F', '#3975ED', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']
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

            console.log(opts);
            ChartFactory.SetupMultiColChart('periodChart', opts);
        }

        function setupStackedChart(data) {

            var cats = [], currCats = [];
           var serList = [
                   { name: 'High', data: [] },
                   { name: 'Medium', data: [] },
                   { name: 'Low', data: [] }
                ];

            Object.keys(data.categories).forEach(function(ck){ cats.push(data.categories[ck]); });

            cats.forEach(function(cat, i){
                currCats = $filter('filter')(Object.keys(data['risk category status']), cat);
                currCats.forEach(function(c){
                    if(c.indexOf('Low')>-1) {
                        serList[2].data.push(data['risk category status'][c]);
                    }
                    if(c.indexOf('Med')>-1) {
                        serList[1].data.push(data['risk category status'][c]);
                    }
                    if(c.indexOf('High')>-1) {
                        serList[0].data.push(data['risk category status'][c]);
                    }
                });
            });

            var chartObj = ChartFactory.SetupStackedChart({
                Text:"Status By Risk Category",
                Title:"Status By Risk Category",
                Series: serList,
                Categories: cats,
                Colors: ['#ED0C00', '#2E8AE5', '#DFC600']
            });

            Highcharts.chart('oristacked', chartObj);
        }
    }
})();