(function () {
    AuditFindingController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'ChartFactory', 'Utils'];
    app.controller('AuditAdd_FindingCtrl', AuditFindingController);

    function AuditFindingController($scope, $rootScope, $state, $uibModal, $filter, AuditService, ChartFactory, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "ADD AUDIT";
        $rootScope.app.Mask = false;
    }
})();