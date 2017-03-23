(function () {
    DeptUpdateController.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'DeptService', 'Utils'];
    app.controller('DeptUpdateCtrl', DeptUpdateController);

    function DeptUpdateController($scope, $rootScope, $state, $uibModal, $filter, DeptService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "Update Department";
        var deptId = $state.params.id;

        $rootScope.app.Mask = false;

        DeptService.GetOne(deptId).then(function (data) {
            vm.formdata = data;
        });

        vm.submitAction = function(){
            $rootScope.app.Mask = true;
            if(vm.DeptForm.$invalid) return false;

            DeptService.Put(deptId, vm.formdata).then(function (res) {

            }).finally(function () {
                $state.go('app.admin.dept.main');
            });
        };

        vm.cancelAction = function () {
            if (vm.DeptForm.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.admin.dept.main');
                });
                return false;
            }
            $state.go('app.admin.dept.main');
        };
    }
})();