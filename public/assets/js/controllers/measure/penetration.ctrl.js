(function(){
    PenController.$inject = ['$scope','$rootScope','$state', 'ControlService', 'Utils'];
    app.controller('PenetrationCtrl', PenController);

    function PenController ($scope, $rootScope, $state, ControlService, Utils){
       $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Penetration Testing";

        $scope.CurrCol = 'riskName';
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

        //Test Data

        //Issue	 Description	 Affected URLs	Impact 	 Risk Level 	HostName	Application	Contact	Date Found

        $rootScope.app.Mask = false;
    }
})();