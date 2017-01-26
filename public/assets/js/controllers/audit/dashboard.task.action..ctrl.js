(function(){
    'use strict';

    DashboardController.$inject = ['$scope','$rootScope','$state', 'Utils', 'DashService'];
    app.controller('DashboardCtrl', DashboardController);

    function DashboardController ($scope, $rootScope, $state, Utils, DashboardService){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "RISK CONTROL SELF ASSESSMENTS";

        $scope.OpList = [10, 25, 50, 100];
        $scope.TVM = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'alertName',
            IsAsc: true,
            Filter: "",
            Total: 0
        };

        $scope.sortMe = function(col){
            if($scope.TVM.Column === col)
                $scope.TVM.IsAsc = !$scope.TVM.IsAsc;
            else
                $scope.TVM.Column = col;
        };

        $scope.resSort = function(col){
            if($scope.TVM.Column === col){
                return $scope.TVM.IsAsc? 'fa-sort-up' : 'fa-sort-down';
            } else {
                return 'fa-unsorted';
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
            $scope.Dashboard = data;
            return DashboardService.GetTasks();
        }).then(function(data){
            setupPagination(data);
            $rootScope.app.Mask=false;
        });

        function setupPagination(data){
            var pages = 0;
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
    }
})();
