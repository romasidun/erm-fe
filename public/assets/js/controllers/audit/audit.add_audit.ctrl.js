(function () {
    AuditADController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'ChartFactory', 'Utils'];
    app.controller('AuditAdd_AuditCtrl', AuditADController);

    function AuditADController($scope, $rootScope, $state, $uibModal, $filter, AuditService, ChartFactory, Utils) {
        var vm =  this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "ADD AUDIT";
        $rootScope.app.Mask = false;

    }
})();