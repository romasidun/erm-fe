(function () {
    UsersUpdateController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'UsersService', 'RolesService', 'Utils'];
    app.controller('UsersUpdateCtrl', UsersUpdateController);

    function UsersUpdateController($scope, $rootScope, $state, $uibModal, $filter, UsersService, RolesService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "Update User";
        var userId = $state.params.userId;

        vm.tmp_deptId = '';
        vm.tmp_roleId = '';

        $rootScope.app.Mask = false;
        RolesService.Get().then(function (data) {
            vm.roles = data;
            return UsersService.GetOne(userId);
        }).then(function (data) {
            vm.formdata = data;
            if(angular.isArray(vm.formdata.department)) vm.tmp_deptId = vm.formdata.department[0].id;
            if(angular.isArray(vm.formdata.role)) vm.tmp_roleId = vm.formdata.role[0].id;
            return RolesService.Get();
        });

        vm.submitAction = function(){
            $rootScope.app.Mask = true;
            if(vm.UsersForm.$invalid) return false;

            vm.formdata.department = $filter('filter')($rootScope.app.Lookup.Departments, {id: vm.tmp_deptId});
            vm.formdata.role = $filter('filter')(vm.roles, {id: vm.tmp_roleId});

            UsersService.Put(userId, vm.formdata).then(function (res) {

            }).finally(function () {
                $state.go('app.admin.users.main');
            });
        };

        vm.cancelAction = function () {
            if (vm.UsersForm.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.admin.users.main');
                });
                return false;
            }
            $state.go('app.admin.users.main');
        };
    }
})();