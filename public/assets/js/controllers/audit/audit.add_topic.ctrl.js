(function () {
    AuditTopicController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'ChartFactory', 'Utils'];
    app.controller('AuditAdd_TopicCtrl', AuditTopicController);

    function AuditTopicController($scope, $rootScope, $state, $uibModal, $filter, AuditService, ChartFactory, Utils) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "ADD AUDIT";
        $rootScope.app.mask = false;
    }
})();