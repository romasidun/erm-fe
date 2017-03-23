(function () {
    UsersAddController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'UsersService', 'RolesService', 'Utils'];
    app.controller('UsersAddCtrl', UsersAddController);

    function UsersAddController($scope, $rootScope, $state, $uibModal, $filter, UsersService, RolesService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "ADD Users";

        vm.formdata = {
            department: [],
            email: '',
            password: '',
            pincode: '',
            role: [],
            username: ''
        };

        $rootScope.app.Mask = false;

        RolesService.Get().then(function (data) {
            vm.roles = data;
        });

        vm.submitAction = function(){
            $rootScope.app.Mask = true;
            if(vm.UsersForm.$invalid) return false;

            vm.formdata.department = $filter('filter')($rootScope.app.Lookup.Departments, {id: vm.tmp_deptId});
            vm.formdata.role = $filter('filter')(vm.roles, {id: vm.tmp_roleId});

            UsersService.Post(vm.formdata).then(function (res) {

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