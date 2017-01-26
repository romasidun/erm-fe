(function(){
    PolicyController.$inject = ['$scope','$rootScope','$state', 'PolicyService', 'ChartFactory', 'Utils'];
    app.controller('PolicyCtrl', PolicyController);

    function PolicyController ($scope, $rootScope, $state, PolicyService, ChartFactory, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Policies List";

        $scope.CurrCol = 'docName';
        $scope.IsAsc = true;

        $scope.OpList = [10, 25, 50, 100];
        $scope.PerPage = 10;
        $scope.CurrPage = 1;

        $scope.$watch('PerPage', function(n, o){
            $rootScope.app.Mask = true;
            loadPolicies();
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

        $scope.deleteAction = function(p){
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                $rootScope.app.Mask = true;
                PolicyService.DeletePolicy(p.id).then(function(data){
                    if(data.status===200) loadPolicies();
                }, function(err){
                    $rootScope.app.Mask = false
                });
            });
        };

        function loadPolicies(){
            PolicyService.GetPolicies($scope.PerPage, $scope.CurrPage)
                .then(function(data) {
                    data.forEach(function(p){ p.assessmentType = p.assessmentType[0].asTypeDesc; });
                    $scope.Policies = data;
                    $rootScope.app.Mask = false;
                });
        }
    }
})();