(function () {
    DynListMgmAddCtrl.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'DynListService', 'Utils'];
    app.controller('DynListMgmAddCtrl', DynListMgmAddCtrl);

    function DynListMgmAddCtrl($scope, $rootScope, $state, $uibModal, $filter, DynListService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "ADD Roles";


        vm.formdata = {
            dylistCode: '',
            dylistDesc: '',
            dylistTypecode: $state.params.dynTypeCode,
            dylistTypedesc: $state.params.dynTypeDesc
        };

        $rootScope.app.Mask = false;

        vm.submitAction = function(){
            $rootScope.app.Mask = true;
            if(vm.DynListForm.$invalid) return false;

            DynListService.Post(vm.formdata).then(function (res) {

            }).finally(function () {
                $state.go('app.admin.misc.dynlist.main', {dynTypeCode: $state.params.dynTypeCode});
            });
        };

        vm.cancelAction = function () {
            if (vm.DynListForm.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.admin.misc.dynlist.main', {dynTypeCode: $state.params.dynTypeCode});
                });
                return false;
            }
            $state.go('app.admin.misc.dynlist.main', {dynTypeCode: $state.params.dynTypeCode});
        };
    }
})();