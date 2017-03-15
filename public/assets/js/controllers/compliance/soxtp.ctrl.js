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
            SortMe: function (col) {
                if ($scope.Grid1.Column === col)
                    $scope.Grid1.IsAsc = !$scope.Grid1.IsAsc;
                else
                    $scope.Grid1.Column = col;
            },
            GetIco: function (col) {
                if ($scope.Grid1.Column === col) {
                    return $scope.Grid1.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
                } else {
                    return 'fa-unsorted';
                }
            }
        };
        $scope.$watch('Grid1.Filter', function (n, o) {
            var searchedData = $filter('filter')($scope.Grid1.Data, $scope.Grid1.Filter);
            $scope.Grid1.Total = searchedData.length;
        });

        $scope.downloadTemp = function () {
        	var dlTmpModal = $uibModal.open({
                templateUrl: 'tmpdownload.tpl.html',
                controller: 'TmpDlCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        return {
                            TempLoader: ComplianceService.GetSOXTPTemplate(),
                            prefix: 'compliance/soxtp/templates/'
                        };
                    }
                }
            });
            console.log('dlTmpModal', dlTmpModal);

            dlTmpModal.result.then(function (updEquip) {
                console.log("Done");
            });
        }

        $scope.downloadTemp2 = function () {
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
                font: {name: 'Calibri', sz: '16', family: '3', scheme: '-', bold: 'true'},
                fill: {type: 'solid', fgColor: 'FFFFFF'}
            });

            $('.table>thead>tr').find('th').slice(1, 7).each(function (i) {
                data.body.push({
                    col: (+i + 1),
                    row: 3,
                    text: $(this).text(),
                    font: {name: 'Calibri', sz: '13', family: '2', scheme: '-', bold: 'true'},
                    fill: {type: 'solid', fgColor: 'CCCCCC'},
                    border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
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
                        border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
                    });
                });
            });

            data.cols = 7;
            data.rows = +row + 5;

            data.widths = [];
            for (var c = 1; c <= data.cols; c++) {
                data.widths.push({col: c, width: 25});
            }

            data.heights = [];
            for (var r = 1; r <= data.rows; r++) {
                data.heights.push({row: r, height: 25});
            }

            ComplianceService.DownloadExcel(data).then(function (response) {
                var nodeUrl = $rootScope.app.NodeApi;
                location.assign(nodeUrl + '/downloadExcel/' + response.data);
            }).catch(function (error) {
                alert('error!');
            });
        };

        ComplianceService.GetSOXTPStatus().then(function (data) {
            ChartFactory.CreatePieChart('By Status', 'By Status', data, 'rcsaStatus');
            return ComplianceService.GetSOXTPPeriod();
        }).then(function (data) {
            ChartFactory.CreateMultiColChart('By period', data, 'periodChart');
            return ComplianceService.GetSOXTPDept();
        }).then(function (data) {
            ChartFactory.CreatePieChart('By Department', 'By Department', data, 'deptstacked');
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

        function loadAssessments() {
            ComplianceService.GetSOXTPAssessments().then(function (data) {

                $scope.Grid1.Total = data.length;
                $scope.Grid1.Data = data;

                $rootScope.app.Mask = false;
            });
        }
        function drawRegionChart() {
            if ($rootScope.app.Mask) return;
            var categories = [];
            $rootScope.app.Lookup.LIST001.forEach(function (item) {
                categories.push(item.val);
            });
            var tempAry = new Array();
            $scope.Grid1.Data.forEach(function (row) {
                var approval = row.approval;
                var region = row.region;
                if (region.indexOf('Asia') !== -1)
                    region = 'Asia';
                if (region.indexOf('EMEA') !== -1)
                    region = 'South America';

                if (typeof(tempAry[approval]) == 'undefined') {
                    var ary = Array.apply(null, Array(categories.length)).map(Number.prototype.valueOf, 0);
                    tempAry[approval] = ary;
                }

                var ind = categories.indexOf(region);
                if (ind < 0) return;
                tempAry[approval][ind]++;
            });

            var series = [];
            for (var k in tempAry) {
                series.push({
                    name: k,
                    data: tempAry[k]
                })
            }
            var config = {
                Text: 'By Region',
                Title: '',
                Categories: categories,
                Series: series
            };
            config = ChartFactory.SetupStackedChart(config);
            Highcharts.chart('regionstacked', config);
        }

        $scope.$watch('Grid1.Data', function (n, o) {
            drawRegionChart();
        });

        $scope.downloadTestPlan = function () {
            var data = {};
            data.sheetName = "Test Plan";
            data.body = [];

            var head_txt = ['Test Number', 'Control Desc', 'Dept', 'Resign', 'Test Status', 'Test Method', 'Current Due Date', 'Next Due Date', 'File Upload', 'TestPlan File Name', 'Control Ref#', 'Control Activity Detailed Description', 'Test Procedures', 'Testing Size', 'Effective Test Date', 'Test Completed to date', 'Exception(s) Description', 'Type of Test', 'Action', 'Resolution Name', 'Description', 'Responsible Person', 'Due Date', 'Status', 'File Upload'];
            for (var i = 0; i < head_txt.length; i++) {
                data.body.push({
                    col: (+i + 1),
                    row: 5,
                    text: head_txt[i],
                    font: {name: 'Calibri', sz: '11', family: '3', scheme: '-'},
                    fill: {type: 'solid', fgColor: 'FFFF00'},
                    border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'},
                    wrap: 'true'
                });
            }

            data.body.push({
                col: 8, row: 6, text: '* INCOME TAX EXPENSE/BENEFIT: is determined in accordance with tax law, and recorded against the applicable component of net income, or equity.',
                merge: {to: {col: 8, row: 6}, from: {col: 14, row: 8}},
                valign: 'center',
                font: {name: 'Calibri', sz: '10', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin'},
                wrap : 'true'
            });

            data.body.push({
                col: 16, row: 6, text: 'Key Control',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'true'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });
            data.body.push({
                col: 16, row: 7, text: 'Standard Controls',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'true'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });
            data.body.push({
                col: 16, row: 8, text: 'Total Controls',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'true'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });

            data.body.push({
                col: 17, row: 5, text: 'Count',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                fill: {type: 'solid', fgColor: 'BFBFBF'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });
            data.body.push({
                col: 18, row: 5, text: 'Testing Hours',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                fill: {type: 'solid', fgColor: 'BFBFBF'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });

            data.body.push({
                col: 17, row: 6, text: '5',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });
            data.body.push({
                col: 18, row: 6, text: '15',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });

            data.body.push({
                col: 17, row: 7, text: '0',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });
            data.body.push({
                col: 18, row: 7, text: '0',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });

            data.body.push({
                col: 17, row: 8, text: '5',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });
            data.body.push({
                col: 18, row: 8, text: '15',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });


            data.cols = 35;
            data.rows = 15;

            var wval = [14, 21, 15, 24, 25, 26, 17, 14, 11, 19, 16, 14, 14, 16, 20, 15, 13, 12, 30, 30, 16, 24, 25, 16, 23, 12, 14, 24, 19, 23];
            data.widths = [];
            for(var i=0;i<wval.length;i++){
                data.widths.push({col: +i+2, width: wval[i]});
            }

            data.heights = [];
            data.heights.push({row: 5, height: 25});
            data.heights.push({row: 11, height: 45});

            ComplianceService.DownloadExcel(data).then(function (response) {
                var nodeUrl = $rootScope.app.NodeApi;
                location.assign(nodeUrl + '/downloadExcel/' + response.data);
            }).catch(function (error) {
                alert('error!');
            });
        };
    }
})();
