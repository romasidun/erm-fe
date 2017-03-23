(function () {
    DynListMgmUpdateCtrl.$inject = ['$scope', '$rootScope', '$state', '$uibModal', '$filter', 'DynListService', 'Utils'];
    app.controller('DynListMgmUpdateCtrl', DynListMgmUpdateCtrl);

    function DynListMgmUpdateCtrl($scope, $rootScope, $state, $uibModal, $filter, DynListService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "Update Dynamic List";
        var rowId = $state.params.id;

        $rootScope.app.Mask = false;

        DynListService.GetOne(rowId).then(function (data) {
            vm.formdata = data;
        });

        vm.submitAction = function(){
            $rootScope.app.Mask = true;
            if(vm.DynListForm.$invalid) return false;

            DynListService.Put(rowId, vm.formdata).then(function (res) {

            }).finally(function () {
                $state.go('app.admin.misc.dynlist.main', {dynTypeCode: vm.formdata.dylistTypecode});
            });
        };

        vm.cancelAction = function () {
            if (vm.DynListForm.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.admin.misc.dynlist.main', {dynTypeCode: vm.formdata.dylistTypecode});
                });
                return false;
            }
            $state.go('app.admin.misc.dynlist.main', {dynTypeCode: vm.formdata.dylistTypecode});
        };
    }
})();