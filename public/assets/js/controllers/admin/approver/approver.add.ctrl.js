(function () {
    ApproverAddController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'ApproverService', 'Utils'];
    app.controller('ApproverAddCtrl', ApproverAddController);

    function ApproverAddController($scope, $rootScope, $state, $uibModal, $filter, ApproverService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "ADD Approver";

        vm.formdata = {
            asmntType: [],
            department: [],
            roleType: [],
            user: []
        };
        vm.tmpdata = {
            asmntType: '',
            department: '',
            roleType: '',
            user: ''
        };

        $rootScope.app.Mask = false;

        vm.submitAction = function(){
            $rootScope.app.Mask = true;
            if(vm.ApproverForm.$invalid) return false;

            vm.formdata = {
                asmntType: [vm.tmpdata.asmntType],
                department: [vm.tmpdata.department],
                roleType: [vm.tmpdata.roleType],
                user: [vm.tmpdata.user]
            };
            ApproverService.Post(vm.formdata).then(function (res) {

            }).finally(function () {
                $state.go('app.admin.approver.main');
            });
        };

        vm.cancelAction = function () {
            if (vm.ApproverForm.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.admin.approver.main');
                });
                return false;
            }
            $state.go('app.admin.approver.main');
        };
    }
})();