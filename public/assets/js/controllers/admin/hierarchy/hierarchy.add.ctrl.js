(function () {
    HierarchyAddCtrl.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'HierarchyService', 'Utils'];
    app.controller('HierarchyAddCtrl', HierarchyAddCtrl);

    function HierarchyAddCtrl($scope, $rootScope, $state, $uibModal, $filter, HierarchyService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "ADD Roles";

        vm.formdata = {
            roleCode: "",
            roleDesc: ""
        };

        $rootScope.app.Mask = false;

        vm.submitAction = function(){
            $rootScope.app.Mask = true;
            if(vm.RolesForm.$invalid) return false;

            RolesService.Post(vm.formdata).then(function (res) {

            }).finally(function () {
                $state.go('app.admin.roles.main');
            });
        };

        vm.cancelAction = function () {
            if (vm.RolesForm.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.admin.roles.main');
                });
                return false;
            }
            $state.go('app.admin.roles.main');
        };
    }
})();