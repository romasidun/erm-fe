(function () {
    AuditActionController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'ChartFactory', 'Utils'];
    app.controller('AuditAdd_ActionCtrl', AuditActionController);

    function AuditActionController($scope, $rootScope, $state, $uibModal, $filter, AuditService, ChartFactory, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "ADD AUDIT";
        $rootScope.app.mask = false;
    }
})();