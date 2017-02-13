(function () {
    "use strict";

    SOXTestPlanController.$inject = ['$scope', '$rootScope', '$state', '$filter', '$uibModal', 'ComplianceService', 'ChartFactory', 'Utils'];
    app.controller('SOXTPCtrl', SOXTestPlanController);

    function SOXTestPlanController($scope, $rootScope, $state, $filter, $uibModal, ComplianceService, ChartFactory, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "SUMMARY";

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

        $scope.downloadTemp = function () {
            var checkedRow = $('.table>tbody').find('input:checkbox:checked');
            if (checkedRow.length < 1) {
                alert('Please select at least one record');
                return;
            }


            var data = {};
            data.sheetName = "Sox Test Plan";
            data.body = [];

            data.body.push({
                col: 3,
                row: 2,
                text: 'Sox Test Plan Assessments',
                font: { name: 'Calibri', sz: '16', family: '3', scheme: '-', bold: 'true'},
                fill: { type: 'solid', fgColor: 'FFFFFF' }
            });

            $('.table>thead>tr').find('th').slice(1, 7).each(function (i) {
                data.body.push({
                    col: (+i + 1),
                    row: 3,
                    text: $(this).text(),
                    font: { name: 'Calibri', sz: '13', family: '2', scheme: '-', bold: 'true'},
                    fill: { type: 'solid', fgColor: 'CCCCCC' },
                    border : { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' }
                });
            });

            var row = 2, col = 0;
            checkedRow.each(function (i) {
                row = i;
                var tdObj = $(this).closest('tr').find('td');
                tdObj.each(function (i) {
                    col = i;
                    data.body.push({
                        col: +col + 1,
                        row: +row + 4,
                        text: $(this).text(),
                        border : { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' }
                    });
                });
            });

            data.cols = 7;
            data.rows = +row + 5;

            data.widths = [];
            for(var c = 1; c <= data.cols; c++){
                data.widths.push({col: c, width: 25});
            }

            data.heights = [];
            for(var r = 1; r <= data.rows; r++){
                data.heights.push({row: r, height: 25});
            }

            ComplianceService.DownloadExcel(data).then(function (response) {
                location.assign('/downloadExcel/' + response.data);
            }).catch(function (error) {
                alert('error!');
            });
        };

        ComplianceService.GetSOXTPStatus().then(function (data) {
            // var rcsaChrt = [];
            // Object.keys(data).forEach(function (k) {
            //     rcsaChrt.push({key: Utils.camelizeString(k), val: data[k]});
            // });
            // setupPieChart(rcsaChrt);
            ChartFactory.CreatePieChart('RCSA by status', 'RCSA by status', data, 'rcsaStatus');
            return ComplianceService.GetSOXTPPeriod();
        }).then(function (data) {
            ChartFactory.CreateMultiColChart('By period', data, 'periodChart');
            // setupPeriodChart(data);
            return ComplianceService.GetSOXTPRegion();
        }).then(function (data) {
            setupStatusChart(data);
            return ComplianceService.GetSOXTPDept();
        }).then(function (data) {
            // ChartFactory.CreateLabelChart('By Department', '', '', '', '', data, 'deptstacked');
            ChartFactory.CreatePieChart('By Department', 'RCSA by status', data, 'deptstacked');
            // setupDeptChart(data);
            loadAssessments();
        });

        $scope.deleteAction = function (r) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                console.log("U chose Yes");
                $rootScope.app.Mask = true;
                ComplianceService.DeleteSOXTPAssessment(r.id).then(function (data) {
                    if (data.status === 200) loadAssessments();
                });
            });
        };

        $scope.editAction = function (r) {

        };

        function loadAssessments() {
            ComplianceService.GetSOXTPAssessments().then(function (data) {

                $scope.Grid1.Total = data.length;
                $scope.Grid1.Data = data;

                $rootScope.app.Mask = false;
            });
        }

        function setupPieChart(rcsa) {
            console.log('rcasdfasdfasdf',rcsa);
            var dataList = [];
            rcsa.forEach(function (o) {
                dataList.push([o.key, o.val]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('By Status', 'By Status', dataList, ['#D936ED', '#2B35DF', '#8EB42E', '#159008', '#B49400', '#9F6CE5']);
            Highcharts.chart('rcsaStatus', chartObj);
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
            // var serTypes = {
            //     approved: 'Approved',
            //     completed: 'Completed',
            //     in_progress: 'In Progress',
            //     ready_to_approve: 'Ready to Approve',
            //     submitted: 'Submitted',
            //     to_approve: 'To Approve'
            // };
            // var cats = [], currCats = [];
            // var serList = [
            //     {name: 'Approved', data: []},
            //     {name: 'Completed', data: []},
            //     {name: 'In Progress', data: []},
            //     {name: 'Ready to Approve', data: []},
            //     {name: 'Submitted', data: []},
            //     {name: 'To Approve', data: []}
            // ];
            //
            // Object.keys(serTypes).forEach(function (ck) {
            //     cats.push(ck);
            // });
            //
            // cats.forEach(function (cat, i) {
            //     currCats = $filter('filter')(Object.keys(data), cat);
            //     currCats.forEach(function (c) {
            //         if (c.indexOf(' approved') > -1) {
            //             serList[0].data.push(data[c]);
            //         }
            //         if (c.indexOf(' completed') > -1) {
            //             serList[1].data.push(data[c]);
            //         }
            //         if (c.indexOf(' in_progress') > -1) {
            //             serList[2].data.push(data[c]);
            //         }
            //         if (c.indexOf(' ready_to_approve') > -1) {
            //             serList[3].data.push(data[c]);
            //         }
            //         if (c.indexOf(' submitted') > -1) {
            //             serList[4].data.push(data[c]);
            //         }
            //         if (c.indexOf(' to_approve') > -1) {
            //             serList[5].data.push(data[c]);
            //         }
            //     });
            // });
            //
            // cats.forEach(function (c, i) {
            //     cats[i] = serTypes[c];
            // });
            // console.log(serList);
            //
            // Highcharts.chart('regionstacked', {
            //     chart: {type: 'bar'},
            //     title: {text: 'By Region'},
            //     xAxis: {
            //         categories: cats
            //     },
            //     yAxis: {
            //         min: 0,
            //         title: {text: 'By Re'}
            //     },
            //     legend: {reversed: false},
            //     plotOptions: {
            //         series: {stacking: 'normal'}
            //     },
            //     series: serList
            // });
        }

        function setupPeriodChart(data) {
            console.log('setupPeriodChart',data);
            var month, opts = {
                Title: "By Period",
                YText: "Values",
                Categories: [],
                Series: [
                    {name: "High", data: []},
                    {name: "Medium", data: []},
                    {name: "Low", data: []}
                ],
                Colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']

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

            ChartFactory.SetupMultiColChart('periodChart', opts);
        }

        function setupDeptChart(data) {

            var cats = [], currCats = [];
            var serList = [
                {name: 'Low', data: []},
                {name: 'Medium', data: []},
                {name: 'High', data: []}
            ];

            Object.keys(data).forEach(function (ck) {
                if (cats.indexOf(Utils.removeLastWord(ck)) === -1) cats.push(Utils.removeLastWord(ck));
            });
            cats.forEach(function (cat, i) {
                currCats = $filter('filter')(Object.keys(data), cat);
                currCats.forEach(function (c) {
                    if (c.indexOf('Low') > -1) {
                        serList[0].data.push(data[c]);
                    }
                    if (c.indexOf('Med') > -1) {
                        serList[1].data.push(data[c]);
                    }
                    if (c.indexOf('High') > -1) {
                        serList[2].data.push(data[c]);
                    }
                });
            });

            Highcharts.chart('deptstacked', {
                chart: {type: 'bar'},
                title: {text: 'By Department'},
                xAxis: {
                    categories: cats
                },
                yAxis: {
                    min: 0,
                    title: {text: 'By Department'}
                },
                legend: {reversed: false},
                plotOptions: {
                    series: {stacking: 'normal'}
                },
                series: serList
            });
        }
    }
})();
