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
            Column: 'workItemType',
            IsAsc: false,
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
            var searchedData = $filter('filter')($scope.Grid2.Data, $scope.Grid2.Filter);
            $scope.Grid2.Total = searchedData.length;
        });


        $scope.setCAOpt = function(key){
            $scope.selectedANKey = key;
            createCtrlANChart();
        };

        $scope.setOPOpt = function(key){
            $scope.selectedOPKey = key;
            createCtrlOPchart();
        };

        DashboardService.GetctrlAntic()
            .then(function(data){
                $scope.ANchartData = data;
                $scope.selectedANKey = Object.keys($scope.ANchartData)[0];
                createCtrlANChart();
                return DashboardService.Openitem();
            })
            .then(function(data){
                $scope.OPchartData = data;
                $scope.selectedOPKey = Object.keys($scope.OPchartData)[0];
                createCtrlOPchart();
            });

        function createCtrlANChart() {
            ChartFactory.CreatePieChart('Control Analytics', 'Control Analytics', $scope.ANchartData[$scope.selectedANKey], 'ctrlAnticChart');
        }

        function createCtrlOPchart(){
            ChartFactory.CreateLabelChart('Open Item', 'OpenItem', "", "", "", $scope.OPchartData[$scope.selectedOPKey], 'openitemChart');
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

        DashboardService.GetDashboard().then(function(data){
            //$scope.Activities = data;

            if($rootScope.currentUserInfo.role[0].roleDesc === 'RESPONSIBLE PARTY'){
                data = $filter('filter')(data, {person: $rootScope.currentUserInfo.username}, true);
            }

            $scope.Grid2.Total = data.length;
            $scope.Grid2.Data = data;

            setupCalendarEvents(data);
            return DashboardService.GetTasks();
        }).then(function(data){
            if($rootScope.currentUserInfo.role[0].roleDesc === 'RESPONSIBLE PARTY'){
                data = $filter('filter')(data, {alertRPerson: $rootScope.currentUserInfo.username}, true);
            }
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
        
        // function setopenitemChart() {
        //     var opts = {
        //         Title: "Open Item",
        //         subTitle: "",
        //         yTitle: "",
        //         tooltip: "",
        //         Categories : [],
        //         Series: 'Openitem',
        //         Data : [
        //             ['Jan', 4],
        //             ['Feb', 8],
        //             ['March', 2],
        //             ['April', 5],
        //             ['May', 2],
        //             ['June', 3],
        //             ['July', 5],
        //             ['August', 2],
        //             ['September', 1]
        //         ]
        //     };
        //
        //     var chartObj = ChartFactory.SetupLabelChart(opts);
        //     Highcharts.chart('openitemChart', chartObj);
        // }
    }
})();