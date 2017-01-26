(function(){
    'use strict';

    DashboardController.$inject = ['$scope','$rootScope','$state', 'orderByFilter', 'Utils', 'DashService' , 'calendarConfig'];
    app.controller('DashboardCtrl', DashboardController);

    function DashboardController ($scope, $rootScope, $state, orderBy, Utils, DashboardService, calendarConfig){
        $scope.mainTitle = $state.current.title;

        $scope.OpList = [10, 25, 50, 100];
        $scope.TVM = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'alertName',
            IsAsc: false,
            Filter: "",
            Total: 0,
            SortMe: function(col){
                if($scope.TVM.Column === col)
                    $scope.TVM.IsAsc = !$scope.TVM.IsAsc;
                else
                    $scope.TVM.Column = col;
            },
            GetIco: function(col){
                if($scope.TVM.Column === col){
                    return $scope.TVM.IsAsc? 'fa-sort-up' : 'fa-sort-down';
                } else {
                    return 'fa-unsorted';
                }
            }
        };

        $scope.AVM = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'activityType',
            IsAsc: true,
            Filter: "",
            Total: 0,
            SortMe: function(col){
                if($scope.AVM.Column === col)
                    $scope.AVM.IsAsc = !$scope.AVM.IsAsc;
                else
                    $scope.AVM.Column = col;
            },
            GetIco: function(col){
                if($scope.AVM.Column === col){
                    return $scope.AVM.IsAsc? 'fa-sort-up' : 'fa-sort-down';
                } else {
                    return 'fa-unsorted';
                }
            }
        };

        $scope.CAnalOpts = [
            { key: 1, val: "Assessments" },
            { key: 2, val: "Audit" },
            { key: 3, val: "IT Risk" },
            { key: 4, val: "RCSA" }
        ];

        $scope.OpItemsOpts = [
            { key: 1, val: "All" },
            { key: 2, val: "Audit" },
            { key: 3, val: "IT Risk" },
            { key: 4, val: "RCSA" },
            { key: 5, val: "SOX" }
        ];

        $scope.setCAOpt = function(opt){ $scope.currCA = opt; };
        $scope.setOpen = function(opt){ $scope.currOP = opt; };

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

        $scope.chart = chart1;

        DashboardService.GetDashboard().then(function(data){
            $scope.Activities = data;
            setupCalendarEvents(data);
            return DashboardService.GetTasks();
        }).then(function(data){
            setupPagination(data);
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


        function setupPagination(data){
            var pages = 0;
            data = orderBy(data, 'action_to_take');
            data = data.filter(function(a){ return a.workItemType !== 'Topic' });
            $scope.TVM.Total = data.length;
            $scope.Tasks = [[]];

            data.forEach(function(t){
                if($scope.Tasks[pages].length<$scope.TVM.PerPage)
                    $scope.Tasks[pages].push(t);
                else {
                    pages++;
                    $scope.Tasks[pages] = [];
                }
            });
            console.log($scope.Tasks);
        }
        
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
    }
})();
