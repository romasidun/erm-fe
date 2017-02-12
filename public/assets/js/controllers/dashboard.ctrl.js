(function(){
    'use strict';

    DashboardController.$inject = ['$scope','$rootScope','$state', '$filter', 'DashService' , 'calendarConfig', 'ChartFactory'];
    app.controller('DashboardCtrl', DashboardController);

    function DashboardController ($scope, $rootScope, $state, $filter, DashboardService, calendarConfig, ChartFactory){
        $scope.mainTitle = $state.current.title;

        $scope.OpList = [5, 10, 25, 50, 100];
        $scope.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'alertName',
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

        $scope.Grid2 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'activityType',
            IsAsc: true,
            Filter: "",
            Total: 0,
            Data: [],
            SortMe: function(col){
                if($scope.Grid2.Column === col)
                    $scope.Grid2.IsAsc = !$scope.Grid2.IsAsc;
                else
                    $scope.Grid2.Column = col;
            },
            GetIco: function(col){
                if($scope.Grid2.Column === col){
                    return $scope.Grid2.IsAsc? 'fa-sort-up' : 'fa-sort-down';
                } else {
                    return 'fa-unsorted';
                }
            }
        };
        $scope.$watch('Grid2.Filter', function(n, o){
            $rootScope.app.Mask = true;
            var searchedData = $filter('filter')($scope.Grid2.Data, $scope.Grid2.Filter);
            $scope.Grid2.Total = searchedData.length;
            $rootScope.app.Mask = false;
        });


        $scope.setCAOpt = function(key){
            var dataList = [];
            angular.forEach($scope.ANchartData[key], function(value, key){
                dataList.push([key, value]);
            });
            $scope.selectedANKey = key;
            controlanalyticsChart(dataList);
        };

        DashboardService.GetctrlAntic().then(function(data){
            $scope.ANchartData = data;
            var dataList = [];
            $scope.selectedANKey = Object.keys($scope.ANchartData)[0];
            angular.forEach($scope.ANchartData[$scope.selectedANKey], function(value, key){
                dataList.push([key, value]);
            });
            controlanalyticsChart(dataList);
        });

        $scope.setOPOpt = function(key){
            var dataList = [];
            angular.forEach($scope.OPchartData[key], function(value, key){
                dataList.push([key, value]);
            });
            $scope.selectedOPKey = key;
            openitemChart(dataList);
        };

        DashboardService.Openitem().then(function(data){
            $scope.OPchartData = data;
            var dataList = [];
            $scope.selectedOPKey = Object.keys($scope.OPchartData)[0];
            angular.forEach($scope.OPchartData[$scope.selectedOPKey], function(value, key){
                dataList.push([key, value]);
            });
            openitemChart(dataList);
        });

        function controlanalyticsChart(data){
            var chartObj = ChartFactory.CreatePieChartTemplate('Control Analytics', 'Control Analytics', data, ['#E0ED00', '#1372DF', '#24CBE5', '#00E219', '#1CB400', '#8A8A8A']);
            Highcharts.chart('ctrlAnticChart', chartObj);
        }

        function openitemChart(data) {
            var opts = {
                Title: "Open Item",
                subTitle: "",
                yTitle: "",
                tooltip: "",
                Categories : [],
                Series: 'Openitem',
                Data : data
            };
            var chartObj = ChartFactory.SetupLabelChart(opts);
            Highcharts.chart('openitemChart', chartObj);
        }

        var chart1 = {};
        chart1.type = "PieChart";
        chart1.data = [
            ['Component', 'cost'],
            ['Completed', 1],
            ['Approved', 4],
            ['Submitted', 2],
            ['In Progress', 1],
            ['Ready To Approve', 1],
            ['To Approve', 3]
        ];
        chart1.options = {
            displayExactValues: true,
            is3D: true
        };

        chart1.formatters = {
            number : [{ columnNum: 1, pattern: "$ #,##0.00" }]
        };

        $scope.chart1 = chart1;



        DashboardService.GetDashboard().then(function(data){
            //$scope.Activities = data;

            $scope.Grid2.Total = data.length;
            $scope.Grid2.Data = data;

            setupCalendarEvents(data);
            return DashboardService.GetTasks();
        }).then(function(data){

            $scope.Grid1.Total = data.length;
            $scope.Grid1.Data = data;

            $rootScope.app.Mask=false;
        });

        function setupCalendarEvents (data){
            $scope.events = [];
            var cols = {
                green : 'info',
                yellow: 'warning',
                red: 'important'
            };
            data.forEach(function(e){
                $scope.events.push({
                    title: e.activityType,
                    color: calendarConfig.colorTypes[cols[e.rag]],
                    startsAt: moment(e.dueDate).toDate(),
                    endsAt: moment(e.dueDate).toDate(),
                    draggable: false,
                    resizable: false,
                });
            });
        }

        $scope.items = [{
            name: "Action"
        }, {
            name: "Another action"
        }, {
            name: "Something else here"
        }];

        //-------------- Calendar Functionality ----------------
        $scope.calendarView = 'month';
        $scope.viewDate = new Date();

        $scope.cellIsOpen = true;

        $scope.addEvent = function() {
            $scope.events.push({
                title: 'New event',
                startsAt: moment().startOf('day').toDate(),
                endsAt: moment().endOf('day').toDate(),
                color: calendarConfig.colorTypes.important,
                draggable: true,
                resizable: true
            });
        };

        $scope.eventClicked = function(event) {
            alert.show('Clicked', event);
        };

        $scope.eventEdited = function(event) {
            alert.show('Edited', event);
        };

        $scope.eventDeleted = function(event) {
            alert.show('Deleted', event);
        };

        $scope.eventTimesChanged = function(event) {
            alert.show('Dropped or resized', event);
        };

        $scope.toggle = function($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();
            event[field] = !event[field];
        };

        $scope.timespanClicked = function(date, cell) {

            if (vm.calendarView === 'month') {
                if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
                    $scope.cellIsOpen = false;
                } else {
                    $scope.cellIsOpen = true;
                    $scope.viewDate = date;
                }
            } else if (vm.calendarView === 'year') {
                if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
                    $scope.cellIsOpen = false;
                } else {
                    $scope.cellIsOpen = true;
                    $scope.viewDate = date;
                }
            }

        };
        
        function setopenitemChart() {
            var opts = {
                Title: "Open Item",
                subTitle: "",
                yTitle: "",
                tooltip: "",
                Categories : [],
                Series: 'Openitem',
                Data : [
                    ['Jan', 4],
                    ['Feb', 8],
                    ['March', 2],
                    ['April', 5],
                    ['May', 2],
                    ['June', 3],
                    ['July', 5],
                    ['August', 2],
                    ['September', 1]
                ]
            };

            var chartObj = ChartFactory.SetupLabelChart(opts);
            Highcharts.chart('openitemChart', chartObj);
        }
    }
})();