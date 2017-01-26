/**
 * Created by Jafeez on 11/01/2017.
 */
(function(){
    ActionFormController.$inject = ['$scope','$rootScope','$state', '$stateParams', 'AuditService', 'Utils'];
    app.controller('DashActionUpdateCtrl', ActionFormController);

    function ActionFormController ($scope, $rootScope, $state, $stateParams, AuditService, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Control Test Plan";

        $scope.Form = {};

        $scope.submitAction = function() {
            if($scope.Form.Audit.$invalid) return false;
            AuditService.ReviewAction($stateParams, $scope.Action).then(function (res) {
                if(res.status===200) $state.go('app.dashboard.main');
            });
        };

        $scope.cancelAction = function() {
            if($scope.Form.Audit.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){ $state.go('app.dashboard.main'); });
                return false;
            }
            $state.go('app.dashboard');
        };

        $scope.Audit = {};
        AuditService.GetAction($stateParams.id).then(function (data) {
            $scope.dueDate = Utils.GetDPDate(data.dueDate);
            $scope.Action = data;
            return AuditService.GetAudit($scope.Action.auditId);
        }).then(function(audit){
            $scope.Audit = audit;
            return AuditService.GetTopic($scope.Action.topicid);
        }).then(function(topic){
            $scope.Audit.Topic = topic;
            return AuditService.GetFinding($scope.Action.findingId);
        }).then(function(finding){
            $scope.Audit.Finding = finding;
            $rootScope.app.Mask = false;
        }, function(err){
            $rootScope.app.Mask = false;
        });
    }
})();