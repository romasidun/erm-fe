(function () {
    "use strict";

    SOXPRAController.$inject = ['$scope', '$rootScope', '$state', '$filter', '$uibModal', 'ComplianceService', 'ChartFactory', 'Utils'];
    app.controller('SOXPRACtrl', SOXPRAController);

    function SOXPRAController($scope, $rootScope, $state, $filter, $uibModal, ComplianceService, ChartFactory, Utils) {
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
            $rootScope.app.Mask = true;
            var searchedData = $filter('filter')($scope.Grid1.Data, $scope.Grid1.Filter);
            $scope.Grid1.Total = searchedData.length;
            $rootScope.app.Mask = false;
        });

        $scope.downloadTemp = function () {
            var theadAry = [];
            var tbodyAry = [];
            var checkedRow = $('.table>tbody').find('input:checkbox:checked');
            /*if (checkedRow.length < 1) {
             alert('Please select at least one record');
             return;
             }*/

            $('.table>thead>tr').find('th').slice(1, 7).each(function (i) {
                theadAry.push({
                    bgcolor: 'ffffff',
                    width: 20,
                    text: $(this).text()
                });
            });

            checkedRow.each(function (i) {
                /*tableHtml += '<tr>';*/
                var rowArray = [];
                var tdObj = $(this).closest('tr').find('td');
                tdObj.each(function (i) {
                    rowArray.push($(this).text());
                });
                tbodyAry.push(rowArray);
            });

            var senddata = {
                head: theadAry,
                body: tbodyAry
            };

            ComplianceService.ExcelDownload(senddata).then(function (response) {
                location.assign('/download-excel/' + response.data);
            }).catch(function (error) {
                alert('error!');
            });
        };



        ComplianceService.GetSOXPRAStatus().then(function (data) {
            ChartFactory.CreatePieChart('RCSA by status', 'RCSA by status', data, 'rcsaStatus');
            // var rcsaChrt = [];
            // Object.keys(data).forEach(function (k) {
            //     rcsaChrt.push({key: Utils.camelizeString(k), val: data[k]});
            // });
            // setupPieChart(rcsaChrt);
            return ComplianceService.GetSOXPRAPeriod();
        }).then(function (data) {
            ChartFactory.CreateMultiColChart('By period', data, 'periodChart');
            return ComplianceService.GetSOXPRADept();
        }).then(function (data) {
            // ChartFactory.CreateLabelChart('By Department', '', '', '', '', data, 'deptstacked');
            ChartFactory.CreatePieChart('By Department', 'RCSA by status', data, 'deptstacked');
            loadAssessments();
        });

        $scope.deleteAction = function (r) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                console.log("U chose Yes");
                $rootScope.app.Mask = true;
                ComplianceService.DeleteSOXPRAAssessment(r.id).then(function (data) {
                    if (data.status === 200) loadAssessments();
                });
            });
        };

        $scope.editAction = function (r) {

        };

        function loadAssessments() {
        	ComplianceService.GetSOXPRAAssessments().then(function (data) {

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

    }
})();
