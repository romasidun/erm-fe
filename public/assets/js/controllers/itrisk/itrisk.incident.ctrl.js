(function () {
    "use strict";

    ITRiskIncidentController.$inject = ['$scope', '$rootScope', '$state', '$filter', 'ITRiskService', 'ChartFactory', 'Utils'];
    app.controller('ITRiskIncCtrl', ITRiskIncidentController);

    function ITRiskIncidentController($scope, $rootScope, $state, $filter, ITRiskService, ChartFactory, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "IT Risk Incident Mangement Doashboard";

        $scope.CurrCol = 'riskName';
        $scope.IsAsc = true;

        $scope.OpList = [10, 25, 50, 100];
        $scope.PerPage = 10;

        $scope.sortMe = function (col) {
            if ($scope.CurrCol === col)
                $scope.IsAsc = !$scope.IsAsc;
            else
                $scope.CurrCol = col;
        };

        $scope.resSort = function (col) {
            if ($scope.CurrCol === col) {
                return $scope.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
            } else {
                return 'fa-unsorted';
            }
        };

        ITRiskService.GetRimStatus()
            .then(function (data) {
                var ristInc = [];
                Object.keys(data).forEach(function (k) {
                    ristInc.push({key: Utils.camelizeString(k), val: data[k]});
                });
                setupPieChart(ristInc);
                return ITRiskService.GetRimPeriod()
            })
            .then(function (data) {
                setupPeriodChart(data)
                return ITRiskService.GetRimRiskCategory()
            })
            .then(function (data) {
                setupStackedChart(data);
                $scope.$watch('PerPage', function (n, o) {
                    $rootScope.app.Mask = true;
                    loadRim();
                });
            });

        $scope.deleteAction = function (r) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                console.log("U chose Yes");
                $rootScope.app.Mask = true;
                ITRiskService.DeleteRim(r.id).then(function (data) {
                    if (data.status === 200) loadRim();
                });
            });
        };

        $scope.editAction = function (r) {

        };

        function loadRim() {
            ITRiskService.GetRim().then(function (data) {
                console.log('data',data);
                data.forEach(function (r) {
                    r.IDate = Utils.createDate(r.identifiedDate);
                });

                console.log('data',data);
                $scope.Incidents = data;
                $rootScope.app.Mask = false;
            });
        }

        function setupPieChart(data) {
            var dataList = [];
            data.forEach(function (o) {
                dataList.push([o.key, o.val]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('Incident by Status', 'Incident by Status', dataList, ['#E0ED00', '#1372DF', '#24CBE5', '#00E219', '#1CB400', '#8A8A8A']);
            Highcharts.chart('statusChart', chartObj);
        }

        function setupPeriodChart(data) {
            var month, opts = {
                Title: "Status By Period",
                YText: "Values",
                Categories: [],
                Series: [
                    {name: "Low", data: []},
                    {name: "Medium", data: []},
                    {name: "High", data: []}
                ],
                Colors: ['#DFC600', '#2E8AE5', '#ED0C00']
            };
            Object.keys(data).forEach(function (k) {
                if (k.indexOf('Low') > -1) {
                    month = Utils.camelizeString(k.split('Low')[0]);
                    opts.Series[0].data.push(data[k]);
                }
                if (k.indexOf('Med') > -1) {
                    month = Utils.camelizeString(k.split('Med')[0]);
                    opts.Series[1].data.push(data[k]);
                }
                if (k.indexOf('High') > -1) {
                    month = Utils.camelizeString(k.split('High')[0]);
                    opts.Series[2].data.push(data[k]);
                }
                if (opts.Categories.indexOf(month) === -1)
                    opts.Categories.push(month);
            });

            ChartFactory.SetupMultiColChart('periodChart', opts);
        }

        function setupStackedChart(data) {

            var cats = [], currCats = [];
            var serList = [
                {name: 'High', data: []},
                {name: 'Medium', data: []},
                {name: 'Low', data: []}
            ];

            Object.keys(data.categories).forEach(function (ck) {
                cats.push(data.categories[ck]);
            });

            cats.forEach(function (cat, i) {
                currCats = $filter('filter')(Object.keys(data['risk category status']), cat);
                currCats.forEach(function (c) {
                    if (c.indexOf('High') > -1) {
                        serList[0].data.push(data['risk category status'][c]);
                    }
                    if (c.indexOf('Med') > -1) {
                        serList[1].data.push(data['risk category status'][c]);
                    }
                    if (c.indexOf('Low') > -1) {
                        serList[2].data.push(data['risk category status'][c]);
                    }
                });
            });

            var chartObj = ChartFactory.SetupStackedChart({
                Text: "Incident by Risk Category and Status",
                Title: "Incident by Risk Category and Status",
                Series: serList,
                Categories: cats,
                Colors: ['#ED0C00', '#2E8AE5', '#DFC600']
            });

            Highcharts.chart('catChart', chartObj);
        }
    }
})();