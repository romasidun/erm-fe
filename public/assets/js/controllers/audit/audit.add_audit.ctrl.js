(function () {
    AuditADController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'ChartFactory', 'Utils'];
    app.controller('AuditAdd_AuditCtrl', AuditADController);

    function AuditADController($scope, $rootScope, $state, $uibModal, $filter, AuditService, ChartFactory, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "ADD AUDIT";
        $rootScope.app.mask = false;

    }
})();